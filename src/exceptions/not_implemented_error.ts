import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class NotImplementedError extends KioskError {
    public static readonly code = ErrorCode.NOT_IMPLEMENTED;
    public static readonly reason = "This feature is not implemented.";
    public static readonly status = http.NOT_IMPLEMENTED;
}
