import { Router } from "express";
import {
	authStatusController,
	loginController,
	logoutController,
	registerController,
} from "../controllers/auth.controller";
import { validateSessionMiddleware } from "../middleware/validateSession.middleware";

const authRoutes = Router()
	.post("/register", registerController)
	.post("/login", loginController)
	.post("/logout", validateSessionMiddleware, logoutController)
	.get("/status", authStatusController);

export default authRoutes;
