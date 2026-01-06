import { Router } from "express";
import { getAllUserController, getUserByIdController, getMeController } from "../controllers/user.controller.js";
import { userLoginController, userRegisterController } from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/authentication.middleware.js";

const router = Router();

router.get("/me", authenticate, getMeController);

router.get("/", authenticate, getAllUserController);
router.get("/:id", authenticate, getUserByIdController);

router.post("/login", userLoginController);
router.post("/register", userRegisterController);

export default router;