"use server";

import { studentResultType } from "@/lib/types";
import { connectDB } from "@/server/DB";
import { ClassModel } from "@/server/DB/models/Class";
import { MarksModel } from "@/server/DB/models/marks";
import { ClassStudentRelation } from "@/server/DB/models/relationships/classStudentModel";
import { Types } from "mongoose";

export async function getTabulationByClassId(class_id: string): Promise<
  | {
      success: true;
      message: string;
      data: studentResultType[];
    }
  | {
      success: false;
      message: string;
      data: null;
    }
> {
  try {
    console.log({ class_id }, "Getting tabulation");
    await connectDB();
    const currentClass = await ClassModel.findById(class_id);
    if (!currentClass) throw new Error("No class found with id " + class_id);
    const relations = await ClassStudentRelation.find({ class_id }).populate(
      "student_id",
      "name motherName fatherName serialNumber"
    );
    const { class_name, subjects } = currentClass;
    const result = await Promise.all(
      relations.map(async (r) => {
        const { name, motherName, fatherName, serialNumber, _id } =
          r.student_id;
        const subjectMarks: Record<
          string,
          {
            subject_name: string;
            exam: Record<string, { max: number; obtained: number }>;
          }
        > = {};
        for (const subject of subjects) {
          // console.log(subject);
          const marks = await MarksModel.find({
            class_id,
            student_id: _id,
            subject_id: subject._id,
          });
          const mark: Record<string, { max: number; obtained: number }> = {};
          for (const m of marks) {
            mark[m.examType] = {
              max: m.max,
              obtained: m.obtained,
            };
          }
          subjectMarks[subject._id!.toString()] = {
            exam: mark,
            subject_name: subject.name,
          };
        }
        // const subjectMarks = subjects.map(s=>{
        //   const {name,_id} = s;
        //   const marks =await MarksModel.findOne({})
        //   return
        // });
        return {
          name,
          motherName,
          fatherName,
          serialNumber,
          _id: (_id as Types.ObjectId).toString(),
          class_name,
          subjectMarks,
        };
      })
    );
    return {
      success: true,
      message: "Fetched tabulation successfully",
      data: result,
    };
    // eslint-disable-next-line
  } catch (error: any) {
    console.log(error);

    return { success: false, message: error.message, data: null };
  }
}
