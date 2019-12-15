import * as bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import http from "http";
import path from "path";
import { Sequelize } from "sequelize";

import { MethodNotAllowedError, ResourceNotFoundError } from "./exceptions";
import { logger } from "./logging";
import { logRequest, onMethodNotAllowed, onResourceNotFound, onUnhandledError } from "./middlewares";
import { apiRoutes, rootRoutes, wrappedContentsRoutes } from "./routes";

export class App {
    private static makeHTTPCompliant = (router: express.Router) => {
        // Configure routes with no method will throw an exception
        router.stack.filter((layer: any) => {
            return layer.route;
        }).forEach((layer: any) => {
            layer.route.all((req: any , res: any) => {
                throw new MethodNotAllowedError(`${req.method} is not allowed on ${req.path}`);
            });
        });

        return router;
    }

    public host: string;
    public port: number;
    private app: express.Express;
    private server: http.Server;
    private database: Sequelize;

    constructor(host: string, port: number, database: Sequelize) {
        this.database = database;
        this.app = express();
        this.server = http.createServer(this.app);
        this.host = host;
        this.port = port;

        // Configuring the Express server
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.disable("x-powered-by");
        this.app.use(helmet());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        this.app.use(compression());

        // Custom middlewares
        this.app.use(logRequest);

        // Routes setup goes here
        this.app.use("/", App.makeHTTPCompliant(rootRoutes));
        this.app.use("/contents/", App.makeHTTPCompliant(wrappedContentsRoutes));
        this.app.use("/api", App.makeHTTPCompliant(apiRoutes));

        // All routes that were not configured will throw an exception
        this.app.all("*", (req, res) => {
            throw new ResourceNotFoundError(`Cannot ${req.method} ${req.path}`);
        });

        // Custom error handling middlewares
        this.app.use(onMethodNotAllowed);
        this.app.use(onResourceNotFound);
        this.app.use(onUnhandledError); // Last one, in case we couldn't handle error before

        // Authenticating to the database
        this.database.authenticate().then(() => {
            logger.info("Connection to database successful !");
        }).catch((error) => {
            logger.error(`Error connecting to database : ${error.message}`);
            process.exit(1);
        });
    }

    public async run() {
        // Updating the database models if needed
        if (process.env.NODE_ENV !== "production") {
            await this.database.sync(); // Updating the models
            logger.info("Database models synchronized.");
        }

        // Running the server
        this.server.listen(this.port, this.host, () => {
            logger.info(`Server running on ${this.host}:${this.port}`);
        });
    }
}
