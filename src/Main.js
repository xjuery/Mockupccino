"use strict";
var express = require("express");
var _ = require("lodash");
var Logger = require("./Logger");
var Configuration = require("./Configuration");
var MockupccinoServer = require("./MockupccinoServer");
exports.App = main(process.argv);
process.on("uncaughtException", function (err) {
    if (err.errno === "EADDRINUSE") {
        Logger.error("Port already used by an other application/service");
    }
    else {
        Logger.error(err);
    }
    process.exit(1);
});
function main(args) {
    var expressApp = express();
    displayLogo();
    var configFile;
    args.forEach(function (cfg, index) {
        if (index === 2) {
            Logger.info("Default config file overridden by : ");
            Logger.info(cfg);
            configFile = cfg;
        }
    });
    if (_.isNil(configFile)) {
        try {
            require("fs").accessSync("./mockupccino-config.yaml");
            configFile = "./mockupccino-config.yaml";
            Logger.info("Using default YAML config file format");
        }
        catch (err) {
        }
    }
    if (_.isNil(configFile)) {
        try {
            require("fs").accessSync("./mockupccino-config.json");
            configFile = "./mockupccino-config.json";
            Logger.info("Using default JSON config file format");
        }
        catch (err) {
        }
    }
    var config;
    config = new Configuration(configFile);
    if (config.isValid()) {
        Logger.info("Found " + config.getEndpoints().length + " endpoints");
        var mockupccinoServer = new MockupccinoServer(config, expressApp);
        mockupccinoServer.launch();
        return expressApp;
    }
    else {
        Logger.error("No endpoints found..Exit");
    }
}
function displayLogo() {
    console.log(" _______              __                           __");
    console.log("|   |   |.-----.----.|  |--.--.--.-----.----.----.|__|.-----.-----.");
    console.log("|       ||  _  |  __||    <|  |  |  _  |  __|  __||  ||     |  _  |");
    console.log("|  |_|__||_____|____||__|__|_____|   __|____|____||__||__|__|_____|");
    console.log("|__| Mockupccino v1.1.0          |__|");
    console.log("===================================================================");
    console.log(" ");
}
//# sourceMappingURL=Main.js.map