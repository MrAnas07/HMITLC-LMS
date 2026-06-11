import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    quizKey: { type: String, required: true, unique: true, uppercase: true, trim: true },
    durationInMinutes: { type: Number, required: true, default: 30 },
    courseName: { type: String, required: true },
    batchName: { type: String, required: true, default: "BATCH 11" },
    questions: [questionSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

quizSchema.index({ quizKey: 1 });
quizSchema.index({ courseName: 1, batchName: 1 });

export const Quiz = mongoose.model("Quiz", quizSchema);
