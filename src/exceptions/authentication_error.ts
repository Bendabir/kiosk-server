import http from "http-status-codes";
import { ErrorCode, KioskError } from "./kiosk_error";

export class AuthenticationError extends KioskError {
    public static readonly code = ErrorCode.AUTHENTICATION;
    public static readonly reason = "Wrong authentication key";
    public static readonly status = http.UNAUTHORIZED;
}
