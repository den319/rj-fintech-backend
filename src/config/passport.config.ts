import passport, { use } from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UnauthorizedException } from "../utils/appError";
import { findByIdUserService } from "../modules/user/services/user.service";
import { Env } from "./env.config";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.accessToken || null,
      ]),
      secretOrKey: Env.JWT_SECRET,
      audience: ["user"],
      algorithms: ["HS256"],
      passReqToCallback: true, // IMPORTANT
    },
    async (req, payload, done) => {
      try {

        // 1. Get user
        const user = await findByIdUserService(payload.userId);

        if (!user || user.deletedAt) {
          return done(new UnauthorizedException("User not found"), false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export const passportAuthenticateJwt= passport.authenticate('jwt', {
    session: false,
})