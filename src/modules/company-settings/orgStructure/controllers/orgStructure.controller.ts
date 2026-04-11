import { Request, Response } from "express";
import { getAllUsersService, getOrgStructureService } from "../services/orgStructure.service";
import { HTTP_STATUS } from "../../../../config/http.config";
import { asyncHandler } from "../../../../middlewares/asyncHandler.middleware";

export const getOrgStructureController = asyncHandler(async (req: Request, res: Response) => {
	const { companyCode } = req.body;
	const user = req?.user;

	if (!companyCode) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "companyCode is required" });
	}

	if (!user) {
		return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "" });
	}

	const orgStructure = await getOrgStructureService(companyCode as string, user);

	if (orgStructure.length > 0) {
		return res.status(HTTP_STATUS.OK).json({
			message: "Organization structure fetched successfully!",
			code: HTTP_STATUS.OK,
			data: orgStructure,
		});
	}

	return res.status(HTTP_STATUS.OK).json({
		message: "Organization structure not found!!",
		code: HTTP_STATUS.NOT_FOUND,
		data: orgStructure,
	});
});

export const getAllUsersController = asyncHandler(async (req: Request, res: Response) => {
	const { companyCode } = req.body;
	const user = req?.user;

	if (!companyCode) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "companyCode is required" });
	}

	if (!user) {
		return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "" });
	}

	const allUSers = await getAllUsersService(companyCode as string, user);

	return res.status(HTTP_STATUS.OK).json({
		message: "Organization structure fetched successfully!",
		code: HTTP_STATUS.OK,
		data: allUSers,
	});
});
