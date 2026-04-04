import { Router } from "express";
import userRoutes from "../modules/user/routes/user.route";
import companyRoutes from "../modules/company/routes/company.route";

const adminRouter = Router();

adminRouter.use("/users", userRoutes);
adminRouter.use("/companies", companyRoutes);

export default adminRouter;
