import { Request } from "express";
import { Server } from "socket.io";

export interface RequestWithWebSocket extends Request {
    io: Server;
}
