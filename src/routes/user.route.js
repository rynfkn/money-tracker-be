import { Router } from "express";
import { getAllUserController, getUserByIdController } from "../controllers/user.controller.js";
import { userLoginController } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUserController);
router.get("/:id", getUserByIdController);

router.post("/login", userLoginController);

export default router;