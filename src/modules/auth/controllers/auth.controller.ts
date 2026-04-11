import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginService, registerService } from "../services/auth.service";
import { generateAccessToken, removeAuthCookies, setJwtAuthCookie } from "../../../utils/cookie";
import { HTTP_STATUS } from "../../../config/http.config";
import { prisma } from "../../../config/prismaClient";
import { hashValue } from "../../../utils/argon";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
	const body = registerSchema.parse(req.body);

	const user = await registerService(body);

	const userId = user.id as unknown as string;

	const accessToken = generateAccessToken(userId);

	const hashedToken = await hashValue(accessToken);

	let refreshToken= "";
	let version="";

	// Exclude sensitive fields from response
	const { password: _password, id: _id, ...userWithoutSensitiveData } = user;

	return setJwtAuthCookie({ res, accessToken, refreshToken, version }).status(HTTP_STATUS.CREATED).json({
		message: "User created successfully!",
		user: userWithoutSensitiveData,
	});
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
	const body = loginSchema.parse(req.body);

	const ip: string = req.ip ?? "unknown";

	const { userData, accessToken, refreshToken, encryptedVersion } = await loginService(
		body,
		String(req.headers["user-agent"]),
		ip
	);

	return setJwtAuthCookie({ res, accessToken, refreshToken, version:encryptedVersion }).status(HTTP_STATUS.OK).json({
		message: "User logged-in successfully!",
		user: userData,
	});
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
	console.log(req.user);

	const token = req.cookies?.accessToken;
	const userEmail = req.user?.email;

	if (!token) {
		return res.status(HTTP_STATUS.OK).json({ message: "Already logged out" });
	}

	const user = await prisma.userMaster.findUnique({
		where: {
			email: userEmail,
		},
	});

	if (user) {
		await prisma.userActivity.delete({
			where: {
				userId: user.id,
			},
		});
	}

	removeAuthCookies(res);


	return res.status(HTTP_STATUS.OK).json({
		message: "User logged-out successfully",
	});
});
