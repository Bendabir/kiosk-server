import { NextFunction, Request, Response } from "express";
import http from "http-status-codes";
import { KioskError } from "../exceptions";

export function onUnhandledError(err: Error, req: Request, res: Response, next: NextFunction) {
    const payload: any = {
        message: err.message,
        name: err.name
    };

    if (process.env.NODE_ENV !== "production") {
        payload.stack = err.stack;
    }

    if (err instanceof KioskError) {
        payload.code = err.code;
        payload.details = err.details;
    }

    res.status(http.INTERNAL_SERVER_ERROR).json({
        error: payload
    });
}
