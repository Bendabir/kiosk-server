import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class ResourceNotFoundError extends KioskError {
    public static readonly code = ErrorCode.RESOURCE_NOT_FOUND;
    public static readonly reason = "Resource couldn't be found.";
    public static readonly status = http.NOT_FOUND;
}
