import { attendanceType } from "@/lib/types";
import { Document, Model, model, models, Schema } from "mongoose";

export interface attendanceDocument extends attendanceType, Document {}

const AttendanceSchema = new Schema<attendanceDocument>({
  student_id: { type: Schema.Types.ObjectId, ref: "Student" },
  class_id: { type: Schema.Types.ObjectId, ref: "Class" },
  date: { type: Date },
});
AttendanceSchema.index(
  { student_id: 1, class_id: 1, date: 1 },
  { unique: true }
);

export const AttendanceModel: Model<attendanceDocument> =
  models.attendance ||
  model<attendanceDocument>("attendance", AttendanceSchema);
