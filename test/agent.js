const chai = require('chai');
const credentials = require('../github-credentials.json');
const Agent = require('../src/agent.js');

const should = chai.should();

describe('The agent', () => {
  it('should fetch repos', (done) => {
    const agent = new Agent(credentials);
    agent.fetchAndProcessAllRepos(10, (err, repos) => {
      should.not.exist(err);
      repos.should.be.an('array');
      done();
    });
  });
});
