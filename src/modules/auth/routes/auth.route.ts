import { Router } from "express";
import {
	loginController,
	logoutController,
	registerController,
} from "../controllers/auth.controller";
import { passportAuthenticateJwt } from "../../../config/passport.config";
import { validateSessionMiddleware } from "../middleware/validateSession.middleware";

const authRoutes = Router()
	.post("/register", registerController)
	.post("/login", loginController)
	.post("/logout", validateSessionMiddleware, passportAuthenticateJwt, logoutController)

export default authRoutes;
