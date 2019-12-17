import { BadRequestError } from "./bad_request_error";
import { ConflictError } from "./conflict_error";
import { ForbiddenError } from "./forbidden_error";
import { InternalError } from "./internal_error";
import { ErrorCode, KioskError } from "./kiosk_error";
import { MethodNotAllowedError } from "./method_not_allowed_error";
import { NotImplementedError } from "./not_implemented_error";
import { ResourceNotFoundError } from "./resource_not_found_error";
import { ServerUnavailableError } from "./service_unavailable_error";
import { UnauthorizedError } from "./unauthorized_error";

const ERRORS = [
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
    ERRORS,
    ResourceNotFoundError,
    MethodNotAllowedError,
    BadRequestError,
    ForbiddenError,
    InternalError,
    NotImplementedError,
    ServerUnavailableError,
    UnauthorizedError,
    ConflictError
};
