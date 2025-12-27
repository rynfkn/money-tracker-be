import { Router } from "express";
import healthRoute from "./health.route.js"
import userRoute from "./user.route.js"
import walletRoute from "./wallet.route.js"
import categoriesRoute from "./categories.route.js"
import transactionRoute from "./transaction.route.js"
import reportsRoute from "./reports.route.js"

const router = Router();

router.use("/health", healthRoute);

router.use("/users", userRoute);

router.use("/wallet", walletRoute);

router.use("/categories", categoriesRoute);

router.use("/transactions", transactionRoute);

router.use("/reports", reportsRoute);

export default router;
