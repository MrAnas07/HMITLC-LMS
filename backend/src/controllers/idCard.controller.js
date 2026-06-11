import { query } from "express-validator";
import Admission from "../models/Admission.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const idCardRules = [
  query("cnic")
    .trim()
    .matches(/^[0-9]{13}$/)
    .withMessage("CNIC must be exactly 13 digits")
];

export const getIdCard = asyncHandler(async (req, res) => {
  const { cnic } = req.query;

  if (!cnic) {
    throw new ApiError(400, "CNIC is required");
  }

  const admission = await Admission.findOne({ cnic })
    .populate("selectedCourse", "title")
    .populate("assignedBy", "name");

  if (!admission) {
    throw new ApiError(404, "No student record found");
  }

  if (admission.status !== "Approved") {
    throw new ApiError(400, "Your admission is not approved yet");
  }

  // Return student data for ID card generation
  res.json({
    success: true,
    student: {
      fullName: admission.fullName,
      fatherName: admission.fatherName,
      cnic: admission.cnic,
      studentId: admission.studentId,
      courseName: admission.selectedCourse?.title || "General",
      batchName: admission.batchName,
      classTiming: admission.classTiming,
      classDays: admission.classDays,
      status: admission.status,
      approvedAt: admission.approvedAt,
      profilePicture: admission.profilePicture || ""
    }
  });
});