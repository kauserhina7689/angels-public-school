"use server";
import { getISTMiddayDate } from "@/lib/utils";
import { AttendanceModel } from "@/server/DB/models/attendance";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ObjectId, Types } from "mongoose";

interface BulkAttendanceInput {
  student_id: string;
  class_id: string;
}
interface AttendanceByDayType {
  student_id: ObjectId;
  class_id: ObjectId;
  date: Date;
}

/**
 * Adds multiple attendance records only if not already present (by student_id + class_id + date)
 */
export async function addAttendanceAction(
  absentStudents: BulkAttendanceInput[],
  presentStudents: BulkAttendanceInput[],
  date?: string
) {
  const istDate = getISTMiddayDate(date);

  const existing = await AttendanceModel.find({
    date: istDate,
    student_id: { $in: absentStudents.map((r) => r.student_id) },
    class_id: { $in: absentStudents.map((r) => r.class_id) },
  }).select("student_id class_id");

  const existingSet = new Set(
    existing.map((doc) => `${doc.student_id}-${doc.class_id}`)
  );

  const filteredDocs = absentStudents
    .filter(
      ({ student_id, class_id }) =>
        !existingSet.has(`${student_id}-${class_id}`)
    )
    .map(({ student_id, class_id }) => ({
      student_id: new Types.ObjectId(student_id),
      class_id: new Types.ObjectId(class_id),
      date: new Date(istDate),
    }));

  try {
    await AttendanceModel.deleteMany({
      date: istDate,
      student_id: {
        $in: presentStudents.map((s) => new Types.ObjectId(s.student_id)),
      },
      class_id: {
        $in: presentStudents.map((s) => new Types.ObjectId(s.class_id)),
      },
    });
    if (filteredDocs.length === 0) {
      console.log("No new attendance to insert. All already marked.");
      return {
        status: true,
        message: "No new attendance. All already marked.",
      };
    }
    await AttendanceModel.insertMany(filteredDocs);
    console.log(`${filteredDocs.length} attendance records inserted.`);
    return {
      status: true,
      message: `Marked ${filteredDocs.length} students absent.`,
    };
  } catch (error) {
    console.error("Insert failed:", error);
    return {
      status: false,
      message: `Something went wrong please try again`,
    };
  }
}

export async function getAttendanceByDay(date?: string) {
  try {
    const attendance: AttendanceByDayType[] = await AttendanceModel.find({
      date: getISTMiddayDate(date),
    }).select("student_id class_id date");
    // console.log({ attendance });
    return attendance.map(({ class_id, date, student_id }) => ({
      class_id: class_id.toString(),
      student_id: student_id.toString(),
      date: date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getMonthlyAttendance(date?: string) {
  try {
    // If date provided → parse it, else use current date
    const baseDate = date ? parseISO(date) : new Date();

    const start = startOfMonth(baseDate);
    const end = endOfMonth(baseDate);

    const attendance = await AttendanceModel.find({
      date: { $gte: start, $lte: end },
    }).select("student_id class_id date");

    return attendance.map(({ class_id, student_id, date }) => ({
      class_id: class_id.toString(),
      student_id: student_id.toString(),
      date: date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
