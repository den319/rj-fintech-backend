import { Router } from "express";
import adminRouter from "./admin.route";
import commonRouter from "./common.route";

const router = Router();

router.use(commonRouter);
router.use("/admin", adminRouter);

export default router;
