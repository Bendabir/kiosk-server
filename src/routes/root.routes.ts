import { Router } from "express";
import * as config from "../config";

export const rootRoutes = Router();

rootRoutes.route("").get((_, res) => {
    res.json({
        data: {
            name: "Kiosk Server",
            version: config.VERSION
        }
    });
});
