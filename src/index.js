const Agent = require('./agent');
const credentials = require('../github-credentials.json');

const agent = new Agent(credentials);
agent.fetchAndProcessAllRepos('Microsoft', 10, (err, repo) => {
  agent.postTheData(repo, 'localhost:3000/data');
});
