import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../../config/http.config";
import { prisma } from "../../../config/prismaClient";
import { AppError } from "../../../utils/appError";
import {
	generateAccessToken,
	removeAuthCookies,
	setAccessToken,
	verifyToken,
} from "../../../utils/cookie";
import { decrypt } from "../../../utils/utils";

const rejectSession = (res: Response, code: number, message: string) => {
	removeAuthCookies(res);
	return res.status(code).json({ message });
};

export const validateSessionMiddleware = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.cookies?.accessToken;
		const encryptedVersion = req.cookies?.version;
		const refreshToken = req.cookies?.refreshToken;

		console.log(req.cookies);
		const version = decrypt(encryptedVersion as string);

		
		try {
			if (!accessToken) {
				console.error("Token not found!")
				throw new jwt.TokenExpiredError("Access token missing", new Date());
			}
			
			const decoded = verifyToken(accessToken as string);

			if (!decoded?.userId) {
				return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
			}

			if (!version) {
				return rejectSession(res, HTTP_STATUS.CONFLICT, "Expired version!");
			}

			const userActivity = await prisma.userActivity.findUnique({
				where: { userId: decoded?.userId },
				select: { userId: true, expireAt: true, version: true },
			});

			if (!userActivity) {
				return rejectSession(res, HTTP_STATUS.NOT_FOUND, "Session not found.");
			}

			if (version !== userActivity?.version) {
				return rejectSession(res, HTTP_STATUS.CONFLICT, "Version mismatch!");
			}

			const user = await prisma.userMaster.findUnique({
				where: {
					id: decoded.userId,
				},
			});

			if (!user) {
				return rejectSession(res, HTTP_STATUS.NOT_FOUND, "User not found!");
			}

			req.user = user;

			return next();
		} catch (error:any) {
			if (error instanceof jwt.TokenExpiredError) {
				if (!refreshToken) {	
					return rejectSession(
						res,
						HTTP_STATUS.NOT_FOUND,
						"Refresh token not found! Log-in again!"
					);
				}

				const userActivity = await prisma.userActivity.findUnique({
					where: { token: refreshToken },
					select: { token: true, userId: true, expireAt: true, version: true },
				});

				if (!userActivity) {
					return rejectSession(
						res,
						HTTP_STATUS.NOT_FOUND,
						"Session not found during refreshing the token!"
					);
				}

				if (!version) {
					return rejectSession(res, HTTP_STATUS.NOT_FOUND, "Version not found during refreshing the token!");
				}

				if (version !== userActivity?.version) {
					return rejectSession(res, HTTP_STATUS.CONFLICT, "Version mismatch during refreshing the token!");
				}


				if (userActivity.expireAt < new Date()) {
					return rejectSession(
						res,
						HTTP_STATUS.UNAUTHORIZED,
						"Refresh token expired. Please login again."
					);
				}

				const isTokenValid = refreshToken === userActivity.token;
				// console.log(refreshToken, userActivity?.token, isTokenValid)

				if (!isTokenValid) {
					return rejectSession(
						res,
						HTTP_STATUS.UNAUTHORIZED,
						"Invalid session. Please login again."
					);
				}

				const newAccessToken = generateAccessToken(userActivity?.userId);

				setAccessToken({ res, accessToken: newAccessToken });

				const user = await prisma.userMaster.findUnique({
					where: { id: userActivity.userId },
				});

				if (!user) {
					return rejectSession(res, HTTP_STATUS.NOT_FOUND, "User not found during refreshing the token!");
				}

				req.user = user;

				return next();
			}

			if (error instanceof jwt.JsonWebTokenError) {
				throw new AppError(`Invalid token: ${error}`, HTTP_STATUS.UNAUTHORIZED);
			}

			throw error;
		}
	}
);
