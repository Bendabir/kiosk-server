import { NextFunction, Request, Response } from "express";
import { logger } from "../logging";

export function logRequest(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const host = req.connection.remoteAddress.split(":").pop();
        const method = req.method;
        const url = req.originalUrl;
        const version = req.httpVersion;
        const statusCode = res.statusCode;
        const contentLength: string | undefined = res.get("Content-Length");
        let message = `${host} - ${method} ${url} HTTP/${version} ${statusCode}`;

        if (contentLength !== undefined) {
            message += ` ${contentLength}`;
        }

        if (statusCode >= 500) {
            logger.error(message);
        } else if (statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.http(message);
        }
    });
    next();
}
