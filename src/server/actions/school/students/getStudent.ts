"use server";

import { ClassModel } from "@/server/DB/models/Class";
import { Session } from "@/server/DB/models/session";
import { PopulatedStudent, StudentModel } from "@/server/DB/models/student";
import mongoose, { Types } from "mongoose";

export async function getStudentWithId(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(id);

      console.log("invalid student id");
      throw new Error("Invalid student id");
    }
    await ClassModel.init();
    await Session.init();

    const student = await StudentModel.findById(
      id,
      "-__v -createdAt -updatedAt -classes._id"
    )
      .populate({
        path: "classes.session_id",
        select: "name -_id",
      })
      .populate({
        path: "classes.class_id",
        select: "class_name -_id",
      })
      .lean<PopulatedStudent>();
    if (!student) throw new Error("Student not found");
    console.log({
      student,
      classes: student.classes.map((c) => ({ ...c.class_id, ...c.session_id })),
    });

    return {
      message: "Fetched student successfully",
      title: "",
      student: { ...student, _id: (student._id as Types.ObjectId).toString() },
    };
  } catch (error: unknown) {
    return {
      student: null,
      message:
        (error as Error).message || "Something went wrong please try again",
    };
  }
}
