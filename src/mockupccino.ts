import * as express from "express";
import * as _ from "lodash";
import * as program from "commander";
import * as chalk from "chalk";
import {Logger} from "./Logger";
import {Configuration} from "./Configuration";
import {MockupccinoServer} from "./MockupccinoServer";

export var App = main(process.argv);

process.on("uncaughtException", (err: any) => {
        if (err.errno === "EADDRINUSE") {
            Logger.error("Port already used by an other application/service");
        } else {
            Logger.error(err);
        }
        process.exit(1);
    }
);

/**
 * The main function of mockupccino
 * @param args The arguments provided in the CLI
 */
function main(args: Array<string>) {
    let version = "1.1.0";
    let configFile: string;

    // display the logo
    displayLogo(version);

    // Parse the command-line
    program
        .version(version)
        .arguments("[configurationfile]")
        .action(function (configurationfile) {
            Logger.info("Default config file overridden by : ");
            Logger.info(configurationfile);
            configFile = configurationfile;
        })
        .option("-p, --port <n>", "the server port", parseInt)
        .parse(args);

    // console.dir(program);
    // Check a config file has been given to cl
    if (_.isNil(configFile)) {
        // No config file has been given to cl
        // Is there a yaml config file in current dir?
        try {
            require("fs").accessSync("./mockupccino-config.yaml");
            configFile = "./mockupccino-config.yaml";
            Logger.info("Using default YAML config file format");
        } catch (err) {
        }

        // Check if, now, there is a config file specified
        if (_.isNil(configFile)) {
            // No config file
            // Is there a json config file in current dir ?
            try {
                require("fs").accessSync("./mockupccino-config.json");
                configFile = "./mockupccino-config.json";
                Logger.info("Using JSON config file format");
            } catch (err) {
            }
        }
    }

    // Next check if we've finally found a file
    if (!_.isNil(configFile)) {
        // Parse the config file
        let config: Configuration;
        config = new Configuration(configFile);

        // Check if configuration is valid
        if (config.isValid()) {
            // Override the server port by the one given to the cl, if there's one
            if (program.port) {
                config.setPort(program.port);
            }

            // Instanciate the express server
            let expressApp = express();

            Logger.info("Found " + config.getEndpoints().length + " endpoints");

            let mockupccinoServer = new MockupccinoServer(config, expressApp);
            mockupccinoServer.launch();

            return expressApp;
        } else {
            Logger.error("No endpoints found..Exit");
        }
    } else {
        // No config file was found :(
        Logger.error("No config file found..Exit");
    }
}

/**
 * Function to display the logo of Mockupccino
 */
function displayLogo(version: string) {
    // Prepare the version variable
    let newV = version + "                 ";
    let newVersion = newV.substring(0, 16);

    // Display the logo and Mockupccino info
    console.log(chalk.green(" _______              __    ") + chalk.white("                  ") + chalk.green("       __"));
    console.log(chalk.green("|   |   |.-----.----.|  |--.") + chalk.white(".--.--.-----.----.") + chalk.green(".----.|__|.-----.-----."));
    console.log(chalk.green("|       ||  _  |  __||    <|") + chalk.white("|  |  |  _  |  __|") + chalk.green("|  __||  ||     |  _  |"));
    console.log(chalk.green("|  |_|__||_____|____||__|__|") + chalk.white("|_____|   __|____|") + chalk.green("|____||__||__|__|_____|"));
    console.log(chalk.green("|__|") + chalk.cyan(" Mockupccino v" + newVersion) + chalk.white("|__|"));
    console.log(chalk.green("============================") + chalk.white("==================") + chalk.green("======================="));
    console.log(" ");
}