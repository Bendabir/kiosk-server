import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class ConflictError extends KioskError {
    public static readonly code = ErrorCode.CONFLICT;
    public static readonly reason = "This resource already exists.";
    public static readonly status = http.CONFLICT;
}
