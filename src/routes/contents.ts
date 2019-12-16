import { Router } from "express";
import { ERRORS, ResourceNotFoundError } from "../exceptions";

export const wrappedContentsRoutes = Router();

wrappedContentsRoutes.route("/error/:code").get((req, res) => {
    const error = ERRORS[req.params.code];

    if (error === undefined) {
        throw new ResourceNotFoundError("This error code doesn't exist.");
    }

    let message = error.reason;
    const showCode = req.query.show_code;

    if (showCode && showCode.toLowerCase() === "true") {
        message = `[${error.code}] ${message}`;
    }

    res.render("error", {
        details: req.query.details,
        message
    });
});

wrappedContentsRoutes.route("/message").get((req, res) => {
    res.render("message", {
        details: req.query.details,
        message: req.query.message
    });
});

wrappedContentsRoutes.route("/image").get((req, res) => {
    res.render("image", {
        source: req.query.source
    });
});

wrappedContentsRoutes.route("/video").get((req, res) => {
    res.render("video", {
        mimeType: req.query.mime_type,
        source: req.query.source
    });
});
