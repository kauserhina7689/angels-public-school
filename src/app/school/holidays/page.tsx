import HolidaysPage from "@/components/school/pages/Holiday.page";
import { getHolidays } from "@/server/actions/school/holiday/get";
import React from "react";

async function HolidaysPageServer() {
  const holidays = await getHolidays();
  return <HolidaysPage holidays={holidays.data || []} />;
}

export default HolidaysPageServer;
