import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  userIdParamSchema,
  businessUnitIdParamSchema,
  getUsersByBusinessUnitSchema,
  getUserTransactionsSchema,
  getBusinessUnitTransactionsSchema
} from "../validators/user.validator";
import { HTTP_STATUS } from "../../../config/http.config";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Validation failed",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }
      
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error"
      });
    }
  };
};

export const validateUserId = validateRequest(
  z.object({
    params: userIdParamSchema
  })
);

export const validateBusinessUnitId = validateRequest(
  z.object({
    params: businessUnitIdParamSchema
  })
);

export const validateGetUsersByBusinessUnit = validateRequest(getUsersByBusinessUnitSchema);
export const validateGetUserTransactions = validateRequest(getUserTransactionsSchema);
export const validateGetBusinessUnitTransactions = validateRequest(getBusinessUnitTransactionsSchema);
