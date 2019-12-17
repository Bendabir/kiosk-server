import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class ServerUnavailableError extends KioskError {
    public static readonly code = ErrorCode.SERVICE_UNAVAILABLE;
    public static readonly reason = "Service unavailable.";
    public static readonly status = http.SERVICE_UNAVAILABLE;
}
