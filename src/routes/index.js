import { Router } from "express";
import healthRoute from "./health.route.js"
import userRoute from "./user.route.js"

const router = Router();

router.use("/health", healthRoute);

router.use("/users", userRoute);

export default router;
