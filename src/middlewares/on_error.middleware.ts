import { NextFunction, Request, Response } from "express";
import http from "http-status-codes";
import { MulterError } from "multer";
import { BadRequestError, KioskError } from "../exceptions";

export function onError(err: Error, req: Request, res: Response, next: NextFunction) {
    const payload: any = {
        message: err.message,
        name: err.name
    };
    let status = http.INTERNAL_SERVER_ERROR;

    if (err instanceof KioskError) {
        payload.code = err.code;
        payload.reason = err.reason;
        status = err.status;
    } else if (err instanceof MulterError) {
        payload.name = BadRequestError.name;
        payload.code = BadRequestError.code;
        payload.reason = `Involved field : '${err.field}'`;
        status = http.BAD_REQUEST;
    } else if (process.env.NODE_ENV !== "production") {
        payload.stack = err.stack;
    }

    res.status(status).json({
        error: payload
    });
}
