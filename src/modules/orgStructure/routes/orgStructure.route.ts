import { Router } from "express";
import { validateSessionMiddleware } from "../../auth/middleware/validateSession.middleware";
import { getOrgStructureController } from "../controllers/orgStructure.controller";

const orgStructureRoutes = Router().post("/org", validateSessionMiddleware, getOrgStructureController);

export default orgStructureRoutes;
