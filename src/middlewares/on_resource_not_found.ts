import { NextFunction, Request, Response } from "express";
import http from "http-status-codes";
import { ResourceNotFoundError } from "../exceptions";

export function onResourceNotFound(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ResourceNotFoundError) {
        res.status(http.NOT_FOUND).json({
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
