import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UnauthorizedException } from "../utils/appError";
import { Env } from "./env.config";
import { RequestHandler } from "express";
import { prisma } from "./prismaClient";

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.accessToken || null]),
			secretOrKey: Env.JWT_SECRET,
			audience: ["user"],
			algorithms: ["HS256"],
			passReqToCallback: true,
		},
		async(req, payload, done) => {
				await prisma.userMaster.findUnique({
					where: { id: payload.userId },
				})
				.then((user) => {
					if (!user) {
						return done(new UnauthorizedException("User not found"), false);
					}
					return done(null, user);
				})
				.catch((error) => done(error, false));
		}
	)
);

export const passportAuthenticateJwt: RequestHandler = passport.authenticate("jwt", {
	session: false,
});
