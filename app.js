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
            res.send(getResponseForEndpoint(configFile, element.url));
        });
    } else if (element.httpMethod === "PUT") {
        app.put(element.url, function (req, res) {
            res.send(getResponseForEndpoint(configFile, element.url));
        });
    } else if (element.httpMethod === "DELETE") {
        app.delete(element.url, function (req, res) {
            res.send(getResponseForEndpoint(configFile, element.url));
        });
    } else {//GET
        app.get(element.url, function (req, res) {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(getResponseForEndpoint(configFile, element.url));
        });
    }
}

function getResponseForEndpoint(cfgfile, url) {
    var cfg = JSON.parse(require('fs').readFileSync(cfgfile, 'utf8'));

    var resp = null;
    cfg.forEach(function (element, index, array) {
        if (element.url == url) {
            if (element.responseFile) {
                resp = JSON.parse(require('fs').readFileSync(element.responseFile, 'utf8'));
            } else {
                resp = element.response;
            }
        }
    });
    return resp;
}

config.forEach(addEndpoint);

// Add the special endpoint for populating specific responses in the endpoints


// Default port is 3000
var port = 3000;
app.listen(port);
console.log("MockCenter is ready and listening on port "+port);
var os = require("os");
config.forEach(function(element, index, array){
    console.log("-> http://"+os.hostname().toLowerCase()+":"+port+element.url);
});