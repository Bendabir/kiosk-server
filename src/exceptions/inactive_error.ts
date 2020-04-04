import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class InactiveError extends KioskError {
    public static readonly code = ErrorCode.INACTIVE;
    public static readonly reason = "TV has been disabled";
    public static readonly status = http.INTERNAL_SERVER_ERROR;
}
