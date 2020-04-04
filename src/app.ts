import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import multer from "multer";
import { Socket } from "net";
import nocache from "nocache";
import path from "path";
import { Sequelize } from "sequelize";
import socketIO from "socket.io";

import { Config } from "./config";
import {
    ActionsController,
    ContentsController,
    Controllers,
    GroupsController,
    SchedulesController,
    TVsController,
    UploadsController,
    WebsocketController
} from "./controllers";
import { ResourceNotFoundError } from "./exceptions";
import { logger } from "./logging";
import { logRequest, onError } from "./middlewares";
import { RequestWithControllers } from "./middlewares/types";
import { apiRoutes, wrappedContentsRoutes } from "./routes";
import { SocketInformation } from "./websocket";

export class App {
    public config: Config;
    private app: express.Express;
    private server: http.Server;
    private database: Sequelize;
    private io: socketIO.Server;
    private connected: Map<string, SocketInformation>; // Connected TVs
    private controllers: Controllers;
    private sockets: Set<Socket>;

    constructor(
        config: Config,
        database: Sequelize
    ) {
        // For unexpected errors
        process.on("uncaughtException", (err) => {
            logger.error(`Unexpected error : ${err.message}`);

            err.stack.split("\n").slice(1).forEach((line) => {
                logger.error(line);
            });

            logger.error("Kiosk won't recover from this.");

            this.exit(1);
        });

        process.on("SIGTERM", () => {
            this.exit(0);
        });

        process.on("SIGINT", () => {
            this.exit(0);
        });

        this.config = config;
        this.database = database;
        this.app = express();
        this.sockets = new Set();
        this.server = http.createServer(this.app);

        // Keep references on sockets to close connections on exit
        this.server.on("connection", (socket) => {
            this.sockets.add(socket);

            socket.on("close", () => this.sockets.delete(socket));
        });

        this.io = socketIO.listen(this.server);
        this.connected = new Map<string, SocketInformation>();

        this.controllers = {
            action: null,
            content: new ContentsController(this.config.SERVER_URL),
            group: new GroupsController(),
            schedule: null,
            tv: null,
            upload: new UploadsController(this.config.UPLOAD_DIR, this.config.SERVER_URL),
            websocket: null
        };
        this.controllers.action = new ActionsController(this.controllers);
        this.controllers.websocket = new WebsocketController(
            this.io,
            this.connected,
            this.controllers,
            this.config.MIN_CLIENT_VERSION,
            this.config.defaults()
        );
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
        this.app.use(nocache());
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

        // For uploaded files
        const upload = multer({
            dest: this.config.UPLOAD_DIR,
            fileFilter: this.controllers.upload.filter,
            limits: {
                fileSize: this.config.MAX_UPLOAD_SIZE
            },
            storage: multer.diskStorage({
                destination: this.controllers.upload.destination,
                filename: this.controllers.upload.filename
            })
        });

        this.app.post("/files", upload.single("file"), (req, res) => {
            res.json(this.controllers.upload.convert(req.file));
        });
        this.app.use("/files", express.static(this.config.UPLOAD_DIR));

        // Application root
        this.app.get("/", (req, res) => {
            res.json({
                data: {
                    name: "Kiosk Server",
                    version: this.config.VERSION
                }
            });
        });

        // Routes setup goes here
        this.app.use("/contents", wrappedContentsRoutes);
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
        this.server.listen(this.config.SERVER_PORT, this.config.SERVER_HOST, () => {
            logger.info(`Server running on ${this.config.SERVER_HOST}:${this.config.SERVER_PORT}`);
        });

        // Loading/planning the schedules from the database
        await this.controllers.schedule.load();
    }

    public exit(code: number = 0) {
        // Closing all WebSocket connections first
        const sockets = this.io.sockets.sockets;

        Object.keys(sockets).forEach((id) => {
            sockets[id].disconnect(true);
        });

        // Closing remaining HTTP connections
        this.sockets.forEach((socket) => {
            socket.destroy();
        });

        // Finally, close all our instances
        this.io.close(() => {
            this.server.close(async () => {
                await this.database.close();

                logger.info("Exiting Kiosk. Good bye !");

                process.exit(code);
            });
        });
    }
}
