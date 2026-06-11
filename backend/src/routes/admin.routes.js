import { Router } from "express";
import { body } from "express-validator";
import {
  getAllSystemUsers,
  updateSystemUserRole,
  getTeacherProfile,
  updateTeacherProfile,
  generateTeacherToken,
  getActiveTokens,
  getAllTokens,
  factoryReset
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllSystemUsers);

router.put(
  "/users/:id/role",
  [
    body("role")
      .isIn(["student", "teacher", "admin"])
      .withMessage("Role must be student, teacher, or admin"),
    validate
  ],
  updateSystemUserRole
);

router.get("/teachers/:id", getTeacherProfile);

router.put(
  "/teachers/:id",
  [
    body("phoneNumber").optional().trim(),
    body("cnic").optional().trim(),
    body("qualification").optional().trim(),
    body("assignedCourse").optional().isMongoId().withMessage("Invalid course ID"),
    body("batchName").optional().trim(),
    validate
  ],
  updateTeacherProfile
);

router.post("/generate-token", generateTeacherToken);
router.get("/active-tokens", getActiveTokens);
router.get("/all-tokens", getAllTokens);

router.post("/factory-reset", factoryReset);

export default router;
