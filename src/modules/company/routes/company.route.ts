import { Router } from "express";
import { getAllCompanies } from "../controllers/company.controller";
import { passportAuthenticateJwt } from "../../../config/passport.config";

const companyRoutes = Router().post("/all", passportAuthenticateJwt, getAllCompanies);

export default companyRoutes;
