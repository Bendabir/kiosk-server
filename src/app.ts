import * as bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import http from "http";
import path from "path";
import { Sequelize } from "sequelize";
import * as socketIO from "socket.io";

import { ResourceNotFoundError } from "./exceptions";
import { logger } from "./logging";
import { logRequest, onError } from "./middlewares";
import { apiRoutes, rootRoutes, wrappedContentsRoutes } from "./routes";
import { RequestWithWebSocket } from "./types";

export class App {
    public host: string;
    public port: number;
    private app: express.Express;
    private server: http.Server;
    private database: Sequelize;
    private io: socketIO.Server;

    constructor(host: string, port: number, database: Sequelize) {
        this.database = database;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO.listen(this.server);
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
        this.app.use((req: RequestWithWebSocket, res, next) => {
            // Make Socket.io available everywhere
            req.io = this.io;
            next();
        });

        // Routes setup goes here
        this.app.use("/", rootRoutes);
        this.app.use("/contents/", wrappedContentsRoutes);
        this.app.use("/api", apiRoutes);

        // All routes that were not configured will throw an exception
        this.app.all("*", (req, res) => {
            throw new ResourceNotFoundError(`Cannot ${req.method} ${req.originalUrl}`);
        });

        // Custom error handling middlewares
        this.app.use(onError); // Last one, in case we couldn't handle error before

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
