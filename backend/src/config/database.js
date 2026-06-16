import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    console.log("Reusing existing database connection");
    return;
  }

  try {
    const connString = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!connString) throw new Error("MONGODB_URI or MONGO_URI is required");

    console.log("Connecting to MongoDB...");
    const db = await mongoose.connect(connString);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");

    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      console.log("Seeding Master Admin Account...");
      const hashedPassword = await bcrypt.hash("AnasAdmin2026!", 10);

      await User.create({
        name: "Muhammad Anas",
        email: "admin@hmitlc.edu.pk",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Master Admin created successfully!");
    } else {
      console.log("Master Admin already exists. Skipping seeding.");
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};
