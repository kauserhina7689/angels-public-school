"use server";

import { formatDateLocal } from "@/lib/utils";
import { connectDB } from "@/server/DB";
import { Session } from "@/server/DB/models/session";
import mongoose from "mongoose";

export async function getSessions() {
  try {
    await connectDB();
    const sessions = (
      await Session.find().select("name startDate endDate")
    ).map(({ _id, name, startDate, endDate }) => ({
      _id: (_id as mongoose.Types.ObjectId).toString(),
      name,
      startDate: formatDateLocal(startDate),
      endDate: formatDateLocal(endDate),
    }));
    return {
      sessions,
      message: sessions.length
        ? "Sessions retrieved successfully."
        : "No sessions found.",
      error: sessions.length <= 0,
    };
  } catch (error) {
    console.error("Error fetching sessions:", error);

    return {
      sessions: [],
      message: "Failed to fetch sessions.",
      error: true,
    };
  }
}
