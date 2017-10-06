const request = require('superagent');
const fs = require('fs');

class Agent {
  constructor(credentials) {
    this.credentials = credentials;
  }

  fetchAndProcessAllRepos(owner, nbRepoToKeep, allReposAreAvailable) {
    const targetUrl = `https://api.github.com/orgs/${owner}/repos?state=all&per_page=100`;
    let repos = [];
    function fetchAndProcessPage(pageUrl, credentials) {
      console.log(`Fetching ${pageUrl}`);
      request
        .get(pageUrl)
        .auth(credentials.username, credentials.token)
        .end((err, res) => {
          res.body.forEach((item) => {
            repos = repos.concat({ id: item.id, name: item.name, nb_issues: item.open_issues });
          });
          if (res.links.next) {
            fetchAndProcessPage(res.links.next, credentials);
          } else {
            let topRepos = [];
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

  /*
  postTheData(data, url) {
    request
      .post(url)
      .send(data)
      .end((err, res) => {
        if (err || !res.ok) {
          console.log('An error occured');
        } else {
          console.log('Data send to the server');
        }
      });
  }
  */

  dataToFile(data, fileName) {
    fs.writeFile(fileName, data, (err) => {
      if (!err) {
        console.log('File created');
      } else {
        console.log(err);
      }
    });
  }
}

module.exports = Agent;
