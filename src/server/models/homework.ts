import { HomeworkType } from "@/lib/types";
import { Document, model, Model, models, Schema } from "mongoose";

interface asssignment {
  subject: string;
  title: string;
  description: string;
  attchment?: string;
}

interface HomeworkDocument extends HomeworkType, Document {}

const HomeworkSchema = new Schema<HomeworkDocument>({
  date: Date,
  class_id: { type: Schema.Types.ObjectId, ref: "Class" },
  assignments: [
    {
      subject: String,
      title: String,
      description: String,
      attchment: String,
    },
  ],
});

export const HomeworkModel: Model<HomeworkDocument> =
  models.homework || model<HomeworkDocument>("homework", HomeworkSchema);
