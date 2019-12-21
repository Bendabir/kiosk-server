import { Server } from "socket.io";
import { AlreadyInUseError, InactiveError, NullContentError, ResourceNotFoundError } from "../exceptions";
import { logger } from "../logging";
import { Content, Group, TV } from "../models";
import { BuiltInEvents, KioskEvents } from "./events";
import { RegisterPlayload } from "./payloads";
import { wrap } from "./utils";

const connected: any = {};

export const bind = (io: Server) => {
    io.on(BuiltInEvents.CONNECT, (socket) => {
        // Extracting the client IP
        const ip = socket.conn.remoteAddress.split(":").pop();
        let id: string | null = null;

        socket.on(KioskEvents.REGISTER, wrap(async (payload: RegisterPlayload) => {
            // Checking if the TV isn't already connected
            if (payload.id in connected) {
                logger.warn(`TV '${payload.id}' tried to connect (from ${ip}) but was already connected.`);
                socket.emit(KioskEvents.EXCEPTION, new AlreadyInUseError(`TV '${payload.id}' is already connected.`));
            } else {
                const tv = await TV.findOne({
                    include: [{
                        model: Content
                    }, {
                        model: Group
                    }],
                    where: {
                        id: payload.id
                    }
                });

                if (!tv) {
                    socket.emit(KioskEvents.EXCEPTION, new ResourceNotFoundError("Unknown TV."));
                } else {
                    id = payload.id;
                    connected[id] = {
                        socketID: socket.id,
                        tv
                    };
                    logger.info(`TV '${id}' joined (from ${ip}).`);

                    if (!tv.active || tv.group?.active === false) {
                        socket.emit(KioskEvents.EXCEPTION, new InactiveError());
                    } else if (!tv.content) {
                        socket.emit(KioskEvents.EXCEPTION, new NullContentError());
                    } else {
                        socket.emit(KioskEvents.DISPLAY, {
                            content: tv.content.uri
                        });
                    }

                    await tv.update({
                        ip,
                        machine: payload.machine,
                        on: true,
                        screenSize: payload.screenSize,
                        version: payload.version,
                    });
                }
            }
        }));

        socket.on(BuiltInEvents.DISCONNECT, wrap(async () => {
            if (id in connected) {
                await connected[id].tv.update({
                    on: false
                });
                delete connected[id];
                logger.info(`TV '${id}' left (from ${ip}).`);
            }
        }));
    });
};
