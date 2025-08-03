import { announcementsType } from "@/lib/types";
import { Document, Model, model, models, Schema } from "mongoose";

interface announcementDocument extends announcementsType, Document {}

const announcementsSchema = new Schema<announcementDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  attachment: { type: String },
});

export const AnnounementsModel: Model<announcementDocument> =
  models.announcements ||
  model<announcementDocument>("announcements", announcementsSchema);
