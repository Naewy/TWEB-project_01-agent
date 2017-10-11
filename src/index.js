const Agent = require('./agent');
const Storage = require('./storage');
const credentials = require('../github-credentials.json');

const repo = 'TWEB-project_01-client_side';
const agent = new Agent(credentials);
const storage = new Storage(credentials.username, credentials.token, repo);

agent.fetchAndProcessAllRepos('Microsoft', 10, (err, repoList) => {
  storage.publish('docs/data/data.json', JSON.stringify(repoList), 'Data updated', (error, result) => {
    if (!error) {
      console.log('Data successfully updated');
    } else {
      console.log(`An error occurred : ${error.body}`);
    }
  });
});
