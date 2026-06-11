import { Router } from "express";
import {
  categoryRules,
  createCategory,
  listCategories,
  updateCategory
} from "../controllers/category.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/", listCategories);
router.post("/", protect, authorize("admin"), categoryRules, validate, createCategory);
router.patch("/:id", protect, authorize("admin"), categoryRules, validate, updateCategory);

export default router;
