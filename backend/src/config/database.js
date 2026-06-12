import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export const connectDatabase = async () => {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGODB_URI is required");
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(mongoUri).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
