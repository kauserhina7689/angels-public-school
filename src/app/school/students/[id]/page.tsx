import StudentProfile from "@/components/school/pages/Student.info";
import { getStudentWithId } from "@/server/actions/school/students/getStudent";
import React from "react";

async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { student, message } = await getStudentWithId(id);

  if (!student) return <>{message}</>;
  return <StudentProfile student={student!}></StudentProfile>;
}

export default StudentPage;
