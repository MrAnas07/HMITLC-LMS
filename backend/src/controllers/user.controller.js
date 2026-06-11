import User from "../models/User.js";
import Course from "../models/Course.js";
import Admission from "../models/Admission.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});

export const dashboardStats = asyncHandler(async (req, res) => {
  if (req.user.role === "student") {
    const applications = await Admission.find({ student: req.user._id })
      .populate("selectedCourse", "title slug category price duration teacher")
      .sort({ createdAt: -1 });

    return res.json({ applications });
  }

  if (req.user.role === "teacher") {
    const userId = req.user._id.toString();
    const allCourses = await Course.find()
      .populate("teacher", "name email avatarUrl")
      .sort({ createdAt: -1 });
    const myCourses = allCourses.filter(
      (c) => c.teacher && c.teacher._id.toString() === userId
    );
    const myCourseIds = myCourses.map((course) => course._id);
    const admissions = await Admission.find({ selectedCourse: { $in: myCourseIds } })
      .populate("student", "name email")
      .populate("selectedCourse", "title category duration price")
      .sort({ createdAt: -1 });

    return res.json({ courses: allCourses, myCourses, admissions });
  }

  const [users, courses, admissions] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Admission.countDocuments()
  ]);

  const [pending, approved, rejected] = await Promise.all([
    Admission.countDocuments({ status: "Pending" }),
    Admission.countDocuments({ status: "Approved" }),
    Admission.countDocuments({ status: "Rejected" })
  ]);

  res.json({ users, courses, admissions, pending, approved, rejected });
});
