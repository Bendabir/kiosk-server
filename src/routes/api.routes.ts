import { Router } from "express";
import * as http from "http-status-codes";
import { RequestWithControllers } from "../middlewares/types";
import { ScheduleOrigin } from "../models";
import { fixAssociations } from "../models/utils";
import { wrapAsync } from "./utils";

export const apiRoutes = Router();

// =========================================================================
// TVs
// =========================================================================
apiRoutes.route("/tvs").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: (await req.controllers.tv.getAll(req.query, req.query.resolve === "true")).map(fixAssociations)
    });
})).post(wrapAsync(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.tv.addOne(req.body)
    });
}));
apiRoutes.route("/tvs/actions").post(wrapAsync(async (req: RequestWithControllers, res) => {
    req.controllers.action.dispatchAll(req.body.action);
    res.send();
}));
apiRoutes.route("/tvs/:id/actions").post(wrapAsync(async (req: RequestWithControllers, res) => {
    await req.controllers.tv.getOne(req.params.id);
    req.controllers.action.dispatch(req.params.id, req.body.action);
    res.send();
}));
apiRoutes.route("/tvs/:id").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: fixAssociations(await req.controllers.tv.getOne(req.params.id, req.query.resolve === "true"))
    });
})).patch(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.tv.updateOne(req.params.id, req.body)
    });
})).delete(wrapAsync(async (req: RequestWithControllers, res) => {
    await req.controllers.tv.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Groups
// =========================================================================
apiRoutes.route("/groups").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.group.getAll(req.query)
    });
})).post(wrapAsync(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.group.addOne(req.body)
    });
}));
apiRoutes.route("/groups/:id").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.group.getOne(req.params.id)
    });
})).patch(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.group.updateOne(req.params.id, req.body)
    });
})).delete(wrapAsync(async (req: RequestWithControllers, res) => {
    await req.controllers.group.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));
apiRoutes.route("/groups/:id/actions").post(wrapAsync(async (req: RequestWithControllers, res) => {
    await req.controllers.group.getOne(req.params.id);
    req.controllers.action.dispatchGroup(req.params.id, req.body.action);
    res.send();
}));

// =========================================================================
// Contents
// =========================================================================
apiRoutes.route("/contents").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.getAll(req.query.type)
    });
})).post(wrapAsync(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.content.addOne(req.body)
    });
}));
apiRoutes.route("/contents/analysis").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.analyze(req.query.uri)
    });
}));
apiRoutes.route("/contents/:id").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.getOne(req.params.id)
    });
})).patch(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.updateOne(req.params.id, req.body)
    });
})).delete(wrapAsync(async (req: RequestWithControllers, res) => {
    await req.controllers.content.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Schedules
// =========================================================================
apiRoutes.route("/schedules").get(wrapAsync(async (req: RequestWithControllers, res) => {
    res.json({
        data: (await req.controllers.schedule.getAll(req.query, req.query.resolve === "true")).map(fixAssociations)
    });
})).post(wrapAsync(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.schedule.addOne(req.body, ScheduleOrigin.USER)
    });
}));
apiRoutes.route("/schedules/:id").delete(wrapAsync(async (req: RequestWithControllers, res) => {
    await req.controllers.schedule.deleteOne(req.params.id, false);
    res.status(http.NO_CONTENT).send();
}));
