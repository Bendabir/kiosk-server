import { Request, Response, Router } from "express";
import { MethodNotAllowedError } from "../exceptions";
import { apiRoutes } from "./api";
import { wrappedContentsRoutes } from "./contents";
import { rootRoutes } from "./root";

/** Configure routes of a router to return HTTP 405 if a method is
 *  not allowed.
 *
 * @param router
 *
 */
function makeHTTPCompliant(router: Router) {
    router.stack.filter((layer: any) => {
        return layer.route;
    }).forEach((layer: any) => {
        layer.route.all((req: Request , res: Response) => {
            throw new MethodNotAllowedError(`${req.method} is not allowed on ${req.originalUrl}`);
        });
    });
}

makeHTTPCompliant(rootRoutes);
makeHTTPCompliant(wrappedContentsRoutes);
makeHTTPCompliant(apiRoutes);

export {
    rootRoutes,
    wrappedContentsRoutes,
    apiRoutes
};
