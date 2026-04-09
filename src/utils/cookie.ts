import jwt from "jsonwebtoken";
import { Env } from "../config/env.config";
import { Response } from "express";

type Time = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;
type Cookie = {
	res: Response;
	accessToken: string;
	refreshToken:string;
	version:string;
};

type AccessToken= {
	res: Response;
	accessToken: string;
}

export const generateAccessToken = (userId: string) => {
	return jwt.sign({ userId }, Env.JWT_SECRET, {
		expiresIn: (Env.JWT_EXPIRES_IN as Time) ?? "15m",
		audience: ["user"],
	});
};

export const setJwtAuthCookie = ({ res, accessToken, refreshToken, version }: Cookie) => {
	res.cookie("accessToken", accessToken, {
		maxAge: 15 * 60 * 1000, // 15 minutes
		httpOnly: true,
		secure: Env.NODE_ENV === "production",
		sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
	});

	res.cookie("refreshToken", refreshToken, {
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		httpOnly: true,
		secure: Env.NODE_ENV === "production",
		sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
	})

	res.cookie("version", version, {
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		httpOnly: true,
		secure: Env.NODE_ENV === "production",
		sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
	})

	return res;
};

export const setAccessToken = ({ res, accessToken }: AccessToken) => {
	res.cookie("accessToken", accessToken, {
		maxAge: 15 * 60 * 1000, // 15 minutes
		httpOnly: true,
		secure: Env.NODE_ENV === "production",
		sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
	});
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, Env.JWT_SECRET) as { userId: string };
};

export const removeAuthCookies= (res: Response): void => {
  	res.clearCookie("accessToken", { path: "/" });
	res.clearCookie("refreshToken", { path: "/" });
	res.clearCookie("version", { path: "/" });
}
