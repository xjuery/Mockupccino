/// <reference path="defs/node/node.d.ts" />
/// <reference path="defs/express/express.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="ConfigurationStructure.ts" />
/// <reference path="MockupccinoServer.ts" />
/// <reference path="Configuration.ts" />

//Application dependencies
import * as express from "express";
import * as _ from "lodash";
import MockupccinoServer = require("./MockupccinoServer");
import Configuration = require("./Configuration");
export var App = main(process.argv);

/**
 * The main function of mockupccino
 * @param args The arguments provided in the CLI
 */
function main(args:Array<string>) {
    //Instanciate of the express server
    var expressApp = express();

    //display the logo
    displayLogo();

    //Define which config file should be used
    var configFile:string = './mockupccino-config.json';
    args.forEach(
        (cfg:string, index:number) => {
            if (index === 2) {
                console.log("Default config file overridden by :");
                console.log(cfg);
                configFile = cfg;
            }
        }
    );

    //Parse the config file
    var config:Configuration;
    config = new Configuration(configFile);

    //Check if configuration is valid
    if(config.isValid()){
        console.log("Found " + config.getEndpoints().length + " endpoints");

        var mockupccinoServer = new MockupccinoServer(config, expressApp);
        mockupccinoServer.launch();

        return expressApp;
    } else {
        console.log("No endpoints found..Exit");
    }
}

/**
 * Function to display the logo of Mockupccino
 */
function displayLogo(){
    //Display the logo and Mockupccino info
    console.log(" _______              __                           __");
    console.log("|   |   |.-----.----.|  |--.--.--.-----.----.----.|__|.-----.-----.");
    console.log("|       ||  _  |  __||    <|  |  |  _  |  __|  __||  ||     |  _  |");
    console.log("|  |_|__||_____|____||__|__|_____|   __|____|____||__||__|__|_____|");
    console.log("|__| Mockupccino v1.0.3          |__|");
    console.log("===================================================================");
    console.log("");
}