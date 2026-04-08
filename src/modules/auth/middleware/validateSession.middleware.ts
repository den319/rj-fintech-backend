import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../../config/http.config";
import { prisma } from "../../../config/prismaClient";
import { getEnv } from "../../../utils/getEnv";
import { AppError } from "../../../utils/appError";
import { compareHash } from "../../../utils/bcrypt";

export const validateSessionMiddleware = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.cookies?.accessToken;

		if (!accessToken) {
			return next();
		}

		try {
			const decoded = jwt.verify(accessToken, getEnv("JWT_SECRET")) as { userId: string };

			if (!decoded?.userId) {
				return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token" });
			}

			const userActivity = await prisma.userActivity.findUnique({
				where: { userId: decoded.userId },
				select: { token: true, userId: true },
			});

			if (!userActivity) {
				return res
					.status(HTTP_STATUS.UNAUTHORIZED)
					.json({ message: "Session expired. Please login again." });
			}

			const isTokenValid = await compareHash(accessToken, userActivity.token);

			if (!isTokenValid) {
				return res
					.status(HTTP_STATUS.UNAUTHORIZED)
					.json({ message: "Invalid session. Please login again." });
			}

			return next();
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
				throw new AppError(`Invalid or expired token: ${error}`, HTTP_STATUS.UNAUTHORIZED);
			}

			throw error;
		}
	}
);
