import AssignmentsPage from "@/components/school/pages/Assignment.page";
import { getAssignments } from "@/server/actions/school/assignment/getAssignmentsServer";
import { getClasses } from "@/server/actions/school/getClasses";
import React from "react";

async function AssignmentPageServer() {
  const classes = await getClasses();
  const assignments = await getAssignments();
  console.log({ assignments });

  return <AssignmentsPage classes={classes} assignments={assignments} />;
}

export default AssignmentPageServer;
