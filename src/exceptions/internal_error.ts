import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class InternalError extends KioskError {
    public static readonly code = ErrorCode.INTERNAL;
    public static readonly reason = "Internal server error.";
    public static readonly status = http.INTERNAL_SERVER_ERROR;
}
