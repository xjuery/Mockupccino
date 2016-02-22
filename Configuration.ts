/// <reference path="defs/node/node.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="ConfigurationStructure.ts" />
import * as _ from "lodash";

class Configuration {
    configFile:string;
    configuration:ConfigurationStructure;

    constructor(cfgFile:string) {
        this.configFile = cfgFile;
        this.load();
    }

    load() {
        try {
            this.configuration = JSON.parse(require('fs').readFileSync(this.configFile, 'utf8'));
        }
        catch (err) {
            console.log("Unable to find or parse config file.");
            return;
        }
    }

    isValid():boolean {
        if (!_.isNil(this.configuration)) {
            return this.configuration.endpoints.length > 0;
        }

        return false;
    }

    getEndpoints():Endpoint[] {
        if (!_.isNil(this.configuration)) {
            if (this.configuration.endpoints.length > 0) {
                return this.configuration.endpoints;
            }
        }

        return null;
    }

    getGlobalConfig(): GlobalConfiguration {
        if (!_.isNil(this.configuration)) {
            if (!_.isNil(this.configuration.global)) {
                return this.configuration.global;
            }
        }

        return null;
    }
}

export = Configuration;