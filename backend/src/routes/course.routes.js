import { Router } from "express";
import { body } from "express-validator";
import {
  addReview,
  courseRules,
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  listRules,
  updateCourse,
  updateCourseSeats,
  upsertLesson
} from "../controllers/course.controller.js";
import { authorize, protect, optionalProtect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const courseFiles = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "introVideo", maxCount: 1 },
  { name: "resources", maxCount: 10 }
]);

const lessonFiles = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "resource", maxCount: 1 }
]);

router.get("/", optionalProtect, listRules, validate, listCourses);
router.get("/:id", getCourse);
router.post("/", protect, authorize("teacher", "admin"), courseFiles, courseRules, validate, createCourse);
router.patch("/:id/seats", protect, authorize("admin"), updateCourseSeats);
router.patch("/:id", protect, authorize("teacher", "admin"), courseFiles, updateCourse);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteCourse);
router.post("/:id/lessons", protect, authorize("teacher", "admin"), lessonFiles, upsertLesson);
router.patch("/:id/lessons/:lessonId", protect, authorize("teacher", "admin"), lessonFiles, upsertLesson);
router.post(
  "/:id/reviews",
  protect,
  authorize("student"),
  [body("rating").isInt({ min: 1, max: 5 }), body("comment").optional().trim()],
  validate,
  addReview
);

export default router;
