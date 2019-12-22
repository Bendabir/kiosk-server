import * as http from "http-status-codes";
import { ContentsController } from "../../controllers";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    res.json({
        data: await ContentsController.getAll(req.query.type)
    });
});

export const get = wrap(async (req, res) => {
    res.json({
        data: await ContentsController.getOne(req.params.id)
    });
});

export const add = wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await ContentsController.addOne(req.body)
    });
});

export const update = wrap(async (req, res) => {
    res.json({
        data: await ContentsController.updateOne(req.params.id, req.body)
    });
});

export const remove = wrap(async (req, res) => {
    await ContentsController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
});
