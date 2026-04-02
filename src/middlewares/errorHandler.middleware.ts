import { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../config/http.config";
import { AppError, ErrorCode } from "../utils/appError";

export const errorHandler: ErrorRequestHandler= (
    error, req, res, next
): any => {
    console.error(`Error occured: ${req.path}`, error);

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        })
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Something went wrong!",
        errorCode: ErrorCode.ERR_INTERNAL
    })
} 