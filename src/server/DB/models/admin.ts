import { admintype } from "@/lib/types";
import { Document, model, Model, models, Schema } from "mongoose";

interface adminDocument extends admintype, Document {
  password: string;
}

const adminSchema = new Schema<adminDocument>({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  password: { type: String, required: true },
});

export const adminModel: Model<adminDocument> =
  models.admin || model("admin", adminSchema);
