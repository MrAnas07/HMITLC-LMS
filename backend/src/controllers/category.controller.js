import { body } from "express-validator";
import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const categoryRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Category name is required"),
  body("description").optional().trim(),
  body("icon").optional().trim()
];

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json({ category });
});
