import { AlreadyInUseError } from "./already_in_use_error";
import { AuthenticationError } from "./authentication_error";
import { BadRequestError } from "./bad_request_error";
import { ConflictError } from "./conflict_error";
import { DeletedTVError } from "./deleted_tv_error";
import { ForbiddenError } from "./forbidden_error";
import { InactiveError } from "./inactive_error";
import { InternalError } from "./internal_error";
import { ErrorCode, KioskError } from "./kiosk_error";
import { MethodNotAllowedError } from "./method_not_allowed_error";
import { NotImplementedError } from "./not_implemented_error";
import { NullContentError } from "./null_content_error";
import { ResourceNotFoundError } from "./resource_not_found_error";
import { ServerUnavailableError } from "./service_unavailable_error";
import { UnauthorizedError } from "./unauthorized_error";
import { UnsupportedClientError } from "./unsupported_client_error";

const ERRORS = [
    AlreadyInUseError,
    AuthenticationError,
    BadRequestError,
    ConflictError,
    DeletedTVError,
    ForbiddenError,
    InactiveError,
    InternalError,
    KioskError,
    MethodNotAllowedError,
    NotImplementedError,
    NullContentError,
    ResourceNotFoundError,
    ServerUnavailableError,
    UnauthorizedError,
    UnsupportedClientError
].reduce((map, error) => {
    map[error.code] = error;
    return map;
}, {} as { [key: string]: typeof KioskError; });

export {
    AlreadyInUseError,
    AuthenticationError,
    BadRequestError,
    ConflictError,
    DeletedTVError,
    ErrorCode,
    ERRORS,
    ForbiddenError,
    InactiveError,
    InternalError,
    KioskError,
    MethodNotAllowedError,
    NotImplementedError,
    NullContentError,
    ResourceNotFoundError,
    ServerUnavailableError,
    UnauthorizedError,
    UnsupportedClientError
};
