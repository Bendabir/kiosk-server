import { Socket } from "socket.io";

export interface SocketInformation {
    socket: Socket;
}

export type ConnectedInformation = Map<string, SocketInformation>;

export enum WebSocketTarget {
    ONE = "one",
    GROUP = "group",
    ALL = "all"
}
