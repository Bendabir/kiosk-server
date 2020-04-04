import http from "http-status-codes";

export enum ErrorCode {
    UNKNOWN = "E000",
    ALREADY_IN_USE = "E001",
    NULL_CONTENT = "E002",
    INACTIVE = "E003",
    DELETED = "E004",
    UNSUPPORTED = "E005",
    AUTHENTICATION = "E006",
    BAD_REQUEST = "E400",
    UNAUTHORIZED = "E401",
    FORBIDDEN = "E403",
    CONFLICT = "E409",
    GONE = "E410",
    RESOURCE_NOT_FOUND = "E404",
    METHOD_NOT_ALLOWED = "E405",
    INTERNAL = "E500",
    NOT_IMPLEMENTED = "E501",
    SERVICE_UNAVAILABLE = "E503"
}

export class KioskError extends Error {
    public static readonly code: ErrorCode = ErrorCode.UNKNOWN;
    public static readonly reason: string = "Unknown error";
    public static readonly status: number = http.INTERNAL_SERVER_ERROR;
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

    get status(): number {
        return Object.getPrototypeOf(this).constructor.status;
    }

    public toJSON() {
        return {
            code: this.code,
            message: this.message,
            name: this.name,
            reason: this.reason
        };
    }
}
