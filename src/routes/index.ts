
import { apiRoutes } from "./api.routes";
import { wrappedContentsRoutes } from "./contents.routes";
import { rootRoutes } from "./root.routes";
import { makeHTTPCompliant } from "./utils";

makeHTTPCompliant(rootRoutes);
makeHTTPCompliant(wrappedContentsRoutes);
makeHTTPCompliant(apiRoutes);

export {
    rootRoutes,
    wrappedContentsRoutes,
    apiRoutes
};
