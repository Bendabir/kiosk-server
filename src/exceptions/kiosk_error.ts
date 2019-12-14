export enum ErrorCode {
    UNKNOWN = "E000",
    RESOURCE_NOT_FOUND = "E404",
    METHOD_NOT_ALLOWED = "E405",
    INTERNAL = "E500"
}

export class KioskError extends Error {
    public static code: ErrorCode = ErrorCode.UNKNOWN;
    public details: string | null;

    constructor(message: string, details: string | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
    }

    get code(): ErrorCode {
        return Object.getPrototypeOf(this).constructor.code;
    }
}
