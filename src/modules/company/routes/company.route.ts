import { Router } from "express";
import { getAllCompanies } from "../controllers/company.controller";
import { passportAuthenticateJwt } from "../../../config/passport.config";

const companyRoutes = Router().post("/", passportAuthenticateJwt, getAllCompanies);

export default companyRoutes;
