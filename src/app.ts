import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import * as nocache from "nocache";
import path from "path";
import { Sequelize } from "sequelize";
import socketIO from "socket.io";

import { Controllers } from "./controllers";
import {
    ActionsController,
    ContentsController,
    GroupsController,
    SchedulesController,
    TVsController,
    WebsocketController
} from "./controllers";
import { ResourceNotFoundError } from "./exceptions";
import { logger } from "./logging";
import { logRequest, onError } from "./middlewares";
import { RequestWithControllers } from "./middlewares/types";
import { apiRoutes, rootRoutes, wrappedContentsRoutes } from "./routes";
import { SocketInformation } from "./websocket";

export class App {
    public host: string;
    public port: number;
    private app: express.Express;
    private server: http.Server;
    private database: Sequelize;
    private io: socketIO.Server;
    private connected: Map<string, SocketInformation>; // Connected TVs
    private controllers: Controllers;

    constructor(host: string, port: number, database: Sequelize) {
        this.database = database;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO.listen(this.server);
        this.host = host;
        this.port = port;
        this.connected = new Map<string, SocketInformation>();

        this.controllers = {
            action: null,
            content: new ContentsController(),
            group: new GroupsController(),
            schedule: null,
            tv: null,
            websocket: null
        };
        this.controllers.action = new ActionsController(this.controllers);
        this.controllers.websocket = new WebsocketController(this.io, this.connected, this.controllers);
        this.controllers.tv = new TVsController(this.controllers);
        this.controllers.schedule = new SchedulesController(this.controllers);

        // Configuring the Express server
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.disable("x-powered-by");
        this.app.use(cors());
        this.app.use(helmet({
            frameguard: false
        }));
        this.app.use(nocache.default());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.json());
        this.app.use(compression());

        // Custom middlewares
        this.app.use(logRequest);
        this.app.use((req: RequestWithControllers, _, next) => {
            // Make controllers accessibles to all requests.
            req.controllers = this.controllers;
            next();
        });

        // Routes setup goes here
        this.app.use("/", rootRoutes);
        this.app.use("/contents/", wrappedContentsRoutes);
        this.app.use("/api", apiRoutes);

        // All routes that were not configured will throw an exception
        this.app.all("*", (req, _) => {
            throw new ResourceNotFoundError(`Cannot ${req.method} ${req.originalUrl}`);
        });

        // Custom error handling middlewares
        this.app.use(onError); // Last one, in case we couldn't handle error before

        // Setting up basics stuff for Socket.io
        this.controllers.websocket.init();

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

        // Loading/planning the schedules from the database
        await this.controllers.schedule.load();
    }
}
