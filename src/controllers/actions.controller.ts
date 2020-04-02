import { BadRequestError } from "../exceptions";
import { WebSocketTarget } from "../websocket";
import { Controllers } from "./index";

export enum Action {
    IDENTIFY = "identify",
    RELOAD = "reload",
    PLAY = "play",
    PAUSE = "pause",
    FORWARD = "forward",
    REWIND = "rewind",
    SHOW_SUBTITLES = "show_subtitles"
}

export class ActionsController {
    private controllers: Controllers;

    constructor(controllers: Controllers) {
        this.controllers = controllers;
    }

    public dispatch(target: WebSocketTarget, id: string | null, action: Action, parameters: any) {
        switch (action) {
            case null: case undefined: break;
            case undefined: break;
            case Action.IDENTIFY: {
                this.controllers.websocket.identify(target, id, parameters?.duration);
                break;
            }
            case Action.RELOAD: {
                this.controllers.websocket.reload(target, id);
                break;
            }
            case Action.PLAY: {
                this.controllers.websocket.play(target, id, true);
                break;
            }
            case Action.PAUSE: {
                this.controllers.websocket.play(target, id, false);
                break;
            }
            case Action.FORWARD: {
                this.controllers.websocket.forward(target, id, parameters?.duration);
                break;
            }
            case Action.REWIND: {
                this.controllers.websocket.rewind(target, id, parameters?.duration);
                break;
            }
            default: throw new BadRequestError(`Unsupported action '${action}'.`);
        }
    }
}
