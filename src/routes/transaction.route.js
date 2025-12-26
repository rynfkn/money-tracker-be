import { Router } from "express";
import { createUserTransactionController } from "../controllers/transaction.controller.js";
import { getUserTransactionController } from "../controllers/transaction.controller.js";
import { updateUserTransactionController } from "../controllers/transaction.controller.js";
import { deleteUserTransactionController } from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", createUserTransactionController);
router.get("/",  getUserTransactionController);
router.patch("/:id", updateUserTransactionController);
router.delete("/:id", deleteUserTransactionController);

export default router;