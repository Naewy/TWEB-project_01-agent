const Agent = require('./agent');
const credentials = require('../github-credentials.json');

const agent = new Agent(credentials);
agent.fetchAndProcessAllRepos('Microsoft', 10, (err, repo) => {
  agent.dataToFile(repo, './data/data.json');
});
