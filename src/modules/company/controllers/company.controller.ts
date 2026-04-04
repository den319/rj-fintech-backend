import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import { getAllCompaniesService } from "../services/company.service";
import { HTTP_STATUS } from "../../../config/http.config";

export const getAllCompanies = asyncHandler(async (req: Request, res: Response) => {
  const companies = await getAllCompaniesService();

  return res.status(HTTP_STATUS.OK).json({
    message: "Companies fetched successfully!",
    companies,
  });
});
