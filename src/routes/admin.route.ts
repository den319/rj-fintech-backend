import { Router } from "express";
import companyRoutes from "../modules/company/routes/company.route";
import { validateSessionMiddleware } from "../modules/auth/middleware/validateSession.middleware";

const adminRouter = Router();

// runs on every admin route
adminRouter.use(validateSessionMiddleware);

// adminRouter.use("/users", userRoutes);
adminRouter.use("/companies", companyRoutes);

export default adminRouter;
