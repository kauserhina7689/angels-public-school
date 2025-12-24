"use server";
import { HolidayFormData } from "@/components/school/modals/addHolidayDialog";
import { getCurrentSession } from "../session";
import { Session } from "@/server/DB/models/session";

function getAllSundays(startDate: Date, endDate: Date): HolidayFormData[] {
  const result: HolidayFormData[] = [];

  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current.getDay() !== 0) {
    current.setDate(current.getDate() + 1);
  }

  // Collect all Sundays
  while (current <= end) {
    result.push({
      date: current.toISOString().split("T")[0], // YYYY-MM-DD
      title: "Sunday",
      _id: crypto.randomUUID(),
      description: "Weekly Sunday",
      duration: 1,
    });

    current.setDate(current.getDate() + 7);
  }

  return result;
}

export async function markSundaysForHolidayForCurrentSession() {
  try {
    const session = await getCurrentSession();
    console.log({ session });
    if (!session) return;

    const currentSession = await Session.findById(session);
    console.log({ currentSession });
    const sundays = await getAllSundays(
      currentSession.startDate,
      currentSession.endDate
    );
    console.log({ sundays: sundays.length });
  } catch (error) {
    console.log({ error });
  }
}
