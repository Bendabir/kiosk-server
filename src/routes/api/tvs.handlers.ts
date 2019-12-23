import * as http from "http-status-codes";
import { TVController } from "../../controllers";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    res.json({
        data: await TVController.getAll(req.query, req.query.resolve)
    });
});

export const get = wrap(async (req, res) => {
    res.json({
        data: await TVController.getOne(req.params.id, req.query.resolve)
    });
});

export const add = wrap(async (req, res) => {
    res.json({
        data: await TVController.addOne(req.body)
    });
});

export const update = wrap(async (req, res) => {
    res.json({
        data: await TVController.updateOne(req.params.id, req.body)
    });
});

export const remove = wrap(async (req, res) => {
    await TVController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
});
