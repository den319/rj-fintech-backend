import { Router } from "express";
import { validateSessionMiddleware } from "../../../auth";
import { getAllCompaniesController } from "../controllers/company.controller";

const companyRoutes = Router().post("/all", validateSessionMiddleware, getAllCompaniesController);

export default companyRoutes;
