//Application requirements
var express = require('express');

var configFile = './config.json';
process.argv.forEach(function (val, index, array) {
    if (index === 2) {
        console.log("Default config file overridden by :");
        console.log(val);
        configFile = val;
    }
});

var config = JSON.parse(require('fs').readFileSync(configFile, 'utf8'));

// Create app
var app = module.exports = express();

//Check the number of configured endpoints
console.log("Found " + config.length + " endpoints");

//Load the endpoints
function addEndpoint(element, index, array) {
    //Declare each endpoint
    if (element.httpMethod === "POST") {
        app.post(element.url, function (req, res) {
            console.log("Endpoint Call: "+element.url);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Cache-Control", "no-cache");

            res.statusCode = getStatusCodeForEndPoint(configFile, element.url, element.httpMethod);
            res.send(getResponseForEndpoint(configFile, element.url, element.httpMethod));
            console.log(res.headersSent);
        });
        console.log("Adding: POST : "+element.url);
    } else if (element.httpMethod === "PUT") {
        app.put(element.url, function (req, res) {
            console.log("Endpoint Call: "+element.url);
            //console.log(req);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Cache-Control", "no-cache");

            res.statusCode = getStatusCodeForEndPoint(configFile, element.url, element.httpMethod);
            res.send(getResponseForEndpoint(configFile, element.url, element.httpMethod));
        });
        console.log("Adding: PUT : "+element.url);
    } else if (element.httpMethod === "DELETE") {
        app.delete(element.url, function (req, res) {
            console.log("Endpoint Call: "+element.url);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Cache-Control", "no-cache");

            res.statusCode = getStatusCodeForEndPoint(configFile, element.url, element.httpMethod);
            res.send(getResponseForEndpoint(configFile, element.url, element.httpMethod));
        });
        console.log("Adding: DELETE : "+element.url);
    } else {//GET
        app.get(element.url, function (req, res) {
            console.log("Endpoint Call: "+element.url);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Cache-Control", "no-cache");

            res.statusCode = getStatusCodeForEndPoint(configFile, element.url, element.httpMethod);
            res.send(getResponseForEndpoint(configFile, element.url, element.httpMethod));
        });
        console.log("Adding: GET : "+element.url);
    }
}

function getResponseForEndpoint(cfgfile, url, method) {
    var cfg = JSON.parse(require('fs').readFileSync(cfgfile, 'utf8'));

    var resp = null;
    cfg.forEach(function (element, index, array) {
        if ((element.url == url)&&(element.httpMethod == method)) {
            if (element.responseFile) {
                console.log(element.responseFile);
                resp = JSON.parse(require('fs').readFileSync(element.responseFile, 'utf8'));

                return;
            } else {
                console.log(element.response);
                resp = element.response;

                return;
            }
        }
    });
    console.log(resp);
    return resp;
}

function getStatusCodeForEndPoint(cfgfile, url, method) {
    var cfg = JSON.parse(require('fs').readFileSync(cfgfile, 'utf8'));

    var code = null;
    cfg.forEach(function (element, index, array) {
        if ((element.url == url)&&(element.httpMethod == method)) {
            if (element.responseCode) {
                code = element.responseCode;
            } else {
                code = 200;
            }
        }
    });
    return code;
}

config.forEach(addEndpoint);

// Add the special endpoint for populating specific responses in the endpoints


// Default port is 3000
var port = 3000;
app.listen(port);
console.log("MockCenter is ready and listening on port "+port);
var os = require("os");
//config.forEach(function(element, index, array){
//    console.log("-> http://"+os.hostname().toLowerCase()+":"+port+element.url);
//});