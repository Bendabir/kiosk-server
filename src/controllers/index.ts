import { ActionsController } from "./actions.controller";
import { ContentsController } from "./contents.controller";
import { GroupsController } from "./groups.controller";
import { PlaylistsController } from "./playlists.controller";
import { SchedulesController } from "./schedules.controller";
import { TVsController } from "./tvs.controller";
import { WebsocketController } from "./websocket.controller";

export interface Controllers {
    action: ActionsController;
    content: ContentsController;
    group: GroupsController;
    playlist: null;
    schedule: SchedulesController;
    tv: TVsController;
    websocket: WebsocketController;
}

export {
    ActionsController,
    ContentsController,
    GroupsController,
    PlaylistsController,
    SchedulesController,
    TVsController,
    WebsocketController
};
