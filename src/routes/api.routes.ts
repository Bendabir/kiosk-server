import { Router } from "express";
import * as http from "http-status-codes";
import { RequestWithControllers } from "../middlewares/types";
import { ScheduleOrigin } from "../models";
import { fixAssociations } from "../models/utils";
import { wrap } from "./utils";

export const apiRoutes = Router();

// =========================================================================
// Global
// =========================================================================
apiRoutes.route("/identification").post(wrap(async (req: RequestWithControllers, res) => {
    req.controllers.websocket.identifyAll();
    res.send();
}));

// =========================================================================
// TVs
// =========================================================================
apiRoutes.route("/tvs").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: (await req.controllers.tv.getAll(req.query, req.query.resolve === "true")).map(fixAssociations)
    });
})).post(wrap(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.tv.addOne(req.body)
    });
}));
apiRoutes.route("/tvs/:id/identification").post(wrap(async (req: RequestWithControllers, res) => {
    await req.controllers.tv.getOne(req.params.id);
    req.controllers.websocket.identify(req.params.id);
    res.send();
}));
apiRoutes.route("/tvs/:id").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: fixAssociations(await req.controllers.tv.getOne(req.params.id, req.query.resolve === "true"))
    });
})).patch(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.tv.updateOne(req.params.id, req.body)
    });
})).delete(wrap(async (req: RequestWithControllers, res) => {
    await req.controllers.tv.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Groups
// =========================================================================
apiRoutes.route("/groups").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.group.getAll(req.query)
    });
})).post(wrap(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.group.addOne(req.body)
    });
}));
apiRoutes.route("/groups/:id").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.group.getOne(req.params.id)
    });
})).patch(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.group.updateOne(req.params.id, req.body)
    });
})).delete(wrap(async (req: RequestWithControllers, res) => {
    await req.controllers.group.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));
apiRoutes.route("/groups/:id/identification").post(wrap(async (req: RequestWithControllers, res) => {
    await req.controllers.group.getOne(req.params.id);
    req.controllers.websocket.identifyGroup(req.params.id);
    res.send();
}));

// =========================================================================
// Contents
// =========================================================================
apiRoutes.route("/contents").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.getAll(req.query.type)
    });
})).post(wrap(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.content.addOne(req.body)
    });
}));
apiRoutes.route("/contents/:id").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.getOne(req.params.id)
    });
})).patch(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: await req.controllers.content.updateOne(req.params.id, req.body)
    });
})).delete(wrap(async (req: RequestWithControllers, res) => {
    await req.controllers.content.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Schedules
// =========================================================================
apiRoutes.route("/schedules").get(wrap(async (req: RequestWithControllers, res) => {
    res.json({
        data: (await req.controllers.schedule.getAll(req.query, req.query.resolve === "true")).map(fixAssociations)
    });
})).post(wrap(async (req: RequestWithControllers, res) => {
    res.status(http.CREATED).json({
        data: await req.controllers.schedule.addOne(req.body, ScheduleOrigin.USER)
    });
}));
apiRoutes.route("/schedules/:id").delete(wrap(async (req: RequestWithControllers, res) => {
    await req.controllers.schedule.deleteOne(req.params.id, false);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Playlists
// =========================================================================
// apiRoutes.route("/playlists").get(wrap(async (req: RequestWithControllers, res) => {
//     res.json({
//         data: await PlaylistsController.getAll()
//     });
// })).post(wrap(async (req: RequestWithControllers, res) => {
//     res.status(http.CREATED).json({
//         data: await PlaylistsController.addOne(req.body)
//     });
// }));
// apiRoutes.route("/playlists/:id").get(wrap(async (req: RequestWithControllers, res) => {
//     res.json({
//         data: await PlaylistsController.getOne(req.params.id)
//     });
// })).patch(wrap(async (req: RequestWithControllers, res) => {
//     res.json({
//         data: await PlaylistsController.updateOne(req.params.id, req.body)
//     });
// })).delete(wrap(async (req: RequestWithControllers, res) => {
//     await PlaylistsController.deleteOne(req.params.id);
//     res.status(http.NO_CONTENT).send();
// }));
// apiRoutes.route("/playlists/:id/items").get(wrap(async (req: RequestWithControllers, res) => {
//     res.json({
//         data: await PlaylistsController.getAllItems(req.params.id)
//     });
// })).post(wrap(async (req: RequestWithControllers, res) => {
//     res.json({
//         data: await PlaylistsController.addOneItem(req.params.id, req.body)
//     });
// }));
// apiRoutes.route("/playlists/:id/items/:index").patch(async (req: RequestWithControllers, res) => {
//     res.json({
//         data: await PlaylistsController.updateOneItem(req.params.id, req.params.index, req.body)
//     });
// }).delete(async (req: RequestWithControllers, res) => {
//     await PlaylistsController.deleteOneItem(req.params.id, req.params.index);
//     res.status(http.NO_CONTENT).send();
// });
