const GitHubPublisher = require('github-publish');

/**
 * Class representing the storage class which allow to push some data on a given repo
 */
class Storage {
  /**
   * Constructor of the class
   * @param username The username of the owner of the repo
   * @param token The token of the owner of the repo
   * @param repo Name of the repository where we want to push our file
   */
  constructor(username, token, repo) {
    this.username = username;
    this.token = token;
    this.repo = repo;
    this.publisher = new GitHubPublisher(token, username, repo);
  }
  /**
   * Method which allow the user to push data in a certain file on the repo
   * @param path Path where to push our data
   * @param content Content to push in the file
   * @param commitMessage Message of the commit
   * @param done Call back function
   */
  publish(path, content, commitMessage, done) {
    const options = {
      force: true,
      message: commitMessage,
    };
    this.publisher.publish(path, content, options)
      .then((result) => {
        done(undefined, result);
      })
      .catch((err) => {
        done(err);
      });
  }
}

module.exports = Storage;
