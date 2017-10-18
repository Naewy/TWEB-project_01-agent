const request = require('superagent');

/**
 * This class represent the agent which recuperate the data from the gitHub API.
 */
class Agent {
  /**
   * Constructor of the class, just taking the credentials.
   * @param credentials The gitHub token and username needed for authentication
   */
  constructor(credentials) {
    this.credentials = credentials;
  }
  /**
   * Method which select a random organization with a number of repo between given arguments.
   * @param nbReposMin The minimum number of repo for the search
   * @param nbReposMax The maximum number of repo for the search
   * @param entrepriseSelected Call back function
   */
  fetchAndProcessOrgnizations(nbReposMin, nbReposMax, entrepriseSelected) {
    const targetUrl = `https://api.github.com/search/users?q=+repos:${nbReposMin}..${nbReposMax}+type:org&state=all&per_page=100`;
    let organizations = [];
    /**
     * Internal function which recuperate the wanted data for an organization.
     * @param organization The organization to treat
     * @param credentials The gitHub credentials for authentication
     * @param done Call back function
     */
    function recuperateOrgData(organization, credentials, done) {
      let detailedOrg;
      request
        .get(organization.url)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          detailedOrg = {
            name: res.body.login,
            description: res.body.description,
            url: res.body.html_url,
            logo: res.body.avatar_url,
            repos: res.body.repos_url,
          };
          done(detailedOrg);
        });
    }
    /**
     * Internal function which recuperate one page of results.
     * @param pageUrl The page to process
     * @param credentials The gitHub credentials for authentication
     */
    function fetchAndProcessNewPage(pageUrl, credentials) {
      console.log(`Fetching organizations ${pageUrl}`);
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          organizations = organizations.concat(res.body.items);
          if (res.links.next) {
            fetchAndProcessNewPage(res.links.next, credentials);
          } else {
            const randomOrg = organizations[Math.round(Math.random() * organizations.length)];
            // We got the random entreprise, now let's select the wanted fields
            recuperateOrgData(randomOrg, credentials, (organization) => {
              entrepriseSelected(null, organization);
            });
          }
        });
    }

    fetchAndProcessNewPage(targetUrl, this.credentials);
  }
  /**
   * Method which recuperate the top repos of a random organization.
   * @param nbRepoToKeep How many repos keep in the top list
   * @param allReposAreAvailable Call back function
   */
  fetchAndProcessAllRepos(nbRepoToKeep, allReposAreAvailable) {
    this.fetchAndProcessOrgnizations(500, 2000, (err, organization) => {
      const targetUrl = `${organization.repos}?state=all&per_page=100`;
      let repos = [];
      /**
       * Internal function which recuperate on page of results.
       * @param pageUrl The page to process
       * @param credentials The gitHub credentials for authentication
       */
      function fetchAndProcessPage(pageUrl, credentials) {
        console.log(`Fetching repos ${pageUrl}`);
        request
          .get(pageUrl)
          .auth(credentials.username, credentials.token)
          .end((error, res) => {
            res.body.forEach((item) => {
              repos = repos.concat({
                id: item.id,
                name: item.name,
                description: item.description,
                url: item.html_url,
                nb_issues: item.open_issues_count,
              });
            });
            // If there is a next page
            if (res.links.next) {
              fetchAndProcessPage(res.links.next, credentials);
            } else {
              // Construction of the final data
              let topRepos = [JSON.parse(`{"name" : "${organization.name}", "description" : "${organization.description}", "url" : "${organization.url}", "logo" : "${organization.logo}"}`)];
              repos.sort((elem1, elem2) => elem2.nb_issues - elem1.nb_issues);
              for (let i = 0; i < nbRepoToKeep; i += 1) {
                topRepos = topRepos.concat(repos[i]);
              }
              allReposAreAvailable(null, topRepos);
            }
          });
      }

      fetchAndProcessPage(targetUrl, this.credentials);
    });
  }
}

module.exports = Agent;
