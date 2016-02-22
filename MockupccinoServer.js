/// <reference path="defs/multer/multer.d.ts" />
/// <reference path="defs/body-parser/body-parser.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="defs/express/express.d.ts" />
/// <reference path="ConfigurationStructure.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="Endpoint.ts" />
//var multer = require('multer');
var bodyParser = require("body-parser");
var multer = require("multer");
var _ = require("lodash");
var express = require("express");
var MockupccinoServer = (function () {
    function MockupccinoServer(cfg, app) {
        this.config = cfg;
        this.expressServer = app;
        this.dataCache = [];
    }
    MockupccinoServer.prototype.launch = function () {
        var _this = this;
        this.config.load();
        //Add each endpoints
        this.config.getEndpoints().forEach(function (ep) {
            _this.addEndpoint(ep);
        });
        // Add the special endpoint for populating specific responses in the endpoints
        //TODO: Add the special endpoint for populating specific responses in the endpoints
        this.populateEndpoint();
        // Add static files if needed
        // Check if the global config is defined or not
        if (!_.isNil(this.config.getGlobalConfig())) {
            // Check if the server has to connect some static contents
            if (!_.isNil(this.config.getGlobalConfig().staticContent)) {
                this.config.getGlobalConfig().staticContent.forEach(function (element) {
                    if (!_.isNil(element)) {
                        _this.expressServer.use(element.url, express.static(element.path));
                    }
                });
            }
            // Set the Mockupccino server port
            if (!_.isNil(this.config.getGlobalConfig().port)) {
                this.expressServer.listen(this.config.getGlobalConfig().port);
                //TODO : The console logging configurable
                console.log("Mockupccino is ready and listening on port " + this.config.getGlobalConfig().port);
            }
            else {
                // Else set the default port 3000
                this.expressServer.listen(3000);
            }
        }
    };
    MockupccinoServer.prototype.addEndpoint = function (element) {
        var _this = this;
        //Declare each endpoint
        if (element.httpMethod === "POST") {
            this.expressServer.post(element.url, function (req, res) {
                _this.endpointCallback(element, res);
            });
            console.log("Adding: POST : " + element.url);
        }
        else if (element.httpMethod === "PUT") {
            this.expressServer.put(element.url, function (req, res) {
                _this.endpointCallback(element, res);
            });
            console.log("Adding: PUT : " + element.url);
        }
        else if (element.httpMethod === "DELETE") {
            this.expressServer.delete(element.url, function (req, res) {
                _this.endpointCallback(element, res);
            });
            console.log("Adding: DELETE : " + element.url);
        }
        else {
            this.expressServer.get(element.url, function (req, res) {
                _this.endpointCallback(element, res);
            });
            console.log("Adding: GET : " + element.url);
        }
    };
    MockupccinoServer.prototype.endpointCallback = function (element, res) {
        var _this = this;
        //Tell the console that this endpoint as been called
        console.log("Endpoint Call: " + element.url);
        //Set the CORS Header for local development
        //TODO: Make the CORS Headers configurable
        //setCORSHeaders(res, "http://*/*");
        //Set the return status code
        var sCode = this.getStatusCodeForEndPoint(element.url, element.httpMethod);
        if (sCode != null) {
            res.statusCode = sCode;
        }
        var time = 0;
        if (!_.isNil(element.loadSim)) {
            time = element.loadSim;
        }
        setTimeout(function () {
            //Set the body that has to be returned
            var response;
            response = _this.getResponseForEndpoint(element.url, element.httpMethod);
            res.send(response);
        }, time);
    };
    MockupccinoServer.prototype.getResponseForEndpoint = function (url, method) {
        //console.dir(dataCache);
        var myResp;
        myResp = this.dataCache[url + "-" + method];
        if (_.isNil(myResp)) {
            this.config.load();
            this.config.getEndpoints().forEach(function (element, index, array) {
                if ((element.url == url) && (element.httpMethod == method)) {
                    if (element.responseFile) {
                        //TODO: Make the console log configurable
                        console.log(element.responseFile);
                        myResp = JSON.parse(require('fs').readFileSync(element.responseFile, 'utf8'));
                    }
                    else {
                        //TODO: Make the console log configurable
                        console.log(element.response);
                        myResp = element.response;
                    }
                }
            });
        }
        return myResp;
    };
    MockupccinoServer.prototype.getStatusCodeForEndPoint = function (url, method) {
        this.config.load();
        var code = 500;
        this.config.getEndpoints().forEach(function (element, index, array) {
            if ((element.url == url) && (element.httpMethod == method)) {
                if (element.responseCode) {
                    code = element.responseCode;
                }
                else {
                    code = 200;
                }
            }
        });
        return code;
    };
    MockupccinoServer.prototype.populateEndpoint = function () {
        var _this = this;
        var upload = multer();
        this.expressServer.use(bodyParser.json()); // for parsing application/json
        this.expressServer.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        //app.use(express.bodyParser());
        this.expressServer.post('/populate', upload.any(), function (req, res, next) {
            console.log(req.body);
            _this.dataCache[req.body.url + "-" + req.body.method] = req.body.object;
            console.dir(_this.dataCache);
            //Prepare response
            res.statusCode = 200;
            res.send("");
        });
        console.log("Adding: POST : /populate");
    };
    return MockupccinoServer;
})();
module.exports = MockupccinoServer;
//# sourceMappingURL=MockupccinoServer.js.map