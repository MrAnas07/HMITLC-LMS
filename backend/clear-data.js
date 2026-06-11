import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Teacher from "./src/models/Teacher.js";
import Admission from "./src/models/Admission.js";
import { Attendance } from "./src/models/Attendance.js";
import { Quiz } from "./src/models/Quiz.js";
import { QuizResult } from "./src/models/QuizResult.js";
import { TeacherToken } from "./src/models/TeacherToken.js";
import Course from "./src/models/Course.js";

dotenv.config();

const clearAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const results = await Promise.all([
      Admission.deleteMany({}),
      Attendance.deleteMany({}),
      Quiz.deleteMany({}),
      QuizResult.deleteMany({}),
      TeacherToken.deleteMany({}),
      Teacher.deleteMany({}),
      Course.deleteMany({}),
      User.deleteMany({ role: { $in: ["student", "teacher"] } })
    ]);

    console.log("Admissions deleted:", results[0].deletedCount);
    console.log("Attendance deleted:", results[1].deletedCount);
    console.log("Quizzes deleted:", results[2].deletedCount);
    console.log("Quiz Results deleted:", results[3].deletedCount);
    console.log("Teacher Tokens deleted:", results[4].deletedCount);
    console.log("Teachers deleted:", results[5].deletedCount);
    console.log("Courses deleted:", results[6].deletedCount);
    console.log("Users (students+teachers) deleted:", results[7].deletedCount);

    console.log("\nDatabase cleared successfully. Only admin accounts remain.");

    const adminCount = await User.countDocuments({ role: "admin" });
    console.log(`Admin accounts preserved: ${adminCount}`);

    await mongoose.disconnect();
    console.log("Done.");
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
};

clearAllData();
