import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class UnsupportedClientError extends KioskError {
    public static readonly code = ErrorCode.UNSUPPORTED;
    public static readonly reason = "Client version is not supported";
    public static readonly status = http.INTERNAL_SERVER_ERROR;
}
