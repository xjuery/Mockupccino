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

##Installation
In order to install Mockupccino, you only have to execute the following command `npm install mockupccino`.
If you want to install it globally, simply type `npm install -g mockupccino`.

##Launch the server in a terminal
In a terminal, simply type the following command to launch the Mockupccino server: `mockupccino <config file>`
By default, if the `<config file>`parameter is not set, the mockupccino server will try to find a file named `mockupccino-config.json` in the current working directory.
If you want to know how the content of the config file should look like, please see the `configuration file` section.

##Launch the server (in a project) with grunt
Currently, the best to launch the Mockupccino server via grunt is to use the `grunt-shell-spawn` grunt module. 
Please see the `grunt-shell-spawn` module documentation in order to know how to install it, and then create a task (in your gruntfile) that should look like this:
<pre>
shell: {
    mockupccino: {
        command: 'mockupccino <path to your config.json file> &',
        options: {
          async: true
        }
    }
}
</pre>

##The configuration file
The following example shows how the config file should look like:
<pre>
{
    "global":{
        "port": 4000,
        "staticContent":[
            {
                "url": "/",
                "path": "/home/user/myProject/app"
            },
            {
                "url": "/styles",
                "path": "/home/user/myProject/.tmp/styles"
            }
        ]
    },
    "endpoints":[
        {
            "url": "/test1",
            "httpMethod": "GET",
            "loadSim": 5000,
            "response": {"msg":"Test1 OK", "ReturnCode":"200"}
        },
        {
            "url": "/test2",
            "httpMethod": "POST",
            "response":"Everything is OK"
        },
        {
            "url": "/test3",
            "httpMethod": "PUT",
            "response":{"msg":"Test 3 is ok also", "ReturnCode":"200"}
        },
        {
            "url": "/test4",
            "httpMethod": "DELETE",
            "responseFile": "/home/user/myProject/app/test/myTestObject.json"
        }
    ]
}
</pre>

First thing to notice is that the file format is, currently, JSON. In this file, you can find 2 main sections: the global section and the endpoints section.

**The `global` section**

In this section, you can set the server port and the staticContent that should served by the server. The `port` attribute, is mandatory but the `staticContent` attribute is optional.

The `staticContent` attribute is an array of `path` that should be served as soon as the given `url` is requested.

**The `endpoints`section**

This section is an array of the different endpoints that should be exposed by the server. The `url` and `httpMethod` attributes are mandatory but the `response` or `responseFile` are optional.

Pay attention, there should be at least, and no more than, one of the response* attribute.

The `response` attribute allows to directly set the response (that Mockupcino should answer for a given url) in the config file. 
But, if the size of the response object is big, you can replace the `response` attribute by a `responseFile` attribute. This attribute will allow you to declare in which file the response should be retrieved.

The `loadSim` attribute, allows you, also, to simulate a server load. So if you want to simulate a real Production server and, for example, you know that the average response time (of this server) is 5000ms, you can simply configure the `loadSim` attribute with 5000. In that case, the Mockupccino server will wait during 5000ms before sending back the response to the REST Client.
This feature is usefull if you want to test how your client will react if the backend server is overloaded.

##Future features
1. Ability to configure the CORS Headers
2. Ability to use a YAML/Swagger config file
3. grunt/gulp module
4. CLI interface for creating the config file

