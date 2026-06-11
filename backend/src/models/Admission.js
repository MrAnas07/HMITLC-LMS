import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selectedCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    fullName: { type: String, required: true, trim: true },
    profilePicture: { type: String, trim: true },
    fatherName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^03[0-9]{9}$/,
      minlength: 11,
      maxlength: 11
    },
    fatherPhone: {
      type: String,
      required: true,
      trim: true,
      match: /^03[0-9]{9}$/,
      minlength: 11,
      maxlength: 11
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      match: /^[0-9]{13}$/,
      minlength: 13,
      maxlength: 13
    },
    fatherCnic: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{13}$/,
      minlength: 13,
      maxlength: 13
    },
    address: { type: String, required: true, trim: true, minlength: 10, maxlength: 220 },
    computerProficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true
    },
    lastQualification: {
      type: String,
      enum: ["Matric", "Intermediate", "Graduate", "Other"],
      required: true
    },
    referralSource: {
      type: String,
      enum: ["Facebook", "Instagram", "Friend", "Google", "Other"],
      required: true
    },
    hasLaptop: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Graduated"],
      default: "Pending"
    },
    decisionNote: { type: String, trim: true, maxlength: 600 },
    rejectionReason: { type: String, default: "", trim: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    // Student ID and scheduling fields
    studentId: { type: String, unique: true, sparse: true, index: true },
    classTiming: { type: String, trim: true },
    classDays: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }],
    batchName: { type: String, trim: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date
  },
  { timestamps: true }
);

admissionSchema.index({ student: 1, status: 1 });
admissionSchema.index({ email: 1, createdAt: -1 });
admissionSchema.index({ status: 1, createdAt: -1 });
admissionSchema.index({ selectedCourse: 1, status: 1 });

export default mongoose.model("Admission", admissionSchema);
