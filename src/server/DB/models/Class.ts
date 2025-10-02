import { ClassType } from "@/lib/types";
import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface ClassDocument extends ClassType, Document {
  subjects: { name: string; _id?: Types.ObjectId }[];
}

const ClassSchema = new Schema<ClassDocument>(
  {
    class_name: { type: String, required: true },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    subjects: [
      {
        name: String,
      },
    ],
  },
  { timestamps: true }
);

// Optional compound index for quick lookup by standard and batch
ClassSchema.index({ session: 1, class_name: 1 }, { unique: true });
export const ClassModel: Model<ClassDocument> =
  models?.Class || model<ClassDocument>("Class", ClassSchema);
