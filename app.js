//Application requirements
var express = require('express');
var config = require('./config.js');

// Create app
var app = module.exports = express();

//Check the number of configured endpoints
console.log("Found "+config.endpoints.length+" endpoints");

//Load the endpoints
function addEndpoint(element, index, array) {
    if(element.httpMethod === "POST"){
        app.post(element.url, function(req, res) {
            res.send(element.response);
        });
    }else if (element.httpMethod === "PUT"){
        app.put(element.url, function(req, res) {
            res.send(element.response);
        });
    }else if (element.httpMethod === "DELETE"){
        app.delete(element.url, function(req, res) {
            res.send(element.response);
        });
    }else{//GET
        app.get(element.url, function(req, res) {
            res.send(element.response);
        });
    }
}

config.endpoints.forEach(addEndpoint);

// Default port is 3000
app.listen(3000);
console.log("Open Source Mockup Center is ready");