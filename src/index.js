const Agent = require('agent');
const credentials = require('../github-credentials.json');

const agent = new Agent(credentials);
agent.fetchAndProcessAllRepos('Microsoft', 10, (err, repo) => {
  if (err.isNull()) {
    agent.postTheData(repo, 'localhost:3000');
  } else {
    console.log('problem when fetching the data');
  }
});
