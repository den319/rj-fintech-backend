import { Request, Response } from "express";
import { asyncHandler } from "../../../../middlewares/asyncHandler.middleware";
import { getAllCompaniesService } from "../services/company.service";
import { HTTP_STATUS } from "../../../../config/http.config";

export const getAllCompaniesController = asyncHandler(async (req: Request, res: Response) => {
	const companies = await getAllCompaniesService();

	if(companies.length > 0) {
		return res.status(HTTP_STATUS.OK).json({
			message: "Companies fetched successfully!",
			data: companies,
	});
	}

	return res.status(HTTP_STATUS.NOT_FOUND).json({
		message: "Companies not found!",
		data: companies,
	});
});
