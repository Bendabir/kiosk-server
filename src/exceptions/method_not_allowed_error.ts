import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class MethodNotAllowedError extends KioskError {
    public static readonly code = ErrorCode.METHOD_NOT_ALLOWED;
    public static readonly reason = "Method is not allowed.";
    public static readonly status = http.METHOD_NOT_ALLOWED;
}
