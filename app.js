//Application requirements
var express = require('express');

//Retrieve which config file should be used
var configFile = './config.json';
process.argv.forEach(function (val, index, array) {
    if (index === 2) {
        console.log("Default config file overridden by :");
        console.log(val);
        configFile = val;
    }
});

//Parse the config file
var config = JSON.parse(require('fs').readFileSync(configFile, 'utf8'));

// Create app
var app = module.exports = express();

//Check the number of configured endpoints
console.log("Found " + config.length + " endpoints");

//Configure the endpoints
if (config.length > 0) {
    config.forEach(addEndpoint);
}
// Add the special endpoint for populating specific responses in the endpoints
//TODO: Add the special endpoint for populating specific responses in the endpoints

// Add static files if needed
//TODO: Make the static connect configurable
app.use("/", express.static("/home/xavier/Programmation/Workspaces/KARADoc/app"));
app.use("/styles", express.static("/home/xavier/Programmation/Workspaces/KARADoc/.tmp/styles"));

// The End: launch the server on default port 3000
//TODO: Make the server port configurable
var port = 3000;
app.listen(port);
//TODO: The console logging configurable
console.log("MockCenter is ready and listening on port " + port);

/**
 * Function that adds all the necessary configuration for 1 endpoint
 * @param element: The config element taken from the config file
 * @param index
 * @param array
 */
function addEndpoint(element, index, array) {
    //Declare each endpoint
    if (element.httpMethod === "POST") {
        app.post(element.url, endpointCallback(element, res));
        console.log("Adding: POST : " + element.url);
    } else if (element.httpMethod === "PUT") {
        app.put(element.url, endpointCallback(element, res));
        console.log("Adding: PUT : " + element.url);
    } else if (element.httpMethod === "DELETE") {
        app.delete(element.url, endpointCallback(element, res));
        console.log("Adding: DELETE : " + element.url);
    } else {//GET
        app.get(element.url, endpointCallback(element, res));
        console.log("Adding: GET : " + element.url);
    }
}

//
/**
 * Default callback function for the endpoints
 * @param element: Config element taken from the config file
 * @param res: HTTP response
 */
function endpointCallback(element, res) {
    //Tell the console that this endpoint as been called
    console.log("Endpoint Call: " + element.url);

    //Set the CORS Header for local development
    //TODO: Make the CORS Headers configurable
    setCORSHeaders(res, "http://localhost:9000")

    //Set the return status code
    var sCode = getStatusCodeForEndPoint(configFile, element.url, element.httpMethod);
    if (sCode != null) {
        res.statusCode = sCode;
    }

    //Set the body that has to be returned
    res.send(getResponseForEndpoint(configFile, element.url, element.httpMethod));
}

/**
 * Function that calculates the answer that should be send back to the REST Client
 * @param cfgfile The global configuration file
 * @param url The endpoint URL (this URL and the HTTP method are considered as a primary key for the endpoint)
 * @param method The HTTP method of the endpoint
 * @returns {*} The response that should be sent back to the REST client
 */
function getResponseForEndpoint(cfgfile, url, method) {
    var cfg = JSON.parse(require('fs').readFileSync(cfgfile, 'utf8'));

    var resp = null;
    cfg.forEach(function (element, index, array) {
        if ((element.url == url) && (element.httpMethod == method)) {
            if (element.responseFile) {
                //TODO: Make the console log configurable
                console.log(element.responseFile);
                resp = JSON.parse(require('fs').readFileSync(element.responseFile, 'utf8'));

                return;
            } else {
                //TODO: Make the console log configurable
                console.log(element.response);
                resp = element.response;

                return;
            }
        }
    });
    //TODO: Make the console log configurable
    console.log(resp);
    return resp;
}

/**
 * Function that calculates the status code that should returned to the REST client
 * @param cfgfile The global configuration file
 * @param url The endpoint URL (this URL and the HTTP method are considered as a primary key for the endpoint)
 * @param method The HTTP method
 * @returns {*}
 */
function getStatusCodeForEndPoint(cfgfile, url, method) {
    var cfg = JSON.parse(require('fs').readFileSync(cfgfile, 'utf8'));

    var code = null;
    cfg.forEach(function (element, index, array) {
        if ((element.url == url) && (element.httpMethod == method)) {
            if (element.responseCode) {
                code = element.responseCode;
            } else {
                code = 200;
            }
        }
    });
    return code;
}

/**
 * Function that sets the CORS headers in order to allow the Mockcenter to be contacted by a client in a different domain.
 * @param httpResponse The response that will be sent back to the client.
 * @param originName The origin name of the client
 */
function setCORSHeaders(httpResponse, originName) {
    //TODO: Make the liste of CORS headers configurable
    httpResponse.header("Access-Control-Allow-Origin", originName /*"http://localhost:9000"*/);
    httpResponse.header("Access-Control-Allow-Credentials", "true");
    httpResponse.header("Cache-Control", "no-cache");
}

