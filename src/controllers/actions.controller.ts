import { BadRequestError } from "../exceptions";
import { Controllers } from "./index";

export enum Action {
    IDENTIFY = "identify",
    RELOAD = "reload",
    PLAY = "play",
    PAUSE = "pause",
    MUTE = "mute",
    UNMUTE = "unmute",
    FORWARD = "forward",
    REWIND = "rewind",
    SHOW_SUBTITLES = "show_subtitles"
}

export class ActionsController {
    private controllers: Controllers;

    constructor(controllers: Controllers) {
        this.controllers = controllers;
    }

    // TODO : pause, play, mute, unmute, forward, rewind
    public dispatch(tvID: string, action: Action): void {
        switch (action) {
            case undefined: break;
            case Action.IDENTIFY: {
                this.controllers.websocket.identify(tvID);
                break;
            }
            case Action.RELOAD: {
                this.controllers.websocket.reload(tvID);
                break;
            }
            default: throw new BadRequestError(`Unsupported action '${action}'.`);
        }
    }

    public dispatchGroup(groupID: string, action: Action): void {
        switch (action) {
            case undefined: break;
            case Action.IDENTIFY: {
                this.controllers.websocket.identifyGroup(groupID);
                break;
            }
            case Action.RELOAD: {
                this.controllers.websocket.reloadGroup(groupID);
                break;
            }
            default: throw new BadRequestError(`Unsupported action '${action}'.`);
        }
    }

    public dispatchAll(action: Action): void {
        switch (action) {
            case undefined: break;
            case Action.IDENTIFY: {
                this.controllers.websocket.identifyAll();
                break;
            }
            case Action.RELOAD: {
                this.controllers.websocket.reloadAll();
                break;
            }
            default: throw new BadRequestError(`Unsupported action '${action}'.`);
        }
    }
}
