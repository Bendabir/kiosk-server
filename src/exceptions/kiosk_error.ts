enum ErrorCode {
    UNKNOWN = "E000",
    RESOURCE_NOT_FOUND = "E001"
}

export class KioskError extends Error {
    public static readonly Codes = ErrorCode;

    public code: ErrorCode;
    public details: string | null;

    constructor(code: ErrorCode, message: string, details: string | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;
    }
}
