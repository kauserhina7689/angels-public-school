import { getAllStudents } from "@/server/actions/admin/students";
import StudentsPage from "@/components/school/pages/studentsPage";

export default async function StudentsPageServer() {
  const students = await getAllStudents();
  return <StudentsPage students={students} />;
}
