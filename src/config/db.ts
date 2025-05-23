import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/appeals_db";
    await mongoose.connect(uri);
    console.log("Подключились к MongoDB");
  } catch (error) {
    console.error("Ошибка подключения к MongoDB:", error);
    process.exit(1);
  }
};
