"use server";

import { connectDB } from "@/server/DB";
import { ClassStudentRelation } from "@/server/DB/models/relationships/classStudentModel";
import { StudentModel } from "@/server/DB/models/student";

export async function migrateStudentModel() {
  try {
    await connectDB();

    // clean existing data
    await ClassStudentRelation.deleteMany({});
    await ClassStudentRelation.syncIndexes();

    const students = await StudentModel.find().select("classes name");

    console.log(`Migrating data of ${students.length} students`);

    for (const s of students) {
      if (!Array.isArray(s.classes)) continue;

      try {
        await ClassStudentRelation.insertMany(
          s.classes.map((c) => ({
            student_id: s._id,
            class_id: c.class_id,
            session_id: c.session_id,
            rollnumber: c.rollnumber,
          })),
          {
            ordered: false, // skip duplicates instead of failing
          },
        );
      } catch (err: any) {
        console.log("failed for student ", { s }, err);

        // ignore duplicate key errors
        if (err.code !== 11000) {
          throw err;
        }
      }
    }

    console.log(await ClassStudentRelation.countDocuments());

    return "migrated sucessfully";
  } catch (error: any) {
    console.error("MIGRATION ERROR:", error);
    return error.message;
  }
}
