# Mockupccino

##Overview
Mockupccino is a REST/JSON server simulation tool.

Mockupccino doesn't require any intrusive configuration into your projects, just run Mockupccino with its configuration file and that's all.
The main objective of Mockupccino is to prevent your projects from the risk of webservices connection bugs that could be caused by an intrusive faulty configuration.
Its use was thought to be as simple as possible, you just have to create a file that describes how the REST webservice must respond and launch the Mockupccino server.
 
### Particular case of projects that need CORS Headers:
If you are developping the front-end and back-end with different tools or the front-end files, in your dev environnement, are not accessible via the same domain (for ex. front-end on http://localhost:3000 and backend on http://localhost:9000 ), you may experience problems because your web browser will not allow you to access cross domain resources.
As a solution, Mockupccino can work in 2 modes:
1. CORS Headers mode: in that mode, Mockupccino will automatically set the right CORS headers in order to allow you to access the REST webservices.
2. Serve static part mode: in that mode, Mockupccino will also serve the html, js and other files in your frontend as if everything was on the same test server.

##The configuration file

##Launch the server in a terminal

##Launch the server (in a project) with grunt

