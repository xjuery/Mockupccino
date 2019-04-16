
Mockupccino - a REST/JSON server simulation tool
================================================

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bc0a6c8a1b4548929388d903d068ff5d)](https://www.codacy.com/app/xjuery/Mockupccino?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xjuery/Mockupccino&amp;utm_campaign=Badge_Grade) [![NPM version](https://img.shields.io/badge/npm-v3.3.12-brightgreen.svg)](https://www.npmjs.com/package/mockupccino) [![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://www.npmjs.com/package/mockupccino)


License [LGPL v3](https://github.com/xjuery/Mockupccino/blob/master/LICENSE)

## Overview
Mockupccino is a REST/JSON server simulation tool which allow developers to test their REST clients.

Mockupccino doesn't require any intrusive configuration into your projects, just run Mockupccino with its configuration file and that's all.
The main objective of Mockupccino is to prevent your projects from the risk of webservices connection bugs that could be caused by an intrusive faulty configuration.
Its use was thought to be as simple as possible, you just have to create a file that describes how the REST webservice must respond and launch the Mockupccino server.
 
### Particular case of projects that need CORS Headers:
If you are developping the front-end and back-end with different tools or the front-end files, in your dev environnement, are not accessible via the same domain (for ex. front-end on http://localhost:3000 and backend on http://localhost:9000 ), you may experience problems because your web browser will not allow you to access cross domain resources.
As a solution, Mockupccino can work in 2 modes:
1. CORS Headers mode: in that mode, Mockupccino will automatically set the right CORS headers in order to allow you to access the REST webservices.
2. Serve static part mode: in that mode, Mockupccino will also serve the html, js and other files in your frontend as if everything was on the same test server.

Installation
------------
### Local install
```
npm install mockupccino
```

### Global install
```
npm install -g mockupccino
```

Usage
-----

### Getting some help

Simplify type the following command:
```
mockupccino --help
```
Then you'll see some info about the command line arguments: 
```
  Usage: mockupccino [options] [configurationfile]

  Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -p, --port <n>  the server port
```


### Launching the server in a terminal
```
mockupccino <config file>
```

By default, if the `<config file>`parameter is not set, the mockupccino server will try to find a file named `mockupccino-config.json` in the current working directory.
Please see the `configuration file` section, if you want to know how to setup the Mockupccino server.

### Launching the server (within a project) with grunt
Currently, the best way to launch the Mockupccino server via grunt is to use the `grunt-shell-spawn` grunt module. 
Please see the `grunt-shell-spawn` module documentation in order to know how to install it. Then create a task (in your gruntfile) that should look like this:
```
shell: {
    mockupccino: {
        command: 'mockupccino <path to your config.json file> &',
        options: {
          async: true
        }
    }
}
```

## The configuration file
The following example shows how the config file should look like. Mockupccino uses the file extension to determine which format to use (i.e. `.yaml` for YAML format, `.json` for JSON format).

### JSON Format

```json
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
```

### YAML Format

```yaml
global:
  port: 4000
  staticContent:
    - url: "/"
      path: "/home/user/myProject/app"

    - url: "/styles"
      path: "/home/user/myProject/.tmp/styles"

endpoints:
  - url: "/test1"
    httpMethod: "GET"
    loadSim: 5000
    response:  {"msg":"Test1 OK", "ReturnCode":"200"}

  - url: "/test2"
    httpMethod: "POST"
    response: "Everything is OK"

  - url: "/test3"
    httpMethod: "PUT"
    response: {"msg":"Test 3 is ok also", "ReturnCode":"200"}

  - url: "/test4"
    httpMethod: "DELETE"
    responseFile: "/home/user/myProject/app/test/myTestObject.json"
```
In this file, you can find 2 main sections: the global section and the endpoints section.

### The `global` section

In this section, you can set the server port and the staticContent that should served by the server. 
- `port`: (Mandatory) mockupccino server port 
- `staticContent`: (Optional) Array of `path` that should be served as soon as the given `url` is requested.

### The `endpoints`section

This section is an array of the different endpoints that should be exposed by the server. 
- `url`: (Mandatory) endpoint's url exposed by the server
- `httpMethod`: (Mandatory) endpoint's HTTP method
- `response`: Response that Mockupcino should answer for a given url
- `responseFile`: path of the file where the response is set.
- `loadSim`: (Optional) Amount of milliseconds the Mockupccino server will wait in order to simulate a average server response time.

Pay attention, there should be at least, and no more than, one of the response* attribute.

## Populate test data

As you probably noticed, the configuration file of Mockupccino allows you to define test data that will be used as a response (for a given url) by the internal server.
But what if you want to dynamically populate those test data during your tests?
This is possible thanks to the special populate endpoint.
If you have a look at the command line logs when you start a Mockupccino server, you probably already noticed that one endpoint has been automatically added to the list you have provided.
This specific endpoint allows you send data to the internal data cache of Mockupccino. This data will then be used by the server as a response.

If you want to populate the internal data cache of mockupccino, simply POST data to the `/populate` endpoint with the following structure, in the body of the REST request:
```
{
    "url": "<url that will have to answer the following data>",
    "method": "<HTTP method of the endpoint>",
    "object": "<object that will be send back by mockupccino once the URL and http method are requested>"
}
```
Be sure that the specifed URL and HTTP method are also declared as endpoint in the endpoint section of the configuration file.

For example:
In the endpoint section of the configuration file:
```
 - u,rl: "/test2"
      httpMethod: "POST"
      response: "Everything is OK"
```
I can then send a POST request to the /populate endpoint with the following body:
```
{
    "url": "/test2",
    "method": "POST",
    "object": "Overridden message"
}
```

Now, each time we request the `/test2` endpoint with the `POST` HTTP Method, the answer will be `Overridden message`.

## Future features
1. Ability to configure the CORS Headers
2. Ability to use a YAML/Swagger config file

