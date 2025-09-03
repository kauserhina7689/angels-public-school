import { studentType } from "@/lib/types";
import { Document, Model, Schema, model, models } from "mongoose";
import { ClassDocument } from "./Class";

interface StudentDocument extends studentType, Document {
  password: string;
}
export interface PopulatedStudent extends Omit<StudentDocument, "class_id"> {
  class_id: Pick<ClassDocument, "_id" | "class_name">;
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
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    rollnumber: { type: String, required: true },
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

// Add individual indexes
StudentSchema.index({ class_id: 1 });
StudentSchema.index({ name: 1 });
StudentSchema.index({ class_id: 1, rollnumber: 1 }, { unique: true });
export const StudentModel: Model<StudentDocument> =
  models.Student || model<StudentDocument>("Student", StudentSchema);
