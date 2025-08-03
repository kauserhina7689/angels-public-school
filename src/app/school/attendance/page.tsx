import AttendancePage from "@/components/school/pages/AttendancePage";
import { getAttendanceByDay } from "@/server/actions/admin/attendance";
import { getAllStudents } from "@/server/actions/admin/students";

async function AttendancePageServer({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const students = await getAllStudents();
  const studentsByClass = students!.reduce((acc, student) => {
    if (!acc[student.class_name]) acc[student.class_name] = [];
    acc[student.class_name]!.push(student);
    return acc;
  }, {} as Record<string, typeof students>);
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
