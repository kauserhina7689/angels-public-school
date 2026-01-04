import { studentType } from "@/lib/types";
import { Document, Model, Schema, Types, model, models } from "mongoose";
import { ClassDocument } from "./Class";
import { ISession } from "./session";

export interface StudentDocument extends studentType, Document {
  password: string;
  classes: {
    class_id: Types.ObjectId;
    session_id: Types.ObjectId;
    rollnumber: string;
  }[];
}
export interface PopulatedStudent extends Omit<StudentDocument, "classes"> {
  classes: {
    class_id: Pick<ClassDocument, "_id" | "class_name">;
    session_id: Pick<ISession, "_id" | "name">;
    rollnumber: string;
  }[];
}
const StudentSchema = new Schema<StudentDocument>(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    adhaarNumber: { type: Number, required: true, unique: true },
    serialNumber: { type: Number, required: true, unique: true },
    classes: [
      {
        class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
        session_id: {
          type: Schema.Types.ObjectId,
          ref: "Session",
          required: true,
        },

        rollnumber: { type: String, required: true },
      },
    ],
    password: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"],
      required: true,
    },
    dob: { type: Date },
    image_url: {
      type: String,
      required: [true, "Video URL is required"],
    },
    image_public_id: {
      type: String,
      required: [true, "Video URL is required"],
    },
  },
  { timestamps: true }
);

StudentSchema.index({ name: 1 });
StudentSchema.index(
  { "classes.class_id": 1, "classes.rollnumber": 1 },
  { unique: true }
);
export const StudentModel: Model<StudentDocument> =
  models?.Student || model<StudentDocument>("Student", StudentSchema);
