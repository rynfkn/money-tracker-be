import { Router } from "express";
import healthRoute from "./health.route.js"
import userRoute from "./user.route.js"
import walletRoute from "./wallet.route.js"

const router = Router();

router.use("/health", healthRoute);

router.use("/users", userRoute);

router.use("/wallet", walletRoute);

export default router;
