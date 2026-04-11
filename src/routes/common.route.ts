import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.route";
import { validateSessionMiddleware } from "../modules/auth";
import orgStructureRoutes from "../modules/company-settings/orgStructure/routes/orgStructure.route";

const commonRouter = Router();

commonRouter.use("/auth", authRoutes);
commonRouter.use("/company-settings", validateSessionMiddleware, orgStructureRoutes);

export default commonRouter;
