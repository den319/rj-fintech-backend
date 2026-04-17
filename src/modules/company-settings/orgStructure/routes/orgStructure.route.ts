import { Router } from "express";
import { validateSessionMiddleware } from "../../../auth";
import {
	getOrgStructureController,
} from "../controllers/orgStructure.controller";

const orgStructureRoutes = Router()
	.post("/org", validateSessionMiddleware, getOrgStructureController)

export default orgStructureRoutes;
