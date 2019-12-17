import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class BadRequestError extends KioskError {
    public static readonly code = ErrorCode.BAD_REQUEST;
    public static readonly reason = "Bad request.";
    public static readonly status = http.BAD_REQUEST;
}
