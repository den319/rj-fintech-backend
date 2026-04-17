import { Router } from "express";
import { validateSessionMiddleware } from "../../../auth";
import {
	getAllRoles,
	getAllUsersController,
} from "../controllers/user.controller";

const userRoutes = Router()
	.post("/all-users", validateSessionMiddleware, getAllUsersController)
	.post("/all-roles", validateSessionMiddleware, getAllRoles)

export default userRoutes;
