import { asssignmentType } from "@/lib/types";
import { Document, model, Model, models, Schema, Types } from "mongoose";
interface AssignmentDocument
  extends Omit<asssignmentType, "assignments" | "class_id" | "session_id">,
    Document {
  class_id: Types.ObjectId;
  session_id: Types.ObjectId;
  assignments: {
    subject: string;
    title: string;
    description: string;
    file: {
      image_public_id: string;
      image_url: string;
    };
  }[];
}

const AssignmentSchema = new Schema<AssignmentDocument>({
  date: Date,
  class_id: { type: Schema.Types.ObjectId, ref: "Class" },
  session_id: {
    type: Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  assignments: [
    {
      subject: String,
      title: String,
      description: String,
      file: {
        image_url: {
          type: String,
        },
        image_public_id: {
          type: String,
        },
      },
    },
  ],
});

export const AssignmentModel: Model<AssignmentDocument> =
  models.Assignment ||
  model<AssignmentDocument>("Assignment", AssignmentSchema);
