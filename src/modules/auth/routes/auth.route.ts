import { Router } from "express";
import {
	loginController,
	logoutController,
	registerController,
} from "../controllers/auth.controller";
import { validateSessionMiddleware } from "../middleware/validateSession.middleware";

const authRoutes = Router()
	.post("/register", registerController)
	.post("/login", loginController)
	.post("/logout", logoutController);

export default authRoutes;
