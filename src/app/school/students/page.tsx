import { getAllStudents, getClasses } from "@/server/actions/admin/students";
import StudentsPage from "@/components/school/pages/studentsPage";

export default async function StudentsPageServer() {
  const students = await getAllStudents();
  const classes = await getClasses();
  return <StudentsPage students={students} classes={classes} />;
}
