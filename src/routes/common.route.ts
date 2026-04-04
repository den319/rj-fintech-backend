import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.route";

const commonRouter = Router();

commonRouter.use("/auth", authRoutes);

export default commonRouter;