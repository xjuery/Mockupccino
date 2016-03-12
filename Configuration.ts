/// <reference path="defs/node/node.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />

import * as _ from 'lodash';
var yaml = require('js-yaml');
import {Logger} from './Logger';
import {ConfigurationStructure} from './ConfigurationStructure';
import {Endpoint} from './Endpoint';

export class Configuration {
    configFile:string;
    configuration:ConfigurationStructure;

    constructor(cfgFile:string) {
        this.configFile = cfgFile;
        this.load();
    }

    public load():void {
        if(_.endsWith(this.configFile, ".json")){
            this.configuration = this.parseJSONConfig(this.configFile);
        } else if(_.endsWith(this.configFile, ".yaml")){
            this.configuration = this.parseYAMLConfig(this.configFile);
        }
    }

    private parseJSONConfig(cFile:string):ConfigurationStructure {
        try {
            return JSON.parse(require('fs').readFileSync(cFile, 'utf8'));
        }
        catch (err) {
            console.log("Unable to find or parse config file.");
            return;
        }
    };

    private parseYAMLConfig(cFile:string):ConfigurationStructure {
        var parsedConfig: any;
        try {
            parsedConfig =  yaml.safeLoad(require('fs').readFileSync(cFile, 'utf8'));

            if(!_.isNil(parsedConfig.swagger)){
                Logger.error("Sorry the Swagger/YAML format is not yet implemented.");
                return null;
            }else{
                return parsedConfig;
            }
        }
        catch (err) {
            console.log("Unable to find or parse config file.");
            return null;
        }
    }

    public isValid():boolean {
        if (!_.isNil(this.configuration)) {
            return this.configuration.endpoints.length > 0;
        }

        return false;
    }

    public getEndpoints():Endpoint[] {
        if (!_.isNil(this.configuration)) {
            if (this.configuration.endpoints.length > 0) {
                return this.configuration.endpoints;
            }
        }

        return null;
    }

    public getGlobalConfig():GlobalConfiguration {
        if (!_.isNil(this.configuration)) {
            if (!_.isNil(this.configuration.global)) {
                return this.configuration.global;
            }
        }

        return null;
    }
}
