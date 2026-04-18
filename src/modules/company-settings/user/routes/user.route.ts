import { Router } from "express";
import { validateSessionMiddleware } from "../../../auth";
import {
	getAllRolesController,
	getAllUsersController,
} from "../controllers/user.controller";

const userRoutes = Router()
	.post("/all-users", validateSessionMiddleware, getAllUsersController)
	.post("/all-roles", validateSessionMiddleware, getAllRolesController)

export default userRoutes;
