import { Router } from "express";
import { validateSessionMiddleware } from "../modules/auth/middleware/validateSession.middleware";
import companyRoutes from "../modules/admin/company/routes/company.route";

const adminRouter = Router();

// runs on every admin route
adminRouter.use(validateSessionMiddleware);

// adminRouter.use("/users", userRoutes);
adminRouter.use("/companies", companyRoutes);

export default adminRouter;
