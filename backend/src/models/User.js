import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    },
    avatarUrl: String,
    bio: {
      type: String,
      maxlength: 500
    },
    skills: [String],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model("User", userSchema);
