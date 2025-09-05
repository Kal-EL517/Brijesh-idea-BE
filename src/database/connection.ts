import mongoose from "mongoose";

// const MONGO_URI = "mongodb://localhost:27017/myapp"; // change this to your db

export const connectDB = async (): Promise<void> => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
