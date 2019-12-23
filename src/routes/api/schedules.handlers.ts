import * as http from "http-status-codes";
import { SchedulesController } from "../../controllers";
import { ScheduleOrigin } from "../../models";
import { wrap } from "./utils";

export const all = wrap(async (req, res) => {
    res.json({
        data: await SchedulesController.getAll(req.query, req.query.resolve === "true")
    });
});

export const add = wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await SchedulesController.addOne(req.body, ScheduleOrigin.USER)
    });
});

export const remove = wrap(async (req, res) => {
    await SchedulesController.deleteOne(req.params.id, false);
    res.status(http.NO_CONTENT).send();
});
