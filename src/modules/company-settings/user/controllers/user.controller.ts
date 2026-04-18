import { Request, Response } from "express";
import { getAllRolesService, getAllUsersService } from "../services/user.service";
import { HTTP_STATUS } from "../../../../config/http.config";
import { asyncHandler } from "../../../../middlewares/asyncHandler.middleware";
import { prisma } from "../../../../config/prismaClient";

export const getAllUsersController = asyncHandler(async (req: Request, res: Response) => {
	const { companyCode } = req.body;

	if (!companyCode) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "companyCode is required" });
	}

	const allUSers = await getAllUsersService(companyCode as string);

	return res.status(HTTP_STATUS.OK).json({
		message: "All users fetched successfully!",
		code: HTTP_STATUS.OK,
		data: allUSers,
	});
});


export const getAllRolesController = asyncHandler(async (req: Request, res: Response) => {
	const roles= await getAllRolesService();

	// console.log(roles);
	if(roles.length > 0) {
		return res.status(HTTP_STATUS.OK).json({
			message: "Roles fetched successfully!",
			code: HTTP_STATUS.OK,
			data: roles,
		});
	}

	return res.status(HTTP_STATUS.OK).json({
		message: "Roles not found!",
		code: HTTP_STATUS.NOT_FOUND,
		data: roles,
	});
});

