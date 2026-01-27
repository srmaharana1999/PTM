import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongoose connection established with MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log("Mongoose connection disconnected with MongoDB!");
}
