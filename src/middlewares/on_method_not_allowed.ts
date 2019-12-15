import { NextFunction, Request, Response } from "express";
import http from "http-status-codes";
import { MethodNotAllowedError } from "../exceptions";

export function onMethodNotAllowed(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof MethodNotAllowedError) {
        res.status(http.METHOD_NOT_ALLOWED).json({
            error: {
                code: err.code,
                message: err.message,
                name: err.name,
                reason: err.reason
            }
        });
    } else {
        next(err);
    }
}
