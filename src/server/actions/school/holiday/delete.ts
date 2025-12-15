"use server";
import { connectDB } from "@/server/DB";
// Adjust to your session logic
import { Types } from "mongoose";
import { getCurrentSession } from "../session";
import { HolidayModel } from "@/server/DB/models/holiday";

interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  errors: { field: string; message: string }[];
  data?: T;
}

/**
 * Delete a holiday
 */
export async function deleteHoliday(
  holidayId: string
): Promise<ActionResponse> {
  try {
    await connectDB();

    // Get current session
    const session = await getCurrentSession();
    if (!session) {
      return {
        success: false,
        message: "No active session found",
        errors: [],
      };
    }

    // Validate holidayId
    if (!Types.ObjectId.isValid(holidayId)) {
      return {
        success: false,
        message: "Invalid holiday ID",
        errors: [{ field: "general", message: "Invalid holiday ID" }],
      };
    }

    const deletedHoliday = await HolidayModel.findOneAndDelete({
      _id: holidayId,
      session_id: session,
    });

    if (!deletedHoliday) {
      return {
        success: false,
        message: "Holiday not found",
        errors: [{ field: "general", message: "Holiday not found" }],
      };
    }

    return {
      success: true,
      message: "Holiday deleted successfully",
      errors: [],
    };
  } catch (error) {
    console.error("Error deleting holiday:", error);
    return {
      success: false,
      message: "Failed to delete holiday",
      errors: [{ field: "general", message: String(error) }],
    };
  }
}
