import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("ℹ️  No MONGODB_URI found in .env — using Persistent Campus JSON Engine with automatic disk sync.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log("🍃 MongoDB Atlas Connected Successfully!");
    return true;
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed, falling back to Persistent Campus DB Engine:", error.message);
    isMongoConnected = false;
    return false;
  }
};

export const getIsMongoConnected = () => isMongoConnected;
