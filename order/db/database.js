import mongoose from "mongoose";
import { asyncHandler } from "../utility/asynHandler.js";

const connectDB = async (req, res) => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };
