import { ContentsController } from "./contents.controller";
import { GroupsController } from "./groups.controller";
import { PlaylistsController } from "./playlists.controller";
import { SchedulesController } from "./schedules.controller";
import { TVsController } from "./tvs.controller";
import { WebsocketController } from "./websocket.controller";

export interface Controllers {
    content: ContentsController;
    group: GroupsController;
    playlist: null;
    schedule: SchedulesController;
    tv: TVsController;
    websocket: WebsocketController;
}

export {
    ContentsController,
    GroupsController,
    PlaylistsController,
    SchedulesController,
    TVsController,
    WebsocketController
};
