import { Server, Socket } from "socket.io";
import * as config from "../config";
import { AlreadyInUseError, InactiveError, KioskError, NullContentError, ResourceNotFoundError } from "../exceptions";
import { logger } from "../logging";
import { Content, Group } from "../models";
import { BuiltInEvents, KioskEvents, RegisterPayload, SocketInformation, WebSocketTarget } from "../websocket";
import { wrap } from "../websocket/utils";
import { Controllers } from "./index";

export class WebsocketController {
    private io: Server;
    private connected: Map<string, SocketInformation>;
    private controllers: Controllers;

    constructor(io: Server, connected: Map<string, SocketInformation>, controllers: Controllers) {
        this.io = io;
        this.connected = connected;
        this.controllers = controllers;
    }

    /** Display a content on a TV. If the content is null, an error will be
     *  thrown to the websocket client.
     *
     * @param target Define the kind of emission (one TV, a group or all TVs).
     * @param id ID of the TV or group of TVs to display the content on.
     * @param content Content to display.
     */
    public display(target: WebSocketTarget, id: string | null, content: Content | null) {
        if (content === null) {
            this.emit(target, id, KioskEvents.EXCEPTION, new NullContentError());
        } else {
            const message = {
                content: this.controllers.content.prepareContentForDisplay(content)
            };
            this.emit(target, id, KioskEvents.DISPLAY, message);
        }
    }

    /** Throw/Forward an app error to a TV.
     *
     * @param tvID ID of the TV to throw the error to.
     * @param err Error to throw.
     */
    public throw(tvID: string, err: KioskError): void {
        this.getSocket(tvID)?.emit(KioskEvents.EXCEPTION, err);
    }

    /** Send an identifiation event to a TV to idsplay it's ID on the
     *  screen.
     *
     * @param target Broadcast target.
     * @param id ID of the TV or group of TVs to identify.
     * @param duration Duration to display the ID on the TV (in ms).
     */
    public identify(target: WebSocketTarget, id: string | null, value: number = config.DEFAULT_IDENTIFY_DURATION) {
        this.emit(target, id, KioskEvents.IDENTIFY, {
            duration: value || config.DEFAULT_IDENTIFY_DURATION
        });
    }

    public reload(target: WebSocketTarget, id: string | null) {
        this.emit(target, id, KioskEvents.RELOAD);
    }

    public brightness(target: WebSocketTarget, id: string | null, value: number = config.DEFAULT_BRIGHTNESS) {
        this.emit(target, id, KioskEvents.BRIGHTNESS, {
            brightness: value || config.DEFAULT_BRIGHTNESS
        });
    }

    public toggleMute(target: WebSocketTarget, id: string | null, value: boolean) {
        this.emit(target, id, KioskEvents.TOGGLE_MUTE, {
            muted: value || false
        });
    }

    public join(tvID: string, group: Group | null): void {
        // Leave all groups
        const socket = this.getSocket(tvID);
        socket?.leaveAll();

        // Then updating if needed
        if (group) {
            socket?.join(group.id);
        }
    }

    /** Setup the base behavior for websocket.
     */
    public init(): void {
        this.io.on(BuiltInEvents.CONNECT, (socket) => {
            // Get the client IP
            const ip = socket.conn.remoteAddress.split(":").pop();
            let id: string = null;

            socket.on(KioskEvents.REGISTER, wrap(async (payload: RegisterPayload) => {
                id = payload.id;

                if (this.connected.has(id)) {
                    const err = new AlreadyInUseError(`TV '${payload.id}' is already connected.`);

                    logger.warn(`TV '${id}' tried to connect (from ${ip}) but was already connected.`);
                    socket.emit(KioskEvents.EXCEPTION, err);
                } else {
                    // Save information about the connected TV
                    // (Since we have the TV id, we can easily retrieve the TV instance)
                    this.connected.set(id, {
                        socket
                    });

                    try {
                        const tv = await this.controllers.tv.getOne(id, true);

                        logger.info(`TV '${id}' joined (from ${ip}).`);

                        // Choose what to send to the TV
                        if (!tv.active || tv.group?.active === false) {
                            socket.emit(KioskEvents.EXCEPTION, new InactiveError());
                        } else if (!tv.content) {
                            socket.emit(KioskEvents.EXCEPTION, new NullContentError());
                        } else {
                            const content = this.controllers.content.prepareContentForDisplay(await tv.getContent());
                            const message = {
                                content: {
                                    description: content.description,
                                    displayName: content.displayName,
                                    id: content.id,
                                    type: content.type,
                                    uri: content.uri
                                },
                                tv: {
                                    brightness: tv.brightness,
                                    displayName: tv.displayName,
                                    id: tv.id,
                                    muted: tv.muted
                                }
                            };

                            socket.emit(KioskEvents.INIT, message);
                        }

                        // Join a room that is the group
                        if (tv.group) {
                            socket.join((await tv.getGroup()).id);
                        }

                        // Update some TV information
                        await this.controllers.tv.updateOne(id, {
                            ip,
                            machine: payload.machine,
                            on: true,
                            screenSize: payload.screenSize,
                            version: payload.version
                        }, [
                            "ip",
                            "machine",
                            "on",
                            "screenSize",
                            "version"
                        ]);

                        socket.emit(KioskEvents.IDENTIFY, {
                            duration: config.DEFAULT_IDENTIFY_DURATION
                        });
                    } catch (err) {
                        if (err instanceof ResourceNotFoundError) {
                            logger.warn(`TV '${id}' tried to join (from ${ip}) but it's not referenced.`);
                            socket.emit(KioskEvents.EXCEPTION, err);
                        } else {
                            throw err;
                        }
                    }
                }
            }));

            socket.on(BuiltInEvents.DISCONNECT, wrap(async () => {
                if (this.connected.has(id)) {
                    try {
                        this.connected.delete(id);

                        // Flag the TV as disconnected
                        await this.controllers.tv.updateOne(id, {
                            on: false
                        }, [
                            "on"
                        ]);

                        logger.info(`TV '${id}' left (from ${ip}).`);
                    } catch (err) {
                        // TV might not exist yet
                        if (err instanceof ResourceNotFoundError) {
                            logger.warn(`Unreferenced TV '${id}' left (from ${ip}).`);
                        } else {
                            throw err;
                        }
                    }
                }
            }));
        });
    }

    /** Get the socket ID associated to a TV id (if connected).
     *
     * @param tvID TV ID to get the socket ID from
     *
     * @returns Socket ID.
     */
    private getSocket(tvID: string): Socket {
        return this.connected.get(tvID)?.socket;
    }

    /** Wrap the emit strategy to reduce code duplication.
     *
     * @param target Broadcast strategy (either one TV, a group or all).
     * @param id ID of the set to target (null for all).
     * @param event Event to emit.
     * @param data Optional data to send to the clients.
     */
    private emit(target: WebSocketTarget, id: string | null, event: BuiltInEvents | KioskEvents, ...data: any[]) {
        // If destination is not provided, broadcasting
        if (!id) {
            target = WebSocketTarget.ALL;
        }

        switch (target) {
            case WebSocketTarget.ONE: {
                this.getSocket(id)?.emit(event, ...data);
                break;
            }
            case WebSocketTarget.GROUP: {
                this.io.in(id).emit(event, ...data);
                break;
            }
            case WebSocketTarget.ALL: {
                this.io.emit(event, ...data);
                break;
            }
            default: {
                this.getSocket(id)?.emit(event, ...data);
                break;
            }
        }
    }
}
