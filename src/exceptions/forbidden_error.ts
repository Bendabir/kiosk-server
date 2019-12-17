import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class ForbiddenError extends KioskError {
    public static readonly code = ErrorCode.FORBIDDEN;
    public static readonly reason = "Insufficient rights.";
    public static readonly status = http.FORBIDDEN;
}
