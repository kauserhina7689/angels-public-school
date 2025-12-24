"use server";
import { connectDB } from "@/server/DB";
// Adjust to your session logic
import { Types } from "mongoose";
import { getCurrentSession } from "../session";
import { HolidayModel } from "@/server/DB/models/holiday";
import { HolidayType } from "@/lib/types";

interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  errors: { field: string; message: string }[];
  data?: T;
}

/**
 * Get all holidays for the current session
 */
export async function getHolidays(): Promise<ActionResponse<HolidayType[]>> {
  try {
    await connectDB();
    const session = await getCurrentSession();
    if (!session) {
      return {
        success: false,
        message: "No active session found",
        errors: [],
      };
    }

    const holidays = await HolidayModel.find({
      session_id: session,
    })
      .sort({ date: 1 })
      .lean()
      .exec();
    const formattedHolidays = holidays.map((holiday) => ({
      _id: (holiday._id as Types.ObjectId).toString(),
      date: new Date(holiday.date),
      title: holiday.title,
      description: holiday.description || "",
      session_id: holiday.session_id.toString(),
      duration: holiday.duration,
    }));

    return {
      success: true,
      message: "Holidays fetched successfully",
      errors: [],
      data: formattedHolidays,
    };
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return {
      success: false,
      message: "Failed to fetch holidays",
      errors: [{ field: "general", message: String(error) }],
    };
  }
}
/**
 * Get holidays for a specific date range
 */
export async function getHolidaysByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ActionResponse<HolidayType[]>> {
  try {
    await connectDB();

    const session = await getCurrentSession();
    if (!session) {
      return {
        success: false,
        message: "No active session found",
        errors: [],
      };
    }

    const holidays = await HolidayModel.find({
      session_id: session,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ date: 1 })
      .lean()
      .exec();

    const formattedHolidays = holidays.map((holiday) => ({
      _id: (holiday._id as Types.ObjectId).toString(),
      date: new Date(holiday.date),
      title: holiday.title,
      description: holiday.description || "",
      session_id: holiday.session_id.toString(),
      duration: holiday.duration,
    }));

    return {
      success: true,
      message: "Holidays fetched successfully",
      errors: [],
      data: formattedHolidays,
    };
  } catch (error) {
    console.error("Error fetching holidays by date range:", error);
    return {
      success: false,
      message: "Failed to fetch holidays",
      errors: [{ field: "general", message: String(error) }],
    };
  }
}
