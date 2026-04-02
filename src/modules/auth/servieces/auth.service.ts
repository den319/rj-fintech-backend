import jwt from "jsonwebtoken";
import {
  UnauthorizedException,
  NotFoundException,
} from "../../../utils/appError";
import {
  RegisterSchemaType,
  LoginSchemaType,
} from "../validators/auth.validator";
import { prisma } from "../../../config/prismaClient";
import { compareHash, hashValue } from "../../../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/cookie";
import { Env } from "../../../config/env.config";

interface JwtPayload {
  userId: string;
}

export const registerService = async (body: RegisterSchemaType) => {
  const { email, name, password } = body;

  // 1. Check existing user
  const existingUser = await prisma.userMaster.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new UnauthorizedException("User already exists!");
  }

  // 2. Hash password
  const hashedPassword = await hashValue(password, 10);

  // 3. Create user
  const newUser = await prisma.userMaster.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  // 1. Find user
  const user = await prisma.userMaster.findUnique({
    where: { email },
  });

  if (!user || user.deletedAt) {
    throw new NotFoundException("User not found!");
  }

  // 2. Compare password
  const isValid = await compareHash(password, user.password);

  if (!isValid) {
    throw new UnauthorizedException("Invalid email or password!");
  }

  return user;
};

export const refreshTokenService = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, Env.JWT_REFRESH_SECRET) as JwtPayload;

  if(!payload) {
    throw new UnauthorizedException("Invalid token!")
  }

  const session = await prisma.userActivity.findUnique({
    where: { userId: payload.userId },
  });

  if (!session) {
    throw new UnauthorizedException("Session expired")
  }

  const isValid = await compareHash(refreshToken, session.token);

  if (!isValid) {
    console.error("TOKEN REUSE DETECTED for user:", payload.userId);

    // CRITICAL ACTION: destroy session
    await prisma.userActivity.delete({
      where: { userId: payload.userId },
    });

    throw new UnauthorizedException("Invalid token")

  }

  // TOKEN ROTATION (VERY IMPORTANT)
  const newAccessToken = generateAccessToken(payload.userId);
  const newRefreshToken = generateRefreshToken(payload.userId);

  const newHashedToken = await hashValue(newRefreshToken, 10);

  await prisma.userActivity.update({
    where: { userId: payload.userId },
    data: {
      token: newHashedToken,
    },
  });

  return {newAccessToken, newRefreshToken};
};
