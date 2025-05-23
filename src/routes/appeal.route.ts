import express from "express";
import {
  createAppeal,
  takeAppeal,
  completeAppeal,
  cancelAppeal,
  getAppeals,
  bulkCancelInWork,
} from "../controllers/appeal.controller";

const router = express.Router();

router.post("/appeals", createAppeal); // 1. Создать обращение
router.put("/appeals/:id/take", takeAppeal); // 2. Взять в работу
router.put("/appeals/:id/complete", completeAppeal); // 3. Завершить
router.put("/appeals/:id/cancel", cancelAppeal); // 4. Отменить
router.get("/appeals", getAppeals); // 5. Получить список с фильтрацией
router.put("/appeals/bulk-cancel", bulkCancelInWork); // 6. Отменить все

export default router;
