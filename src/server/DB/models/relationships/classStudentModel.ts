import { Schema, model, models, Document, Types } from "mongoose";

export interface classStudentRelation extends Document {
  student_id: Types.ObjectId;
  class_id: Types.ObjectId;
  session_id: Types.ObjectId;
  rollnumber: number;
}

const ClassStudentRelationModel = new Schema<classStudentRelation>({
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
  session_id: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  rollnumber: { type: Number },
});

// ✅ Compound index for optimized queries & uniqueness constraint
ClassStudentRelationModel.index(
  { session_id: 1, student_id: 1, class_id: 1 },
  { unique: true }
);

export const ClassStudentRelation =
  models?.classStudentRelation ||
  model<classStudentRelation>(
    "classStudentRelation",
    ClassStudentRelationModel
  );
