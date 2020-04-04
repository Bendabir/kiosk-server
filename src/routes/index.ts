
import { apiRoutes } from "./api.routes";
import { wrappedContentsRoutes } from "./contents.routes";
import { makeHTTPCompliant } from "./utils";

makeHTTPCompliant(wrappedContentsRoutes);
makeHTTPCompliant(apiRoutes);

export {
    wrappedContentsRoutes,
    apiRoutes
};
