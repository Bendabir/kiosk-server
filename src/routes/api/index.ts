import { Router } from "express";
import * as tvs from "./tvs.handlers";

export const apiRoutes = Router();

apiRoutes.get("/tvs", tvs.getAll);
apiRoutes.get("/tvs/:id", tvs.getOne);
