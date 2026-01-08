"use server";
import { connectDB } from "@/server/DB";
import { ClassStudentRelation } from "@/server/DB/models/relationships/classStudentModel";
import { StudentModel } from "@/server/DB/models/student";
import mongoose from "mongoose";

export async function migrateStudentModel() {
  const session = await mongoose.startSession();
  try {
    // await ClassStudentRelation.deleteMany();
    // return await ClassStudentRelation.collection.dropIndexes();

    await connectDB();
    session.startTransaction();
    // await StudentModel.deleteMany();
    // await ClassModel.deleteMany();
    await ClassStudentRelation.deleteMany({}, { session });
    await ClassStudentRelation.syncIndexes({ session });

    const students = await StudentModel.find()
      .select("classes name")
      .session(session);

    console.log(`Migrating data of ${students.length} students`);
    for (const s of students) {
      if (!Array.isArray(s.classes)) continue;

      console.log(
        await ClassStudentRelation.create(
          s.classes.map((c) => ({
            student_id: s._id,
            class_id: c.class_id,
            session_id: c.session_id,
            rollnumber: c.rollnumber,
          })),
          { session }
        )
      );
    }
    await session.commitTransaction();
    console.log(await ClassStudentRelation.countDocuments());
    // console.log({ migrations, l: migrations.length });
    return "migrated sucessfully";
    // eslint-disable-next-line
  } catch (error: any) {
    await session.abortTransaction();
    console.error("MIGRATION ERROR:", error);
    return error.message;
  } finally {
    await session.endSession();
  }
}
