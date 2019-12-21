import { Socket } from "socket.io";
import { logger } from "../logging";
import { Payload } from "./payloads";

export const wrap = (fn: (_: Socket | Payload) => void) => {
    return (param: Socket | Payload) => Promise.resolve(fn(param)).catch((err) => {
        logger.error(err.message);
    });
};
