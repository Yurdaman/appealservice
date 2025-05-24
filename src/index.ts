import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import appealRouter from "./routes/appeal.route";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", appealRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервис запущен на http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Ошибка подключения к БД:", error);
    process.exit(1);
  });
