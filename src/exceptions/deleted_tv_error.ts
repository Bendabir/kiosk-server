import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class DeletedTVError extends KioskError {
    public static readonly code = ErrorCode.DELETED;
    public static readonly reason = "TV has been deleted";
    public static readonly status = http.INTERNAL_SERVER_ERROR;
}
