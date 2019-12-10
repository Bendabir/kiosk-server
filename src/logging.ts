import winston from "winston";
import * as config from "./config";

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format((info) => {
            info.level = info.level.toUpperCase().padEnd(8, " ");
            return info;
        })(),
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`)
    ),
    level: config.LOG_LEVEL,
    transports: [
        // Logging all to console
        new winston.transports.Console()
    ]
});
