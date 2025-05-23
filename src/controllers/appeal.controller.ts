import { Request, Response } from "express";
import { AppealModel, IAppeal } from "../models/Appeal.model";

// 1. Создать обращение
export const createAppeal = async (req: Request, res: Response) => {
  try {
    const { topic, text } = req.body;

    if (!topic || !text) {
      return res.status(400).json({ error: "topic и text обязательны" });
    }

    const appeal = new AppealModel({ topic, text });
    await appeal.save();
    return res.status(201).json(appeal);
  } catch (error) {
    return res.status(500).json({ error: "Ошибка при создании обращения" });
  }
};

// 2. Взять обращение в работу
export const takeAppeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appeal = await AppealModel.findById(id);
    if (!appeal) return res.status(404).json({ error: "Обращение не найдено" });

    if (appeal.status !== "новое") {
      return res
        .status(400)
        .json({ error: "Только новые обращения можно брать в работу" });
    }

    appeal.status = "в работе";
    appeal.takenAt = new Date();
    await appeal.save();
    return res.json(appeal);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Ошибка при взятии обращения в работу" });
  }
};

// 3. Завершить обращение
export const completeAppeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const appeal = await AppealModel.findById(id);
    if (!appeal) return res.status(404).json({ error: "Обращение не найдено" });

    if (appeal.status !== "в работе") {
      return res
        .status(400)
        .json({ error: 'Завершить можно только обращения "в работе"' });
    }

    appeal.status = "завершено";
    appeal.resolution = resolution;
    appeal.completedAt = new Date();
    await appeal.save();
    return res.json(appeal);
  } catch (error) {
    return res.status(500).json({ error: "Ошибка при завершении обращения" });
  }
};

// 4. Отменить обращение
export const cancelAppeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appeal = await AppealModel.findById(id);
    if (!appeal) return res.status(404).json({ error: "Обращение не найдено" });

    if (appeal.status === "завершено") {
      return res
        .status(400)
        .json({ error: "Нельзя отменить уже завершённое обращение" });
    }

    appeal.status = "отменено";
    appeal.cancellationReason = reason;
    await appeal.save();
    return res.json(appeal);
  } catch (error) {
    return res.status(500).json({ error: "Ошибка при отмене обращения" });
  }
};

// 5. Получить список с фильтрацией по дате
export const getAppeals = async (req: Request, res: Response) => {
  try {
    const { date, startDate, endDate } = req.query;

    let filter: any = {};

    if (date) {
      const targetDate = new Date(date as string);
      filter.createdAt = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const appeals = await AppealModel.find(filter);
    return res.json(appeals);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Ошибка при получении списка обращений" });
  }
};

// 6. Отменить все обращения "в работе"
export const bulkCancelInWork = async (req: Request, res: Response) => {
  try {
    await AppealModel.updateMany(
      { status: { $in: ["новое", "в работе"] } },
      { $set: { status: "отменено", cancellationReason: "Массовая отмена" } }
    );

    return res.json({
      message: 'Все обращения "новое", "в работе" были отменены',
    });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка при массовой отмене" });
  }
};
