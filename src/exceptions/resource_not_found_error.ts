import { KioskError } from "./kiosk_error";

export class ResourceNotFoundError extends KioskError {
    constructor(details: string | null = null) {
        super(KioskError.Codes.RESOURCE_NOT_FOUND, "Resource couldn't be found.", details);
    }
}
