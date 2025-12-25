import { Router } from "express";
import { createCategoriesController } from "../controllers/categories.controller.js";
import { getCategoriesController } from "../controllers/categories.controller.js";
import { updateCategoriesController } from "../controllers/categories.controller.js";
import { deleteCategoriesController } from "../controllers/categories.controller.js";
import { authenticate } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createCategoriesController);
router.get("/", getCategoriesController);
router.patch("/:id", updateCategoriesController);
router.delete("/:id", deleteCategoriesController);

export default router;