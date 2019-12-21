import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class AlreadyInUseError extends KioskError {
    public static readonly code = ErrorCode.ALREADY_IN_USE;
    public static readonly reason = "TV is already in use";
    public static readonly status = http.INTERNAL_SERVER_ERROR;
}
