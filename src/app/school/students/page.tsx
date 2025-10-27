import StudentsPage from "@/components/school/pages/studentsPage";
import { getSessions } from "@/server/actions/admin/getdata";
import { getPopulatedClasses } from "@/server/actions/school/getClasses";
import { redirect } from "next/navigation";

export default async function StudentsPageServer() {
  const sessions = await getSessions();

  if (sessions.sessions.length == 0)
    redirect("/school/sessions?message=Please create a session first");
  const classes = await getPopulatedClasses();
  if (classes.length == 0)
    redirect(
      "/school/classes?message=Please add classes to the current session"
    );
  return <StudentsPage classes={classes} />;
}
