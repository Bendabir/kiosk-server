import { ActionsController } from "./actions.controller";
import { ContentsController } from "./contents.controller";
import { GroupsController } from "./groups.controller";
import { SchedulesController } from "./schedules.controller";
import { TVsController } from "./tvs.controller";
import { UploadsController } from "./uploads.controller";
import { WebsocketController } from "./websocket.controller";

export interface Controllers {
    action: ActionsController;
    content: ContentsController;
    group: GroupsController;
    schedule: SchedulesController;
    tv: TVsController;
    upload: UploadsController;
    websocket: WebsocketController;
}

export {
    ActionsController,
    ContentsController,
    GroupsController,
    SchedulesController,
    TVsController,
    UploadsController,
    WebsocketController
};
