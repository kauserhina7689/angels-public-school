import ClassesPage from "@/components/school/pages/Class.page";
import { getSessions } from "@/server/actions/admin/getdata";
import { getClasses } from "@/server/actions/school/getClasses";
import { redirect } from "next/navigation";
import React from "react";

async function ClassesPageServer() {
  const sessions = await getSessions();

  if (sessions.sessions.length == 0)
    redirect("/school/sessions?message=Please create a session first");
  const classes = await getClasses();

  return <ClassesPage classes={classes} />;
}

export default ClassesPageServer;
