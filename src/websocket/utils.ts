import { Socket } from "socket.io";
import { logger } from "../logging";
import { Payload } from "./payloads";

export const wrap = (fn: (_: Socket | Payload) => void) => {
    return (socketOrPayload: Socket | Payload) => Promise.resolve(fn(socketOrPayload)).catch((err: Error) => {
        logger.error(`Error with websocket : ${err.message}`);

        if (process.env.NODE_ENV !== "production") {
            err.stack.split("\n").slice(1).forEach((ln) => {
                logger.error(ln);
            });
        }
    });
};
