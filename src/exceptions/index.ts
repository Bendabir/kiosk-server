import { ErrorCode, KioskError } from "./kiosk_error";
import { MethodNotAllowedError } from "./method_not_allowed_error";
import { ResourceNotFoundError } from "./resource_not_found_error";

const Errors = [
    KioskError,
    MethodNotAllowedError,
    ResourceNotFoundError
].reduce((map, error) => {
    map[error.code] = error;
    return map;
}, {} as { [key: string]: typeof KioskError; });

export {
    KioskError,
    ErrorCode,
    Errors,
    ResourceNotFoundError,
    MethodNotAllowedError
};
