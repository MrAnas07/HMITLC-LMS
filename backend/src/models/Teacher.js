import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    cnic: { type: String, required: true, unique: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    assignedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null
    },
    batchName: { type: String, default: "N/A", trim: true },
    joiningDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

teacherSchema.index({ user: 1 });
teacherSchema.index({ cnic: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
