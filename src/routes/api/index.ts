import { Router } from "express";
import * as contents from "./contents.handlers";
import * as groups from "./groups.handlers";
import * as tvs from "./tvs.handlers";

export const apiRoutes = Router();

apiRoutes.route("/tvs").get(tvs.all)
                       .post(tvs.add);
apiRoutes.route("/tvs/:id").get(tvs.get)
                           .patch(tvs.update)
                           .delete(tvs.remove);

apiRoutes.route("/groups").get(groups.all)
                          .post(groups.add);
apiRoutes.route("/groups/:id").get(groups.get)
                              .patch(groups.update)
                              .delete(groups.remove);

apiRoutes.route("/contents").get(contents.all)
                            .post(contents.add);
apiRoutes.route("/contents/:id").get(contents.get)
                                .patch(contents.update)
                                .delete(contents.remove);
