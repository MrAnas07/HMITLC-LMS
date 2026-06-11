import { Router } from "express";
import {
  createNewQuiz,
  verifyAndFetchQuiz,
  submitQuizAnswers,
  getQuizResults,
  getStudentQuizHistory,
  getAllQuizzes,
  getStudentOwnResults,
  getAllQuizzesManaged,
  updateQuiz,
  deleteQuiz,
  getSingleQuiz
} from "../controllers/quiz.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/verify-key", verifyAndFetchQuiz);
router.post("/submit", submitQuizAnswers);
router.get("/list", getAllQuizzes);

router.use(protect);

router.get("/my-results", getStudentOwnResults);
router.post("/create", authorize("teacher", "admin"), createNewQuiz);
router.get("/managed", authorize("teacher", "admin"), getAllQuizzesManaged);
router.get("/details/:id", authorize("teacher", "admin"), getSingleQuiz);
router.put("/update/:id", authorize("teacher", "admin"), updateQuiz);
router.delete("/delete/:id", authorize("teacher", "admin"), deleteQuiz);
router.get("/results/:quizId", authorize("teacher", "admin"), getQuizResults);
router.get("/history/:studentId", getStudentQuizHistory);

export default router;
