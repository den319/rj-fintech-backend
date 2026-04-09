import { Router } from "express";
import { getAllCompanies } from "../controllers/company.controller";
import { validateSessionMiddleware } from "../../auth/middleware/validateSession.middleware";

const companyRoutes = Router().post("/all", validateSessionMiddleware, getAllCompanies);

export default companyRoutes;
