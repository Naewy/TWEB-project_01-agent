const request = require('superagent');
const fs = require('fs-extra');

class Agent {
  constructor(credentials) {
    this.credentials = credentials;
  }

  fetchAndProcessOrgnizations(nbReposMin, nbReposMax, entrepriseSelected) {
    const targetUrl = `https://api.github.com/search/users?q=+repos:${nbReposMin}..${nbReposMax}+type:org&state=all&per_page=100`;
    let organizations = [];

    function recuperateOrgData(organization, credentials, done) {
      let detailedOrg;
      request
        .get(organization.url)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          detailedOrg = {
            name: res.body.login, description: res.body.description, url: res.body.html_url, logo: res.body.avatar_url, repos: res.body.repos_url,
          };
          done(detailedOrg);
        });
    }
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

  fetchAndProcessAllRepos(nbRepoToKeep, allReposAreAvailable) {
    this.fetchAndProcessOrgnizations(500, 2000, (err, organization) => {
      const targetUrl = `${organization.repos}?state=all&per_page=100`;
      let repos = [];
      function fetchAndProcessPage(pageUrl, credentials) {
        console.log(`Fetching repos ${pageUrl}`);
        request
          .get(pageUrl)
          .auth(credentials.username, credentials.token)
          .end((error, res) => {
            res.body.forEach((item) => {
              repos = repos.concat({
                id: item.id, name: item.name, description: item.description, url: item.html_url, nb_issues: item.open_issues_count,
              });
            });
            if (res.links.next) {
              fetchAndProcessPage(res.links.next, credentials);
            } else {
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
