const request = require('superagent');
const fs = require('fs-extra');

class Agent {
  constructor(credentials) {
    this.credentials = credentials;
  }

  fetchAndProcessAllRepos(owner, nbRepoToKeep, allReposAreAvailable) {
    const targetUrl = `https://api.github.com/orgs/${owner}/repos?state=all&per_page=100`;
    let repos = [];
    repos = [];
    function fetchAndProcessPage(pageUrl, credentials) {
      console.log(`Fetching ${pageUrl}`);
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          res.body.forEach((item) => {
            repos = repos.concat({id: item.id, name: item.name, description: item.description, url: item.html_url, nb_issues: item.open_issues});
          });
          if (res.links.next) {
            fetchAndProcessPage(res.links.next, credentials);
          } else {
            let topRepos = [JSON.parse(`{"entreprise" : "${owner}"}`)];
            repos.sort((elem1, elem2) => elem2.nb_issues - elem1.nb_issues);
            for (let i = 0; i < nbRepoToKeep; i += 1) {
              topRepos = topRepos.concat(repos[i]);
            }
            allReposAreAvailable(null, topRepos);
          }
        });
    }
    fetchAndProcessPage(targetUrl, this.credentials);
  }
}

module.exports = Agent;
