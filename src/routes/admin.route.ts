import { Router } from "express";
import userRoutes from "../modules/user/routes/user.route";
import companyRoutes from "../modules/company/routes/company.route";
import { validateSessionMiddleware } from "../modules/auth/middleware/validateSession.middleware";
import { passportAuthenticateJwt } from "../config/passport.config";

const adminRouter = Router();

// runs on every admin route
adminRouter.use(validateSessionMiddleware);
adminRouter.use(passportAuthenticateJwt);

adminRouter.use("/users", userRoutes);
adminRouter.use("/companies", companyRoutes);

export default adminRouter;
