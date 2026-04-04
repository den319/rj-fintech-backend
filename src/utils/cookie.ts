import jwt from "jsonwebtoken";
import { Env } from "../config/env.config";
import { Response } from "express";

type Time = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;
type Cookie = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

// export const generateJwtToken = (userId: string) => {
//   return jwt.sign(
//     { userId },
//     Env.JWT_SECRET,
//     {
//       audience: ["user"],
//       expiresIn: Env.JWT_EXPIRES_IN as Time ?? "7d",
//     }
//   );
// };

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, Env.JWT_SECRET, {
    expiresIn: (Env.JWT_EXPIRES_IN as Time) ?? "15m",
    audience: ["user"],
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, Env.JWT_REFRESH_SECRET, {
    expiresIn: (Env.JWT_REFRESH_EXPIRES_IN as Time) ?? "7d",
    audience: ["user"],
  });
};

export const setJwtAuthCookie = ({ res, accessToken, refreshToken }: Cookie) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
  });

  return res;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, Env.JWT_SECRET) as { userId: string };
};

export const clearJwtAuthCookie = (res: Response) => {
  return res.clearCookie("accessToken", { path: "/" });
};
