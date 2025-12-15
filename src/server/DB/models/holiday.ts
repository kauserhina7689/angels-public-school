import { HolidayType } from "@/lib/types";
import { Schema, model, Types, models } from "mongoose";
interface HolidayDocType extends Omit<HolidayType, "session_id"> {
  session_id: Schema.Types.ObjectId;
}
const HolidaySchema = new Schema<HolidayDocType>({
  date: {
    type: Date,
    required: true,
    index: true, // fast querying by date
  },

  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },

  description: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  duration: {
    type: Number,
    default: 1,
  },
  session_id: {
    type: Types.ObjectId,
    ref: "Session", // name of your session collection
    required: true,
  },
});

// Optional: Prevent duplicate date for same session
HolidaySchema.index({ date: 1, session_id: 1 }, { unique: true });

export const HolidayModel = models?.Holiday || model("Holiday", HolidaySchema);
