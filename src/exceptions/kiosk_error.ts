export enum ErrorCode {
    UNKNOWN = "E000",
    RESOURCE_NOT_FOUND = "E404",
    METHOD_NOT_ALLOWED = "E405",
    INTERNAL = "E500"
}

export class KioskError extends Error {
    public static readonly code: ErrorCode = ErrorCode.UNKNOWN;
    public static readonly reason: string = "Unknown error";
    public message: string | null;

    constructor(message: string | null = null) {
        super();
        this.name = this.constructor.name;
        this.message = message;
    }

    get code(): ErrorCode {
        return Object.getPrototypeOf(this).constructor.code;
    }

    get reason(): string {
        return Object.getPrototypeOf(this).constructor.reason;
    }
}
