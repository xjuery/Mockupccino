//Application requirements
var express = require('express');

var configFile = './config.json';
process.argv.forEach(function (val, index, array) {
    if(index === 2){
        console.log("Default config file overridden by :");
        console.log(val);
        configFile = val;
    }
});

//var config = require(configFile);
var config = JSON.parse(require('fs').readFileSync(configFile, 'utf8'));

// Create app
var app = module.exports = express();

//Check the number of configured endpoints
console.log("Found "+config.length+" endpoints");

//Load the endpoints
function addEndpoint(element, index, array) {
    //Verify which type of response must be sent
    var response = "";
    if(element.responseFile){
        response = JSON.parse(require('fs').readFileSync(element.responseFile, 'utf8'));
    }else{
        response = element.response;
    }

    //Declare each endpoint
    if(element.httpMethod === "POST"){
        app.post(element.url, function(req, res) {
            res.send(response);
        });
    }else if (element.httpMethod === "PUT"){
        app.put(element.url, function(req, res) {
            res.send(response);
        });
    }else if (element.httpMethod === "DELETE"){
        app.delete(element.url, function(req, res) {
            res.send(response);
        });
    }else{//GET
        app.get(element.url, function(req, res) {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(response);
        });
    }
}

config.forEach(addEndpoint);

// Default port is 3000
app.listen(3000);
console.log("Open Source Mockup Center is ready");