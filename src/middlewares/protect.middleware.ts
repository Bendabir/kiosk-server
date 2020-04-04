import { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthenticationError } from "../exceptions";

export function protect(apiKey: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        // Unprotected
        if (!apiKey) {
            next();
        } else {
            // Try to extract the API key from the request
            const requestKey = req.query.apiKey || req.headers.authorization;

            if (requestKey !== apiKey) {
                throw new AuthenticationError("Cannot authenticate the request.");
            }

            next();
        }
    };
}
