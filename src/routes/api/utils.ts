import { Handler, NextFunction, Request, Response } from "express";

/** Resolve an async route handler and catch exceptions properly.
 *
 * @param handle Async route handler.
 *
 */
export const wrap = (handle: Handler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(handle(req, res, next)).catch(next);
    };
};
