const Storage = require('../src/storage.js');
const credentials = require('../github-credentials.json');

const should = require('chai').should();

/* For this test we just push a JSON file on the agent repo, to see if we can push */
describe('Storage', () => {
  it('should allow me to store a file on GitHub', (done) => {
    const repo = 'TWEB-project_01-agent';
    const storage = new Storage(credentials.username, credentials.token, repo);
    const content = {
      random: Math.random(),
    };
    storage.publish('test.json', JSON.stringify(content), 'mocha test launch to try storage', (err, result) => {
      should.not.exist(err);
      should.exist(result);
      done();
    });
  });
});
