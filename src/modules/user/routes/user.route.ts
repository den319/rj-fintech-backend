import { Router } from "express";
import { getUserByIdController } from "../controllers/user.controller";
import { validateUserId } from "../middleware/user.validation.middleware";

const userRoutes = Router()
	// .get("/all", getAllUsersController)
	.get("/:userId", validateUserId, getUserByIdController);

export default userRoutes;
