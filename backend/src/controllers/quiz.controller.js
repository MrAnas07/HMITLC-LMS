import { Quiz } from "../models/Quiz.js";
import { QuizResult } from "../models/QuizResult.js";
import Course from "../models/Course.js";
import Admission from "../models/Admission.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNewQuiz = asyncHandler(async (req, res) => {
  const { title, quizKey, durationInMinutes, courseName, batchName, questions } = req.body;

  if (!title || !quizKey || !courseName || !questions?.length) {
    throw new ApiError(400, "Title, Quiz Key, Course, and at least one question are required.");
  }

  // SECURITY: Teachers can only create quizzes for courses they own
  if (req.user?.role === "teacher") {
    const ownedCourse = await Course.findOne({
      title: courseName,
      teacher: req.user._id
    });
    if (!ownedCourse) {
      throw new ApiError(403, "Access Denied: You can only create quizzes for your assigned courses.");
    }
  }

  const existingQuiz = await Quiz.findOne({ quizKey: quizKey.toUpperCase().trim() });
  if (existingQuiz) {
    throw new ApiError(409, "This Quiz Key already exists!");
  }

  const newQuiz = await Quiz.create({
    title,
    quizKey: quizKey.toUpperCase().trim(),
    durationInMinutes: durationInMinutes || 30,
    courseName,
    batchName: batchName || "BATCH 11",
    questions,
    createdBy: req.user?._id
  });

  res.status(201).json({
    success: true,
    message: "Quiz published successfully!",
    data: { quizId: newQuiz._id, title: newQuiz.title, totalQuestions: questions.length }
  });
});

export const verifyAndFetchQuiz = asyncHandler(async (req, res) => {
  const { studentName, cnic, studentId, courseName, quizKey } = req.body;

  if (!studentName || !studentId || !quizKey || !courseName) {
    throw new ApiError(400, "Student Name, Student ID, Course, and Quiz Key are required.");
  }

  // Find the course by title to get its ObjectId
  const course = await Course.findOne({ title: courseName });
  if (!course) {
    throw new ApiError(404, "Course not found in the system.");
  }

  // LAYER 1: Verify student exists with approved admission
  // System auto-fetches the batch admin assigned - student doesn't type it
  const verifiedStudent = await Admission.findOne({
    studentId: studentId.toUpperCase().trim(),
    fullName: studentName,
    cnic: cnic,
    selectedCourse: course._id,
    status: { $in: ["Approved", "Graduated"] }
  });

  if (!verifiedStudent) {
    throw new ApiError(400, "Verification Failed: Credentials mismatch or your admission is not approved yet!");
  }

  // LAYER 2: Auto-fetch the batch admin assigned to this student
  const officialAssignedBatch = verifiedStudent.batchName;

  if (!officialAssignedBatch) {
    throw new ApiError(400, "No batch assigned to your profile yet. Please contact admin.");
  }

  // LAYER 3: Find quiz matching the student's assigned batch
  // Teacher must have created quiz for this exact batch
  const quiz = await Quiz.findOne({
    quizKey: quizKey.toUpperCase().trim(),
    courseName,
    batchName: officialAssignedBatch,
    isActive: true
  });

  if (!quiz) {
    throw new ApiError(404, `No active quiz found for your batch (${officialAssignedBatch}) with this key.`);
  }

  // LAYER 4: Double attempt blocker
  const alreadyDone = await QuizResult.findOne({
    studentId: studentId.toUpperCase().trim(),
    quiz: quiz._id
  });
  if (alreadyDone) {
    throw new ApiError(400, "You have already taken this test!");
  }

  let shuffledQuestions = [...quiz.questions];
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  const secureQuestions = shuffledQuestions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options
  }));

  res.status(200).json({
    success: true,
    quizId: quiz._id,
    title: quiz.title,
    durationInMinutes: quiz.durationInMinutes,
    questions: secureQuestions,
    verifiedBatch: officialAssignedBatch
  });
});

export const submitQuizAnswers = asyncHandler(async (req, res) => {
  const { quizId, studentId, answers, cheatingCount } = req.body;

  if (!quizId || !studentId || !answers) {
    throw new ApiError(400, "Quiz ID, Student ID, and Answers are required.");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const student = await Admission.findOne({ studentId });
  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const alreadyDone = await QuizResult.findOne({ studentId, quiz: quizId });
  if (alreadyDone) {
    throw new ApiError(400, "You have already submitted this quiz.");
  }

  let finalScore = 0;
  quiz.questions.forEach((q) => {
    if (answers[q._id] !== undefined && answers[q._id] === q.correctOptionIndex) {
      finalScore++;
    }
  });

  const percentage = Math.round((finalScore / quiz.questions.length) * 100);

  const testResult = await QuizResult.create({
    student: student._id,
    studentId,
    quiz: quizId,
    score: finalScore,
    totalQuestions: quiz.questions.length,
    percentage,
    cheatingAttempts: cheatingCount || 0
  });

  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully!",
    score: finalScore,
    totalQuestions: quiz.questions.length,
    percentage,
    cheatingAttempts: cheatingCount || 0
  });
});

export const getQuizResults = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const results = await QuizResult.find({ quiz: quizId })
    .sort({ percentage: -1 })
    .populate("student", "name email");

  res.status(200).json({ success: true, data: results });
});

export const getStudentQuizHistory = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const results = await QuizResult.find({ studentId })
    .sort({ createdAt: -1 })
    .populate("quiz", "title courseName batchName");

  res.status(200).json({ success: true, data: results });
});

export const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ isActive: true })
    .sort({ createdAt: -1 })
    .select("-questions");

  res.status(200).json({ success: true, data: quizzes });
});

export const getStudentOwnResults = asyncHandler(async (req, res) => {
  const studentProfile = await Admission.findOne({ student: req.user._id });

  if (!studentProfile) {
    return res.status(200).json({ success: true, data: [] });
  }

  const results = await QuizResult.find({ studentId: studentProfile.studentId })
    .populate("quiz", "title courseName batchName")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: results.map((r) => ({
      _id: r._id,
      quizTitle: r.quiz?.title || "Deleted Exam",
      courseName: r.quiz?.courseName || "N/A",
      batchName: r.quiz?.batchName || "N/A",
      score: r.score,
      totalQuestions: r.totalQuestions,
      percentage: r.percentage,
      cheatingAttempts: r.cheatingAttempts,
      date: r.createdAt
    }))
  });
});

export const getAllQuizzesManaged = asyncHandler(async (req, res) => {
  let filter = {};

  // Teacher sees only their own quizzes, admin sees all
  if (req.user.role === "teacher") {
    filter.createdBy = req.user._id;
  }

  const quizzes = await Quiz.find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .select("-questions");

  res.status(200).json({ success: true, data: quizzes });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  // Only admin or the teacher who created it can edit
  if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to edit this quiz.");
  }

  const allowedUpdates = ["title", "quizKey", "durationInMinutes", "courseName", "batchName", "questions", "isActive"];
  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = key === "quizKey" ? req.body[key].toUpperCase().trim() : req.body[key];
    }
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: "Quiz updated successfully!",
    data: updatedQuiz
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  // Only admin or the teacher who created it can delete
  if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to delete this quiz.");
  }

  await Quiz.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully!"
  });
});

export const getSingleQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id).populate("createdBy", "name email");
  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  // Only admin or the teacher who created it can view
  if (quiz.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to view this quiz.");
  }

  res.status(200).json({ success: true, data: quiz });
});
