import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class NullContentError extends KioskError {
    public static readonly code = ErrorCode.NULL_CONTENT;
    public static readonly reason = "Nothing to display";
    public static readonly status = http.INTERNAL_SERVER_ERROR;
}
