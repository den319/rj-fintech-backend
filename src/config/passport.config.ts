import { RequestHandler } from "express";
import passport from "passport";
import { User } from "../modules/user/entity/user.entity";

export type JwtAuthInfo =
  | {
      name: "TokenExpiredError";
      message: string;
      expiredAt: Date;
    }
  | {
      name: "JsonWebTokenError";
      message: string;
    }
  | Error
  | undefined;

export const passportAuthenticateJwt: RequestHandler = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err:Error, user:User, info:JwtAuthInfo) => {
    if (info?.name === "TokenExpiredError") {
			
    }

    if (err || !user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};