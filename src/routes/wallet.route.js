import { Router } from "express";
import { getUserWalletsController } from "../controllers/wallet.controller.js";
import { createUserWalletController } from "../controllers/wallet.controller.js";
import { updateUserWalletController } from "../controllers/wallet.controller.js";
import { deleteUserWalletController } from "../controllers/wallet.controller.js";

const router = Router();

router.get("/user/:id", getUserWalletsController);
router.post("/user/:id", createUserWalletController);
router.patch("/:id", updateUserWalletController);
router.delete("/:id", deleteUserWalletController);

export default router;