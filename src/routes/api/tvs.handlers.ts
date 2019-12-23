import * as http from "http-status-codes";
import { TVsController } from "../../controllers";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    res.json({
        data: await TVsController.getAll(req.query, req.query.resolve === "true")
    });
});

export const get = wrap(async (req, res) => {
    res.json({
        data: await TVsController.getOne(req.params.id, req.query.resolve === "true")
    });
});

export const add = wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await TVsController.addOne(req.body)
    });
});

export const update = wrap(async (req, res) => {
    res.json({
        data: await TVsController.updateOne(req.params.id, req.body)
    });
});

export const remove = wrap(async (req, res) => {
    await TVsController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
});
