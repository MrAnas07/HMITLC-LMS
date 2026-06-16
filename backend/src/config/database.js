import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const seedMasterAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      console.log("Seeding Master Admin Account...");

      const hashedPassword = await bcrypt.hash("AnasAdmin2026!", 10);

      await User.create({
        name: "Admin",
        email: "admin@hmitlc.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Master Admin created successfully!");
    } else {
      console.log("Master Admin already exists. Skipping seeding.");
    }
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
  }
};

export const connectDatabase = async () => {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGODB_URI is required");
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(mongoUri).then((m) => {
      console.log("MongoDB connected");
      return m;
    });
  }

  cached.conn = await cached.promise;

  await seedMasterAdmin();

  return cached.conn;
};
