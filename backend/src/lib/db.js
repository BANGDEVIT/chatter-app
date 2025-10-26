import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URL } = ENV;
    if (!MONGO_URL) throw new Error("MONGO_URL is not set");
    const conn = await mongoose.connect(ENV.MONGO_URL);
    console.log("MONGO CONNECTED");
  } catch (error) {
    console.log("Error connection to MONGODB");
    process.exit(1);
  }
};
