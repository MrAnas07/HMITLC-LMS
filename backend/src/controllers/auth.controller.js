import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import User from "../models/User.js";
import { TeacherToken } from "../models/TeacherToken.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  skills: user.skills
});

export const registerRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["student", "teacher"]).withMessage("Invalid role"),
  body("teacherCode").optional().trim()
];

export const loginRules = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "student", teacherCode } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "An account with this email already exists");

  if (role === "teacher") {
    if (!teacherCode) {
      throw new ApiError(400, "Teacher Verification Code is required!");
    }

    const dbToken = await TeacherToken.findOne({ 
      tokenCode: teacherCode.toUpperCase().trim(), 
      isUsed: false 
    });

    if (!dbToken) {
      throw new ApiError(401, "Invalid or Expired Token! You cannot create a teacher account.");
    }

    dbToken.isUsed = true;
    dbToken.usedByEmail = email.toLowerCase();
    await dbToken.save();
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  res.status(201).json({ token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@hmitlc.edu.pk") {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      console.log("Admin missing during login request! Seeding now...");
      const hashedPassword = await bcrypt.hash("AnasAdmin2026!", 10);
      await User.create({
        name: "Muhammad Anas",
        email: "admin@hmitlc.edu.pk",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Master Admin successfully seeded on the fly!");
    }
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user._id);
  res.json({ token, user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
