import { Router } from "express";
import { authenticate } from "../middlewares/authentication.middleware.js";
import { getUserReportsSummaryController } from "../controllers/reports.controller.js";
import { getUserReportByCategoryController } from "../controllers/reports.controller.js";
import { getUserReportTrendController } from "../controllers/reports.controller.js";

const router = Router();

router.use(authenticate)
router.get("/user/summary", getUserReportsSummaryController);
router.get("/user/by-category", getUserReportByCategoryController);
router.get("/user/trend", getUserReportTrendController);

export default router;