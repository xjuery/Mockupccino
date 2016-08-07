import * as express from "express";
import * as _ from "lodash";
import * as program from "commander";
import * as chalk from "chalk";
import {Logger} from "./Logger";
import {Configuration} from "./Configuration";
import {InternalServer} from "./InternalServer";

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
    let version = "1.2.0";
    let configFile: string;

    // display the logo
    displayLogo(version);

    // Parse the command-line
    let cliProgram: any = program.version(version);
    cliProgram
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

    // Next check if we've finally found a file (via cli or by default)
    if (!_.isNil(configFile)) {
        // Parse the config file
        let config: Configuration;
        config = new Configuration(configFile);

        // Check if configuration is valid
        if (config.isValid()) {
            // Override the server port by the one given to the cl, if there's one
            if (cliProgram.port) {
                config.setPort(cliProgram.port);
            }

            // Instanciate the express server
            let expressApp = express();

            Logger.info("Found " + config.getEndpoints().length + " endpoints");

            let iServer = new InternalServer(config, expressApp);
            iServer.launch();

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
    let newV = version + "                      ";
    let newVersion = newV.substring(0, 19);

    // Display the logo and Mockupccino info chalk.green(
    console.log(chalk.green(" _______ ") + chalk.white("       ") + chalk.green("      ") + chalk.white(" __    ") + chalk.green("       ") + chalk.white("       ") + chalk.green("      ") + chalk.white("      ") + chalk.green(" __"));
    console.log(chalk.green("|   |   |") + chalk.white(".-----.") + chalk.green(".----.") + chalk.white("|  |--.") + chalk.green(".--.--.") + chalk.white(".-----.") + chalk.green(".----.") + chalk.white(".----.") + chalk.green("|__|") + chalk.white(".-----.") + chalk.green(".-----."));
    console.log(chalk.green("|       |") + chalk.white("|  _  |") + chalk.green("|  __|") + chalk.white("|    <|") + chalk.green("|  |  |") + chalk.white("|  _  |") + chalk.green("|  __|") + chalk.white("|  __|") + chalk.green("|  |") + chalk.white("|     |") + chalk.green("|  _  |"));
    console.log(chalk.green("|  |_|__|") + chalk.white("|_____|") + chalk.green("|____|") + chalk.white("|__|__|") + chalk.green("|_____|") + chalk.white("|   __|") + chalk.green("|____|") + chalk.white("|____|") + chalk.green("|__|") + chalk.white("|__|__|") + chalk.green("|_____|"));
    console.log(chalk.green("|__|") + chalk.cyan("Mockupccino v" + newVersion) + chalk.white("|__|"));
    console.log(chalk.green("========================================================================="));
    console.log(" ");
}