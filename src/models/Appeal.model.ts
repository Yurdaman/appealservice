import { model, Schema, Document } from "mongoose";

export interface IAppeal extends Document {
  topic: string;
  text: string;
  status: "новое" | "в работе" | "завершено" | "отменено";
  resolution?: string;
  cancellationReason?: string;
  takenAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const AppealSchema = new Schema<IAppeal>({
  topic: { type: String, required: true },
  text: { type: String, required: true },
  status: {
    type: String,
    enum: ["новое", "в работе", "завершено", "отменено"],
    default: "новое",
  },
  resolution: { type: String },
  cancellationReason: { type: String },
  takenAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const AppealModel = model<IAppeal>("Appeal", AppealSchema);
