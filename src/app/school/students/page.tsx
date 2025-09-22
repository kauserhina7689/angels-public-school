import StudentsPage from "@/components/school/pages/studentsPage";
import { getPopulatedClasses } from "@/server/actions/school/getClasses";

export default async function StudentsPageServer() {
  const classes = await getPopulatedClasses();
  return <StudentsPage classes={classes} />;
}
