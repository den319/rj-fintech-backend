import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UnauthorizedException } from "../utils/appError";
import { findByIdUserService } from "../modules/user/services/user.service";
import { Env } from "./env.config";
import { RequestHandler } from "express";

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.accessToken || null]),
			secretOrKey: Env.JWT_SECRET,
			audience: ["user"],
			algorithms: ["HS256"],
			passReqToCallback: true,
		},
		(req, payload, done) => {
			findByIdUserService(payload.userId as string)
				.then((user) => {
					if (!user || user.deletedAt) {
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
