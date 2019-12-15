import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class UnauthorizedError extends KioskError {
    public static readonly code = ErrorCode.UNAUTHORIZED;
    public static readonly reason = "Logging required.";
    public static readonly status = http.UNAUTHORIZED;
}
