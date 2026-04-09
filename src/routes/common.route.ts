import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.route";
import orgStructureRoutes from "../modules/orgStructure/routes/orgStructure.route";
import { validateSessionMiddleware } from "../modules/auth/middleware/validateSession.middleware";

const commonRouter = Router();

commonRouter.use("/auth", authRoutes);
commonRouter.use("/company-settings", validateSessionMiddleware, orgStructureRoutes);


export default commonRouter;
