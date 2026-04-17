import { Request, Response } from "express";
import { getAllUsersService } from "../services/user.service";
import { HTTP_STATUS } from "../../../../config/http.config";
import { asyncHandler } from "../../../../middlewares/asyncHandler.middleware";
import { prisma } from "../../../../config/prismaClient";

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
		message: "All users fetched successfully!",
		code: HTTP_STATUS.OK,
		data: allUSers,
	});
});


export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
	const roles= await prisma.role.findMany({
		select: {
			roleName: true,
			category: true,
			subCategory: true,
			permissionLevel: true,
			isActive: true,
		}
	});

	console.log(roles)
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

