import * as http from "http-status-codes";
import { GroupsController } from "../../controllers";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    res.json({
        data: await GroupsController.getAll(req.query)
    });
});

export const get = wrap(async (req, res) => {
    res.json({
        data: await GroupsController.getOne(req.params.id)
    });
});

export const add = wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await GroupsController.addOne(req.body)
    });
});

export const update = wrap(async (req, res) => {
    res.json({
        data: await GroupsController.updateOne(req.params.id, req.body)
    });
});

export const remove = wrap(async (req, res) => {
    await GroupsController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
});
