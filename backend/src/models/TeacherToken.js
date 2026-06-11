import mongoose from "mongoose";

const teacherTokenSchema = new mongoose.Schema({
  tokenCode: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true 
  },
  isUsed: { 
    type: Boolean, 
    default: false 
  },
  usedByEmail: { 
    type: String, 
    default: null 
  },
  generatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: "7d" 
  }
});

export const TeacherToken = mongoose.model("TeacherToken", teacherTokenSchema);
