import { Router } from "express";
import * as http from "http-status-codes";
import { ContentsController, GroupsController, PlaylistsController, SchedulesController, TVsController } from "../controllers";
import { ScheduleOrigin } from "../models";
import { fixAssociations } from "../models/utils";
import { wrap } from "./utils";

export const apiRoutes = Router();

// =========================================================================
// TVs
// =========================================================================
apiRoutes.route("/tvs").get(wrap(async (req, res) => {
    res.json({
        data: (await TVsController.getAll(req.query, req.query.resolve === "true")).map(fixAssociations)
    });
})).post(wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await TVsController.addOne(req.body)
    });
}));
apiRoutes.route("/tvs/:id").get(wrap(async (req, res) => {
    res.json({
        data: fixAssociations(await TVsController.getOne(req.params.id, req.query.resolve === "true"))
    });
})).patch(wrap(async (req, res) => {
    res.json({
        data: await TVsController.updateOne(req.params.id, req.body)
    });
})).delete(wrap(async (req, res) => {
    await TVsController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Groups
// =========================================================================
apiRoutes.route("/groups").get(wrap(async (req, res) => {
    res.json({
        data: await GroupsController.getAll(req.query)
    });
})).post(wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await GroupsController.addOne(req.body)
    });
}));
apiRoutes.route("/groups/:id").get(wrap(async (req, res) => {
    res.json({
        data: await GroupsController.getOne(req.params.id)
    });
})).patch(wrap(async (req, res) => {
    res.json({
        data: await GroupsController.updateOne(req.params.id, req.body)
    });
})).delete(wrap(async (req, res) => {
    await GroupsController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Contents
// =========================================================================
apiRoutes.route("/contents").get(wrap(async (req, res) => {
    res.json({
        data: await ContentsController.getAll(req.query.type)
    });
})).post(wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await ContentsController.addOne(req.body)
    });
}));
apiRoutes.route("/contents/:id").get(wrap(async (req, res) => {
    res.json({
        data: await ContentsController.getOne(req.params.id)
    });
})).patch(wrap(async (req, res) => {
    res.json({
        data: await ContentsController.updateOne(req.params.id, req.body)
    });
})).delete(wrap(async (req, res) => {
    await ContentsController.deleteOne(req.params.id);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Schedules
// =========================================================================
apiRoutes.route("/schedules").get(wrap(async (req, res) => {
    res.json({
        data: (await SchedulesController.getAll(req.query, req.query.resolve === "true")).map(fixAssociations)
    });
})).post(wrap(async (req, res) => {
    res.status(http.CREATED).json({
        data: await SchedulesController.addOne(req.body, ScheduleOrigin.USER)
    });
}));
apiRoutes.route("/schedules/:id").delete(wrap(async (req, res) => {
    await SchedulesController.deleteOne(req.params.id, false);
    res.status(http.NO_CONTENT).send();
}));

// =========================================================================
// Playlists
// =========================================================================
// apiRoutes.route("/playlists").get(wrap(async (req, res) => {
//     res.json({
//         data: await PlaylistsController.getAll()
//     });
// })).post(wrap(async (req, res) => {
//     res.status(http.CREATED).json({
//         data: await PlaylistsController.addOne(req.body)
//     });
// }));
// apiRoutes.route("/playlists/:id").get(wrap(async (req, res) => {
//     res.json({
//         data: await PlaylistsController.getOne(req.params.id)
//     });
// })).patch(wrap(async (req, res) => {
//     res.json({
//         data: await PlaylistsController.updateOne(req.params.id, req.body)
//     });
// })).delete(wrap(async (req, res) => {
//     await PlaylistsController.deleteOne(req.params.id);
//     res.status(http.NO_CONTENT).send();
// }));
// apiRoutes.route("/playlists/:id/items").get(wrap(async (req, res) => {
//     res.json({
//         data: await PlaylistsController.getAllItems(req.params.id)
//     });
// })).post(wrap(async (req, res) => {
//     res.json({
//         data: await PlaylistsController.addOneItem(req.params.id, req.body)
//     });
// }));
// apiRoutes.route("/playlists/:id/items/:index").patch(async (req, res) => {
//     res.json({
//         data: await PlaylistsController.updateOneItem(req.params.id, req.params.index, req.body)
//     });
// }).delete(async (req, res) => {
//     await PlaylistsController.deleteOneItem(req.params.id, req.params.index);
//     res.status(http.NO_CONTENT).send();
// });
