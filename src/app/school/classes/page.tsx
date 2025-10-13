import ClassesPage from "@/components/school/pages/Class.page";
import { getClasses } from "@/server/actions/school/getClasses";
import React from "react";

async function ClassesPageServer() {
  const classes = await getClasses();

  return <ClassesPage classes={classes} />;
}

export default ClassesPageServer;
