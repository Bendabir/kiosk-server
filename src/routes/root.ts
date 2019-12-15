import { Router } from "express";
import * as config from "../config";

export const rootRoutes = Router();

rootRoutes.route("").get((req, res) => {
    res.json({
        data: {
            name: "Kiosk Server",
            version: config.VERSION
        }
    });
});
