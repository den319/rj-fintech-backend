import { Router } from "express";
import { getAllCompaniesController } from "../controllers/company.controller";
import { validateSessionMiddleware } from "../../../auth/middleware/validateSession.middleware";

const companyRoutes = Router().post("/all", validateSessionMiddleware, getAllCompaniesController);

export default companyRoutes;
