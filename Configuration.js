/// <reference path="defs/node/node.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="ConfigurationStructure.ts" />
/// <reference path="Logger.ts" />
var _ = require("lodash");
var yaml = require('js-yaml');
var Logger = require("./Logger");
var Configuration = (function () {
    function Configuration(cfgFile) {
        this.configFile = cfgFile;
        this.load();
    }
    Configuration.prototype.load = function () {
        if (_.endsWith(this.configFile, ".json")) {
            this.configuration = this.parseJSONConfig(this.configFile);
        }
        else if (_.endsWith(this.configFile, ".yaml")) {
            this.configuration = this.parseYAMLConfig(this.configFile);
        }
    };
    Configuration.prototype.parseJSONConfig = function (cFile) {
        try {
            return JSON.parse(require('fs').readFileSync(cFile, 'utf8'));
        }
        catch (err) {
            console.log("Unable to find or parse config file.");
            return;
        }
    };
    ;
    Configuration.prototype.parseYAMLConfig = function (cFile) {
        var parsedConfig;
        try {
            parsedConfig = yaml.safeLoad(require('fs').readFileSync(cFile, 'utf8'));
            if (!_.isNil(parsedConfig.swagger)) {
                Logger.error("Sorry the Swagger/YAML format is not yet implemented.");
                return null;
            }
            else {
                return parsedConfig;
            }
        }
        catch (err) {
            console.log("Unable to find or parse config file.");
            return null;
        }
    };
    Configuration.prototype.isValid = function () {
        if (!_.isNil(this.configuration)) {
            return this.configuration.endpoints.length > 0;
        }
        return false;
    };
    Configuration.prototype.getEndpoints = function () {
        if (!_.isNil(this.configuration)) {
            if (this.configuration.endpoints.length > 0) {
                return this.configuration.endpoints;
            }
        }
        return null;
    };
    Configuration.prototype.getGlobalConfig = function () {
        if (!_.isNil(this.configuration)) {
            if (!_.isNil(this.configuration.global)) {
                return this.configuration.global;
            }
        }
        return null;
    };
    return Configuration;
})();
module.exports = Configuration;
//# sourceMappingURL=Configuration.js.map