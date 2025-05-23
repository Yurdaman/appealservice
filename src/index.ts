import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import appealRouter from "./routes/appeal.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", appealRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Сервис запущен на http://localhost:${PORT}`);
  });
});
