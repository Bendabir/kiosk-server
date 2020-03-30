import { Socket } from "socket.io";

export interface SocketInformation {
    socket: Socket;
}

export enum WebSocketTarget {
    ONE = "one",
    GROUP = "group",
    ALL = "all"
}
