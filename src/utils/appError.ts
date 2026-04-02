import { HTTP_STATUS, HttpStatusCodeType } from "../config/http.config";

export const ErrorCode= {
    ERR_INTERNAL: "ERR_INTERNAL",
    ERR_BAD_REQUEST:"ERR_BAD_REQUEST",
    ERR_UNAUTHORIZED:"ERR_UNAUTHORIZED",
    ERR_FORBIDDEN:"ERR_FORBIDDEN",
    ERR_NOT_FOUND:"ERR_NOT_FOUND",
} as const;

export type ErrorCodeType= keyof typeof ErrorCode;

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: HttpStatusCodeType= HTTP_STATUS.INTERNAL_SERVER_ERROR,
        public errorCode:ErrorCodeType =ErrorCode.ERR_INTERNAL
    ) {
        super(message);
        Error.captureStackTrace(this);
    }
}

export class InternalServerException extends AppError {
    constructor(message: string= "Internal Server Error") {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ErrorCode.ERR_INTERNAL)
    }
}

export class BadRequestException extends AppError {
    constructor(message: string= "Bad Request") {
        super(
            message,
            HTTP_STATUS.BAD_REQUEST,
            ErrorCode.ERR_BAD_REQUEST
        )
    }
}

export class UnauthorizedException extends AppError {
    constructor(message: string= "Unauthorized Access") {
        super(
            message,
            HTTP_STATUS.UNAUTHORIZED,
            ErrorCode.ERR_UNAUTHORIZED
        )
    }
}

export class ForbiddenException extends AppError {
    constructor(message: string= "Forbidden Resource") {
        super(
            message,
            HTTP_STATUS.FORBIDDEN,
            ErrorCode.ERR_FORBIDDEN
        )
    }
}

export class NotFoundException extends AppError {
    constructor(message: string= "Resource Not Found!") {
        super(
            message,
            HTTP_STATUS.NOT_FOUND,
            ErrorCode.ERR_NOT_FOUND
        )
    }
}