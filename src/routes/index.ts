import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.route";
import userRoutes from "../modules/user/routes/user.route";
import companyRoutes from "../modules/company/routes/company.route";

const router= Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/companies", companyRoutes)


export default router
