import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../../config/http.config";
import { prisma } from "../../../config/prismaClient";
import { AppError } from "../../../utils/appError";
import { compareHash } from "../../../utils/argon";
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

		const version = decrypt(encryptedVersion as string);

		if (!accessToken) {
			return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Token not found!" });
		}

		try {
			const decoded = verifyToken(accessToken as string);

			if (!decoded?.userId) {
				return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
			}

			if (!version) {
				return rejectSession(res, HTTP_STATUS.CONFLICT, "Expired version!");
			}

			const userActivity = await prisma.userActivity.findUnique({
				where: { userId: decoded?.userId },
				select: { token: true, userId: true, expireAt: true, version: true },
			});

			if (!userActivity) {
				return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "Session expired.");
			}

			if (version !== userActivity?.version) {
				return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "Version mismatch!");
			}

			const user = await prisma.userMaster.findUnique({
				where: {
					id: decoded.userId,
				},
			});

			if (!user) {
				return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "User not found!");
			}

			req.user = user;

			return next();
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				const decodedExpired: any = jwt.decode(accessToken as string);

				if (
					!decodedExpired ||
					typeof decodedExpired !== "object" ||
					!("userId" in decodedExpired)
				) {
					return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "Invalid expired token");
				}

				const userActivity = await prisma.userActivity.findUnique({
					where: { userId: decodedExpired?.userId },
					select: { token: true, userId: true, expireAt: true, version: true },
				});

				if (!userActivity) {
					return rejectSession(
						res,
						HTTP_STATUS.UNAUTHORIZED,
						"Session expired. Please login again."
					);
				}

				if (!version) {
					return rejectSession(res, HTTP_STATUS.UNAUTHORIZED, "Expired version!");
				}

				// console.log(version, userActivity?.version)
				if (version !== userActivity?.version) {
					return rejectSession(res, HTTP_STATUS.CONFLICT, "Version mismatch!");
				}

				if (!refreshToken) {
					return rejectSession(
						res,
						HTTP_STATUS.UNAUTHORIZED,
						"Token not found! Log-in again!"
					);
				}

				if (userActivity.expireAt < new Date()) {
					return rejectSession(
						res,
						HTTP_STATUS.UNAUTHORIZED,
						"Session expired. Please login again."
					);
				}

				const isTokenValid = await compareHash(refreshToken as string, userActivity.token);
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
					return rejectSession(res, HTTP_STATUS.NOT_FOUND, "User not found");
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
