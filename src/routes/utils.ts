import { Handler, NextFunction, Request, Response, Router } from "express";
import { MethodNotAllowedError } from "../exceptions";

/** Resolve an async route handler and catch exceptions properly.
 *
 * @param handle Async route handler.
 *
 * @returns Handler that is Promise safe.
 */
export const wrap = (handle: Handler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(handle(req, res, next)).catch(next);
    };
};

/** Configure routes of a router to return HTTP 405 if a method is
 *  not allowed.
 *
 * @param router
 */
export const makeHTTPCompliant = (router: Router) => {
    router.stack.filter((layer: any) => {
        return layer.route;
    }).forEach((layer: any) => {
        layer.route.all((req: Request , res: Response) => {
            throw new MethodNotAllowedError(`${req.method} is not allowed on ${req.originalUrl}`);
        });
    });
};
