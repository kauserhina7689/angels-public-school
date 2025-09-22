import AttendancePage from "@/components/school/pages/AttendancePage";
import { getAttendanceByDay } from "@/server/actions/school/attendance";
import { getPopulatedClasses } from "@/server/actions/school/getClasses";
export interface FilteredStudentType {
  _id: string;
  class_id: string;
  name: string;
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: number;
  adhaarNumber: number;
  serialNumber: number;
  rollnumber: string;
  image_url: string;
  image_public_id: string;
}
async function AttendancePageServer({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const populatedClasses = await getPopulatedClasses();
  const studentsByClass = populatedClasses!.reduce((acc, cls) => {
    acc[cls.class_name] = cls.students;
    return acc;
  }, {} as Record<string, FilteredStudentType[]>);
  const { date } = await searchParams;
  const attendance = (await getAttendanceByDay(date)) || [];
  return (
    <AttendancePage
      attendance={attendance}
      studentsByClass={studentsByClass}
      date={date}
    ></AttendancePage>
  );
}

export default AttendancePageServer;
