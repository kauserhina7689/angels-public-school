import { ClassType } from "@/lib/types";
import { Document, Model, Schema, model, models } from "mongoose";

export interface ClassDocument extends ClassType, Document {}

const ClassSchema = new Schema<ClassDocument>(
  {
    class_name: { type: String, required: true, unique: true },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true, // ensure every class is linked to a session
    },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

// Optional compound index for quick lookup by standard and batch
ClassSchema.index({ session: 1 });
export const ClassModel: Model<ClassDocument> =
  models?.Class || model<ClassDocument>("Class", ClassSchema);
