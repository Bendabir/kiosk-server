import { Router } from "express";
import * as tvs from "./tvs.handlers";

export const apiRoutes = Router();

apiRoutes.route("/tvs").get(tvs.all)
                       .post(tvs.add);
apiRoutes.route("/tvs/:id").get(tvs.get)
                           .patch(tvs.update)
                           .delete(tvs.remove);
