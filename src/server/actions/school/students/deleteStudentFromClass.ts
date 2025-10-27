"use server";

import { ClassModel } from "@/server/DB/models/Class";
import { StudentModel } from "@/server/DB/models/student";
import mongoose, { Types } from "mongoose";
import { AttendanceModel } from "@/server/DB/models/attendance";
import { MarksModel } from "@/server/DB/models/marks";

export default async function deleteStudentFromClass({
  studentId,
  classId,
  deleteIfEmptyClass,
}: {
  studentId: string;
  classId: string;
  deleteIfEmptyClass: boolean;
}) {
  //*init database session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    console.log("get current sesssion");
    const student = await StudentModel.findById(studentId).session(session);
    if (!student) throw new Error("Student not found");
    const Class = await ClassModel.findById(classId).session(session);
    if (!Class) throw new Error("Class not found");
    console.log(Class.class_name, student.name);
    Class.students = Class.students.filter(
      (st) => st.toString() !== (student._id as Types.ObjectId).toString()
    );
    await MarksModel.deleteMany(
      {
        student_id: student._id,
        class_id: Class._id,
      },
      { session }
    );
    await AttendanceModel.deleteMany(
      {
        student_id: student._id,
        class_id: Class._id,
      },
      { session }
    );
    const isInClass = student.classes.some(
      (c) => c.class_id.toString() === (Class._id as Types.ObjectId).toString()
    );

    if (!isInClass) throw new Error("Student not in this class");
    student.classes = student.classes.filter(
      (c) => c.class_id.toString() !== (Class._id as Types.ObjectId).toString()
    );
    console.log(student.classes.length, Class._id);
    if (student.classes.length == 0 && deleteIfEmptyClass)
      await student.deleteOne({ session });
    else await student.save({ session });
    await Class.save({ session });
    await session.commitTransaction();
    return { success: true, message: "Student removed from class" };
    // eslint-disable-next-line
  } catch (err: any) {
    await session.abortTransaction();
    console.log("Error while removing student", err);
    return {
      success: false,
      message: err?.message || "Failed to remove student",
    };
  } finally {
    session.endSession();
  }
}
