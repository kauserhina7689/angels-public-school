"use server";

import { MarksModel } from "@/server/DB/models/marks";

export async function getStudentResult({
  studentId,
  classId,
}: {
  studentId: string;
  classId: string;
}) {
  try {
    const marks = await MarksModel.find({
      student_id: studentId,
      class_id: classId,
    });
    console.log({ marks });
  } catch (error) {
    console.log(error);
  }
}
