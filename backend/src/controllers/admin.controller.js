import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Admission from "../models/Admission.js";
import { Attendance } from "../models/Attendance.js";
import { Quiz } from "../models/Quiz.js";
import { QuizResult } from "../models/QuizResult.js";
import { TeacherToken } from "../models/TeacherToken.js";
import Course from "../models/Course.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    const num = Math.floor(1000 + Math.random() * 9000);
    code = `HMITLC-TCH-${num}`;
    exists = await TeacherToken.findOne({ tokenCode: code });
  }
  return code;
};

export const generateTeacherToken = asyncHandler(async (req, res) => {
  const uniqueToken = await generateUniqueCode();

  const newToken = new TeacherToken({
    tokenCode: uniqueToken,
    generatedBy: req.user._id
  });

  await newToken.save();

  res.status(201).json({
    success: true,
    message: "Teacher verification code generated!",
    data: { tokenCode: uniqueToken }
  });
});

export const getActiveTokens = asyncHandler(async (req, res) => {
  const tokens = await TeacherToken.find({ isUsed: false })
    .sort({ createdAt: -1 })
    .populate("generatedBy", "name email");

  res.status(200).json({ success: true, data: tokens });
});

export const getAllTokens = asyncHandler(async (req, res) => {
  const tokens = await TeacherToken.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("generatedBy", "name email");

  res.status(200).json({ success: true, data: tokens });
});

export const getAllSystemUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("-password")
    .sort({ role: 1, name: 1 });

  res.status(200).json({ success: true, data: users });
});

export const updateSystemUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["student", "teacher", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be student, teacher, or admin.");
  }

  const targetUser = await User.findById(id);
  if (!targetUser) {
    throw new ApiError(404, "User not found.");
  }

  if (targetUser.role === "admin" && req.user._id.toString() === id) {
    throw new ApiError(400, "Cannot change your own admin role.");
  }

  const oldRole = targetUser.role;
  targetUser.role = role;
  await targetUser.save();

  if (role === "teacher" && oldRole !== "teacher") {
    const exists = await Teacher.findOne({ user: id });
    if (!exists) {
      await Teacher.create({
        user: id,
        fullName: targetUser.name,
        phoneNumber: "",
        cnic: "",
        qualification: "Not specified"
      });
    }
  }

  const updatedUser = await User.findById(id).select("-password");

  res.status(200).json({
    success: true,
    message: `${targetUser.name} role changed from ${oldRole} to ${role}.`,
    data: updatedUser
  });
});

export const getTeacherProfile = asyncHandler(async (req, res) => {
  const profile = await Teacher.findOne({ user: req.params.id })
    .populate("assignedCourse", "title");

  if (!profile) {
    return res.status(200).json({ success: true, data: null });
  }

  res.status(200).json({ success: true, data: profile });
});

export const updateTeacherProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { phoneNumber, cnic, qualification, assignedCourse, batchName } = req.body;

  const profile = await Teacher.findOne({ user: id });
  if (!profile) {
    throw new ApiError(404, "Teacher profile not found.");
  }

  if (phoneNumber !== undefined) profile.phoneNumber = phoneNumber;
  if (cnic !== undefined) profile.cnic = cnic;
  if (qualification !== undefined) profile.qualification = qualification;
  if (assignedCourse !== undefined) profile.assignedCourse = assignedCourse || null;
  if (batchName !== undefined) profile.batchName = batchName;

  await profile.save();

  res.status(200).json({ success: true, data: profile });
});

// FACTORY RESET - Wipe all data except admin
export const factoryReset = asyncHandler(async (req, res) => {
  const { masterSecurityKey } = req.body;

  const SYSTEM_WIPE_HASH = process.env.SYSTEM_RESET_SECRET || "HMITLC-ROOT-SYSTEM-RESET-2026";

  if (!masterSecurityKey || masterSecurityKey !== SYSTEM_WIPE_HASH) {
    return res.status(401).json({
      success: false,
      message: "SECURITY BREACH: Invalid Master Key. Database wipe denied!"
    });
  }

  await Promise.all([
    Admission.deleteMany({}),
    Attendance.deleteMany({}),
    Quiz.deleteMany({}),
    QuizResult.deleteMany({}),
    TeacherToken.deleteMany({}),
    Teacher.deleteMany({}),
    User.deleteMany({ role: { $in: ["student", "teacher"] } })
  ]);

  res.status(200).json({
    success: true,
    message: "System has been reset to factory settings. All data wiped clean."
  });
});
