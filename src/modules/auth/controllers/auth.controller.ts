import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginService, refreshTokenService, registerService } from "../servieces/auth.service";
import { generateAccessToken, generateRefreshToken, setJwtAuthCookie } from "../../../utils/cookie";
import { HTTP_STATUS } from "../../../config/http.config";
import { prisma } from "../../../config/prismaClient";
import { hashValue } from "../../../utils/bcrypt";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);

  const user = await registerService(body);

  const userId = user.id as unknown as string;

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const hashedToken = await hashValue(refreshToken, 10);

  await prisma.userActivity.upsert({
    where: {
      userId: userId,
    },
    update: {
      token: hashedToken,
      userAgent: String(req.headers["user-agent"]),
      ip: req.ip,
    },
    create: {
      userId,
      token: hashedToken,
      userAgent: String(req.headers["user-agent"]),
      ip: req.ip,
    },
  });

  // Exclude sensitive fields from response
  const { password: _password, id: _id, ...userWithoutSensitiveData } = user;

  return setJwtAuthCookie({ res, accessToken, refreshToken }).status(HTTP_STATUS.CREATED).json({
    message: "User created successfully!",
    user: userWithoutSensitiveData,
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);

  const user = await loginService(body);

  const userId = user.id as unknown as string;

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const hashedToken = await hashValue(refreshToken, 10);

  await prisma.userActivity.upsert({
    where: {
      userId: userId,
    },
    update: {
      token: hashedToken,
      userAgent: String(req.headers["user-agent"]),
      ip: req.ip,
    },
    create: {
      userId,
      token: hashedToken,
      userAgent: String(req.headers["user-agent"]),
      ip: req.ip,
    },
  });

  // Exclude sensitive fields from response
  const { password: _password, id: _id, ...userWithoutSensitiveData } = user;

  return setJwtAuthCookie({ res, accessToken, refreshToken }).status(HTTP_STATUS.OK).json({
    message: "User logged-in successfully!",
    user: userWithoutSensitiveData,
  });
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  // console.log(req.user)

  const token = req.cookies?.accessToken;
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Unauthorized user! Cannot log-out." });
  }

  if (!token) {
    return res.status(HTTP_STATUS.OK).json({ message: "Already logged out" });
  }

  await prisma.userActivity.delete({
    where: {
      userId,
    },
  });

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  return res.status(HTTP_STATUS.OK).json({
    message: "User logged-out successfully",
  });
});

export const authStatusController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: "User not authenticated",
    });
  }

  // Exclude sensitive fields from response
  const { password: _password, id: _id, ...userWithoutSensitiveData } = req.user;

  return res.status(HTTP_STATUS.OK).json({
    message: "Authenticated user",
    user: userWithoutSensitiveData,
  });
});

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  console.log("user data: ", {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  if (!refreshToken) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "No refresh token!" });
  }

  const { newAccessToken, newRefreshToken } = await refreshTokenService(String(refreshToken));

  return setJwtAuthCookie({ res, accessToken: newAccessToken, refreshToken: newRefreshToken })
    .status(HTTP_STATUS.OK)
    .json({
      message: "Token refreshed successfully!",
    });
});
