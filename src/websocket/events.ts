export enum BuiltInEvents {
    CONNECT = "connect",
    CONNECT_ERROR = "connect_error",
    CONNECT_FAILED = "connect_failed",
    CONNECT_TIMEOUT = "connect_timeout",
    CONNECTING = "connecting",
    DISCONNECT = "disconnect",
    DISCONNECTING = "disconnecting",
    ERROR = "error",
    MESSAGE = "message",
    NEW_LISTENER = "newListener",
    PING = "ping",
    PONG = "pong",
    RECONNECT = "reconnect",
    RECONNECT_ATTEMPT = "reconnect_attempt",
    RECONNECT_ERROR = "reconnect_error",
    RECONNECT_FAILED = "reconnect_failed",
    RECONNECTING = "reconnecting",
    REMOVE_LISTENER = "removeListener"
}

export enum KioskEvents {
    DISPLAY = "display",
    EXCEPTION = "exception",
    IDENTIFY = "identify",
    REGISTER = "register"
}
