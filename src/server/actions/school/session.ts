"use server";

import { connectDB } from "@/server/DB";
import { Session } from "@/server/DB/models/session";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export interface SessionType {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export async function saveSession(session: SessionType) {
  try {
    await connectDB();

    if (session._id === "new") {
      // Create new
      const newSession = await Session.create({
        name: session.name,
        startDate: new Date(session.startDate),
        endDate: new Date(session.endDate),
      });

      return {
        session: {
          _id: (newSession._id as mongoose.Types.ObjectId).toString(),
          name: newSession.name,
          startDate: session.startDate,
          endDate: session.endDate,
        },
        message: "Session created successfully.",
        error: false,
      };
    } else {
      // Update existing
      const updated = await Session.findByIdAndUpdate(
        session._id,
        {
          name: session.name,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
        { new: true }
      );

      if (!updated) {
        return { session: null, message: "Session not found.", error: true };
      }

      return {
        session: {
          _id: session._id,
          name: updated.name,
          startDate: updated.startDate,
          endDate: updated.endDate,
        },
        message: "Session updated successfully.",
        error: false,
      };
    }
  } catch (error) {
    console.error("Error saving session:", error);
    return { session: null, message: "Failed to save session.", error: true };
  }
}
export async function setCurrentSession(_id: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("session", _id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    return true;
  } catch (error) {
    console.log({ error });

    return false;
  }
}
export async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    return session;
  } catch (error) {
    console.log({ error });
    return undefined;
  }
}
