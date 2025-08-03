import { ClassType } from "@/lib/types";
import { Document, Model, Schema, model, models } from "mongoose";

export interface ClassDocument extends ClassType, Document {}

const ClassSchema = new Schema<ClassDocument>(
  {
    class_name: { type: String, required: true },
    batch: { type: Number, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    index: { type: Number, required: true },
  },
  { timestamps: true }
);

// Optional compound index for quick lookup by standard and batch
ClassSchema.index({ index: 1, batch: 1 });
export const ClassModel: Model<ClassDocument> =
  models?.Class || model<ClassDocument>("Class", ClassSchema);
