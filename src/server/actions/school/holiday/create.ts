"use server";
import { connectDB } from "@/server/DB";
// Adjust to your session logic
import { Types } from "mongoose";
import { getCurrentSession } from "../session";
import { HolidayModel } from "@/server/DB/models/holiday";
import { HolidayFormData } from "@/components/school/modals/addHolidayDialog";
import { HolidayType } from "@/lib/types";

interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  errors: { field: string; message: string }[];
  data?: T;
}

/**
 * Create or update a holiday
 */
export async function createHoliday(
  data: HolidayFormData
): Promise<ActionResponse<HolidayType>> {
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

    const holidayDate = new Date(data.date);

    // Check if updating existing holiday
    if (data._id && data._id !== "new") {
      const existingHoliday = await HolidayModel.findOne({
        _id: data._id,
        session_id: session,
      });

      if (!existingHoliday) {
        return {
          success: false,
          message: "Holiday not found",
          errors: [{ field: "general", message: "Holiday not found" }],
        };
      }

      // Check for duplicate date (excluding current holiday)
      const duplicateDate = await HolidayModel.findOne({
        date: holidayDate,
        session_id: session,
        _id: { $ne: data._id },
      });

      if (duplicateDate) {
        return {
          success: false,
          message: "A holiday already exists for this date",
          errors: [
            {
              field: "date",
              message: "A holiday already exists for this date",
            },
          ],
        };
      }

      // Update holiday
      existingHoliday.title = data.title.trim();
      existingHoliday.date = holidayDate;
      existingHoliday.description = data.description?.trim() || "";
      existingHoliday.duration = data.duration;

      await existingHoliday.save();

      return {
        success: true,
        message: "Holiday updated successfully",
        errors: [],
        data: {
          _id: (existingHoliday._id as Types.ObjectId).toString(),
          date: new Date(existingHoliday.date),
          title: existingHoliday.title,
          description: existingHoliday.description!,
          session_id: session,
          duration: existingHoliday.duration,
        },
      };
    }

    // Check for duplicate date for new holiday
    const duplicateDate = await HolidayModel.findOne({
      date: holidayDate,
      session_id: session,
    });

    if (duplicateDate) {
      return {
        success: false,
        message: "A holiday already exists for this date",
        errors: [
          {
            field: "date",
            message: "A holiday already exists for this date",
          },
        ],
      };
    }

    // Create new holiday
    const newHoliday = await HolidayModel.create({
      title: data.title.trim(),
      date: holidayDate,
      description: data.description?.trim() || "",
      session_id: session,
      duration: data.duration,
    });

    return {
      success: true,
      message: "Holiday created successfully",
      errors: [],
      data: {
        _id: (newHoliday._id as Types.ObjectId).toString(),
        date: new Date(newHoliday.date),
        title: newHoliday.title,
        description: newHoliday.description!,
        session_id: session,
        duration: newHoliday.duration,
      },
    };
  } catch (error: any) {
    console.error("Error creating/updating holiday:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return {
        success: false,
        message: "A holiday already exists for this date",
        errors: [
          {
            field: "date",
            message: "A holiday already exists for this date",
          },
        ],
      };
    }

    return {
      success: false,
      message: "Failed to save holiday",
      errors: [{ field: "general", message: String(error) }],
    };
  }
}
