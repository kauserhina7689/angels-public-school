import { marksType } from "@/lib/types";
import { Schema, model, models, Document, Types } from "mongoose";

export interface MarksDocument extends marksType, Document {
  student_id: Types.ObjectId;
  class_id: Types.ObjectId;
}

const MarksSchema = new Schema<MarksDocument>({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  class_id: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject_id: {
    type: String,
    required: true,
    trim: true,
  },
  max: {
    type: Number,
    required: true,
    min: 0,
  },
  obtained: {
    type: Number,
    required: true,
    min: 0,
  },
  examType: {
    type: String,
    required: true,
    enum: ["unitTest1", "unitTest2", "halfYearlyExam", "annualFinal"],
    trim: true,
  },
  absent: {
    type: Boolean,
    default: false,
  },
});

MarksSchema.index(
  { examType: 1, student_id: 1, class_id: 1, subject_id: 1 },
  { unique: true }
);

export const MarksModel =
  models.Marks || model<MarksDocument>("Marks", MarksSchema);
