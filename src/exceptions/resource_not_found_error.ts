import { ErrorCode, KioskError } from "./kiosk_error";

export class ResourceNotFoundError extends KioskError {
    public static readonly code = ErrorCode.RESOURCE_NOT_FOUND;

    constructor(details: string | null = null) {
        super("Resource couldn't be found.", details);
    }
}
