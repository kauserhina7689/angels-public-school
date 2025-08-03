import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to database succesfully!!");
  } catch (error) {
    console.error("Error while connecting to database", error);
  }
}
