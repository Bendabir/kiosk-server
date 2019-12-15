import { Router } from "express";
import { Errors, ResourceNotFoundError } from "../exceptions";

export const wrappedContentsRoutes = Router();

wrappedContentsRoutes.route("/error/:code").get((req, res) => {
    const error = Errors[req.params.code];

    if (error === undefined) {
        throw new ResourceNotFoundError("This error code doesn't exist.");
    }

    let message = error.reason;

    if (req.query.showCode && req.query.showCode.toLowerCase() === "true") {
        message = `[${error.code}] ${message}`;
    }

    res.render("error", {
        details: null || req.query.details,
        message
    });
});
