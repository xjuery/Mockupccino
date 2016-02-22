/// <reference path="defs/node/node.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="ConfigurationStructure.ts" />
var _ = require("lodash");
var Configuration = (function () {
    function Configuration(cfgFile) {
        this.configFile = cfgFile;
        this.load();
    }
    Configuration.prototype.load = function () {
        try {
            this.configuration = JSON.parse(require('fs').readFileSync(this.configFile, 'utf8'));
        }
        catch (err) {
            console.log("Unable to find or parse config file.");
            return;
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