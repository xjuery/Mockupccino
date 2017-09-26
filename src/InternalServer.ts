import * as bodyParser from "body-parser";
import * as multer from "multer";
import * as _ from "lodash";
import * as express from "express";
import {Configuration} from "./Configuration";
import {Endpoint} from "./Endpoint";
import {Logger} from "./Logger";

export class InternalServer {
    expressServer: any;
    config: Configuration;
    dataCache: string[];

    constructor(cfg: Configuration, app: any) {
        this.config = cfg;
        this.expressServer = app;
        this.dataCache = [];
    }

    launch() {
        // Add each endpoints
        this.config.getEndpoints().forEach(
            (ep: Endpoint) => {
                this.addEndpoint(ep);
            }
        );

        // Add the special endpoint for populating specific responses in the endpoints
        this.populateEndpoint();

        // Add static files if needed
        // Check if the global config is defined or not
        if (!_.isNil(this.config.getGlobalConfig())) {
            // Check if the server has to connect some static contents
            if (!_.isNil(this.config.getGlobalConfig().staticContent)) {
                this.config.getGlobalConfig().staticContent.forEach(
                    (element: any) => {
                        if (!_.isNil(element)) {
                            this.expressServer.use(element.url, express.static(element.path));
                        }
                    }
                );
            }

            // Set the internal server port
            if (!_.isNil(this.config.getGlobalConfig().port)) {
                this.expressServer.listen(this.config.getGlobalConfig().port);

                // TODO : The console logging configurable
                Logger.info("Configuration: Server port: " + this.config.getGlobalConfig().port);
            } else {
                // Else set the default port 3000
                this.expressServer.listen(3000);
                Logger.info("Configuration: Server port: 3000");
            }
        }
    }

    private addEndpoint(element: Endpoint) {
        // Declare each endpoint
        if (element.httpMethod === "POST") {
            this.expressServer.post(element.url,
                (req: any, res: any) => {
                    this.endpointCallback(element, res);
                }
            );
            Logger.info("   |--> Adding : POST   : " + element.url);
        } else if (element.httpMethod === "PUT") {
            this.expressServer.put(element.url,
                (req: any, res: any) => {
                    this.endpointCallback(element, res);
                }
            );
            Logger.info("   |--> Adding : PUT    : " + element.url);
        } else if (element.httpMethod === "DELETE") {
            this.expressServer.delete(element.url,
                (req: any, res: any) => {
                    this.endpointCallback(element, res);
                }
            );
            Logger.info("   |--> Adding : DELETE : " + element.url);
        } else {// GET
            this.expressServer.get(element.url,
                (req: any, res: any) => {
                    this.endpointCallback(element, res);
                }
            );
            Logger.info("   |--> Adding : GET    : " + element.url);
        }
    }

    private endpointCallback(element: Endpoint, res: any) {
        // Tell the console that this endpoint as been called
        Logger.debug("Endpoint Call: " + element.url);

        // Set the CORS Header for local development
        // TODO: Make the CORS Headers configurable
        // setCORSHeaders(res, "http://*/*");

        // Set the return status code
        let sCode = this.getStatusCodeForEndPoint(element.url, element.httpMethod);
        if (sCode != null) {
            res.statusCode = sCode;
        }

        let time = 0;
        if (!_.isNil(element.loadSim)) {
            time = element.loadSim;
        }

        setTimeout(() => {
            // Set the body that has to be returned
            let response: string;
            response = this.getResponseForEndpoint(element.url, element.httpMethod);
            res.send(response);
        }, time);
    }

    private getResponseForEndpoint(url: string, method: string): string {
        let myResp: string;
        myResp = this.dataCache[url + "-" + method];
        if (_.isNil(myResp)) {
            this.config.reloadEndpoints();

            this.config.getEndpoints().forEach(
                (element: any) => {
                    if ((element.url === url) && (element.httpMethod === method)) {
                        if (element.responseFile) {
                            // TODO: Make the console log configurable
                            Logger.debug(element.responseFile);
                            myResp = JSON.parse(require("fs").readFileSync(element.responseFile, "utf8"));
                        } else {
                            // TODO: Make the console log configurable
                            Logger.debug(JSON.stringify(element.response));
                            myResp = element.response;
                        }
                    }
                }
            );
        }

        return myResp;
    }

    private getStatusCodeForEndPoint(url: string, method: string): number {
        this.config.reloadEndpoints();

        let code: number = 500;
        this.config.getEndpoints().forEach(
            (element: any) => {
                if ((element.url === url) && (element.httpMethod === method)) {
                    if (element.responseCode) {
                        code = element.responseCode;
                    } else {
                        code = 200;
                    }
                }
            }
        );
        return code;
    }

    private populateEndpoint() {
        let upload = multer();

        this.expressServer.use(bodyParser.json()); // for parsing application/json
        this.expressServer.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

        this.expressServer.post("/populate", upload.any(),
            (req: any, res: any) => {
                Logger.debug(JSON.stringify(req.body));
                this.dataCache[req.body.url + "-" + req.body.method] = req.body.object;
                Logger.debug("Internal Datacache: ");

                let strMap = new Map();
                for (let k of Object.keys(this.dataCache)) {
                    Logger.debug("{" + JSON.stringify(k) + ": " + JSON.stringify(this.dataCache[k]) + "}");
                }

                // Prepare response
                res.statusCode = 200;
                res.send("");
            }
        );
        Logger.info("   °--> Adding : POST   : /populate");
    }
}
