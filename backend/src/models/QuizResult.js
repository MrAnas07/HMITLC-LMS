import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", required: true },
    studentId: { type: String, required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    cheatingAttempts: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

quizResultSchema.index({ studentId: 1, quiz: 1 });
quizResultSchema.index({ quiz: 1, percentage: -1 });

export const QuizResult = mongoose.model("QuizResult", quizResultSchema);
