import { Server, Socket } from "socket.io";
import { AlreadyInUseError, ErrorCode, KioskError } from "../exceptions";
import { logger } from "../logging";
import { BuiltInEvents, KioskEvents } from "./events";

interface RegisterPlayload {
    id: string;
    screenSize: string;
    machine: string;
    version: string;
}

interface ErrorPayload {
    code: ErrorCode;
}

const connected: any = {};

export const bind = (io: Server) => {
    io.on(BuiltInEvents.CONNECT, (socket) => {
        // Extracting the client IP
        const ip = socket.conn.remoteAddress.split(":").pop();

        socket.on(KioskEvents.REGISTER, (payload: RegisterPlayload) => {
            // Checking if the TV isn't already connected
            if (payload.id in connected) {
                logger.warn(`TV '${payload.id}' tried to connect (from ${ip}) but was already connected.`);
                console.log(JSON.stringify(new AlreadyInUseError(`TV '${payload.id}' is already connected.`)));
                socket.emit(KioskEvents.EXCEPTION, new AlreadyInUseError(`TV '${payload.id}' is already connected.`));
            } else {
                connected[payload.id] = socket.id;
                logger.info(`TV '${payload.id}' joined (from ${ip}).`);
            }
        });
    });
};
