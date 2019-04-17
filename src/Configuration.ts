import * as _ from "lodash";
import * as yaml from "js-yaml";
import {Logger} from "./Logger"
import {ConfigurationStructure} from "./ConfigurationStructure";
import {Endpoint} from "./Endpoint";
import {GlobalConfiguration} from "./GlobalConfiguration";

export class Configuration {
    configFile: string;
    // configuration: ConfigurationStructure;
    global: GlobalConfiguration;

    endpoints: Array<Endpoint>;

    constructor(cfgFile: string) {
        this.configFile = cfgFile;
        this.load();
    }

    private load(): void {
        let conf = this.loadFile(this.configFile);
        this.global = conf.global;
        this.endpoints = conf.endpoints;
    }

    public reloadEndpoints(): void {
        let conf = this.loadFile(this.configFile);
        this.endpoints = conf.endpoints;
    }

    public setPort(port: number): void {
        this.global.port = port;
    }

    private loadFile(conf: string): ConfigurationStructure {
        if (_.endsWith(this.configFile, ".json")) {
            return this.parseJSONConfig(this.configFile);
        } else if (_.endsWith(this.configFile, ".yaml")) {
            return this.parseYAMLConfig(this.configFile);
        }
    }

    private parseJSONConfig(cFile: string): ConfigurationStructure {
        try {
            return JSON.parse(require("fs").readFileSync(cFile, "utf8"));
        } catch (err) {
            console.log("Unable to find or parse config file.");
            return;
        }
    };

    private parseYAMLConfig(cFile: string): ConfigurationStructure {
        let parsedConfig: any;
        try {
            parsedConfig = yaml.safeLoad(require("fs").readFileSync(cFile, "utf8"));

            if (!_.isNil(parsedConfig.swagger)) {
                Logger.error("Sorry the Swagger/YAML format is not yet implemented.");
                return null;
            } else {
                return parsedConfig;
            }
        } catch (err) {
            console.log("Unable to find or parse config file.");
            return null;
        }
    }

    public isValid(): boolean {
        if (!_.isNil(this.endpoints)) {
            return this.endpoints.length > 0;
        }

        return false;
    }

    public getEndpoints(): Endpoint[] {
        if (!_.isNil(this.endpoints)) {
            if (this.endpoints.length > 0) {
                return this.endpoints;
            }
        }

        return null;
    }

    public getGlobalConfig(): GlobalConfiguration {
        if (!_.isNil(this.global)) {
            if (!_.isNil(this.global)) {
                return this.global;
            }
        }

        return null;
    }
}
