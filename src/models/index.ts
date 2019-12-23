import { Content, ContentInterface, ContentType } from "./content.model";
import { Group, GroupInterface } from "./group.model";
import { PlaylistItem, PlaylistItemInterface } from "./playlist_item.model";
import { Schedule, ScheduleInterface, ScheduleOrigin } from "./schedule.model";
import { TV, TVInterface } from "./tv.model";

// Reworking exports a bit
export {
    Group,
    Content,
    TV,
    PlaylistItem,
    ContentType,
    Schedule,
    ScheduleOrigin,
    // Interfaces
    GroupInterface,
    ContentInterface,
    TVInterface,
    ScheduleInterface,
    PlaylistItemInterface
};
