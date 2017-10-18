# TWEB 2017

## GitHub Analytics
Matthieu Chatelan, Lara Chauffoureaux

---

This project uses a collection of other repos in order to work

#### Architecture
The GitHub analytics projects is based on several components. First of all, the client-side of the project is hosted directly on github via GitHub Pages. You can consult the website directly with the following link : 

https://naewy.github.io/TWEB-project_01-client_side/

And its code is available here : 

https://github.com/Naewy/TWEB-project_01-client_side/

You are now on the repository containing the agent's code. This agent is the entity which directly recuperate data from the [GitHub API](https://developer.github.com/v3/) and which commit and push them on the client-side repository. 
For the purpose of this project, the agent is deployed in the cloud on heroku. You will find more details in [this section](#heroku-deployment).

Please note that the agent's code is fully commented so you can check it if you want some details about the implementation.

#### Local test
If you want to test the agent locally, use it as a simple *node.js* application : 
	
	$ npm install 														-> to install needed node_modules
	$ node src/index.js													-> to run the agent
	$ node_modules/mocha/bin/mocha --timeout 20000 test/agent.js		-> to launch the test of the agent
	$ node_modules/mocha/bin/mocha --timeout 20000 test/storage.js		-> to launch the test of the push/commit on the git 
	
When running this commands you will have some errors about a file named *github-credentials.json*. You have to create this json file, it has to contain a github username and an associated GitHub token. 
	
	{
		"username" : "yourUserName",
		"token" : "yourToken"
	}

You will need this information for the multiple access to the GitHub API and you can create your token by following this tutorial : 
[https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
	

#### Heroku deployment

To deploy and schedule the agent on heroku, we followed a small tutorial that you can find in the [sources](#sources). But here is an overview of the main steps : 

**1. Heroku installation and initialization**

Installation : 

	$ sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
	$ curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
	$ sudo apt-get install heroku 

Initialization (you will need to create a heroku account) : 

	$ heroku login
	$ heroku create
	$ heroku addons:add scheduler 

**2. Preparation for deployment**

Heroku will need a folder *bin* to automatically find what to launch. You can remark in our arborescence that our *bin* folder contain a file without extension named *agent*.
In this file you will find exactly the same code as in *index.js* with a shebang indicating that the code is javascript. We just replaced the credentials file with two environment variables that we can set in heroku like this : 

	$ heroku config:set GITHUB_USERNAME = yourUserName
	$ heroku config:set GITHUB_TOKEN = yourToken
	
**3. Deployment**

Once everything is commited and pushed normally in GitHub, the deployment can be done by entering the following command : 
		
	$ git push heroku master
	
To test if the deployment can process correctly, just run : 
	
	$ heroku run agent

**4. Scheduler**

To open the scheduler : 

	$ heroku addons:open scheduler 
	
And the task to schedule need to have the name of your file in the *bin* folder.

#### Sources
* [https://developer.github.com/v3/orgs/](https://developer.github.com/v3/orgs/)
* [https://developer.github.com/v3/repos/](https://developer.github.com/v3/repos/)
* [https://developer.github.com/v3/search/](https://developer.github.com/v3/search/)
* [http://www.spacjer.com/blog/2014/02/10/defining-node-dot-js-task-for-heroku-scheduler/](http://www.spacjer.com/blog/2014/02/10/defining-node-dot-js-task-for-heroku-scheduler/)
* [https://devcenter.heroku.com/articles/getting-started-with-nodejs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* [https://visionmedia.github.io/superagent/](https://visionmedia.github.io/superagent/)
* [https://github.com/voxpelli/node-github-publish](https://github.com/voxpelli/node-github-publish)

And obviously all the documentation given during the TWEB course. 
