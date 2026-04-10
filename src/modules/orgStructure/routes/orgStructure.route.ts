import { Router } from "express";
import { validateSessionMiddleware } from "../../auth/middleware/validateSession.middleware";
import { getAllUsersController, getOrgStructureController } from "../controllers/orgStructure.controller";

const orgStructureRoutes = Router()
                                .post("/org", validateSessionMiddleware, getOrgStructureController)
                                .post("/all-users", validateSessionMiddleware, getAllUsersController)

export default orgStructureRoutes;
