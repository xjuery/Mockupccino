import Endpoint = require("./Endpoint");
import GlobalConfiguration = require("./GlobalConfiguration");

class ConfigurationStructure {
    global: GlobalConfiguration;
    endpoints: Array<Endpoint>;
}
export = ConfigurationStructure;
