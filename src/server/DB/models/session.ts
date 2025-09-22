import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  name: string; // e.g. "2024-25"
  startDate: Date;
  endDate: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{4}-\d{2}$/, "Session name must be in format YYYY-YY"],
    },
    startDate: {
      type: Date,
      required: true,
      set: (val: unknown) => new Date(val as string), // ensures casting from string
    },
    endDate: {
      type: Date,
      required: true,
      set: (val: unknown) => new Date(val as string),
      validate: {
        validator: function (this: ISession, value: Date) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
  },
  {
    timestamps: true,
    strict: "throw", // disallow unknown fields
  }
);

export const Session =
  mongoose.models?.Session ||
  mongoose.model<ISession>("Session", sessionSchema);
