"use server";

import { studentResultType } from "@/lib/types";
import { examMaxMarks } from "@/lib/utils";
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
    // /asdasdsa
    await connectDB();

    const currentClass = await ClassModel.findById(class_id);
    if (!currentClass) throw new Error("No class found with id " + class_id);

    const relations = await ClassStudentRelation.find({ class_id }).populate(
      "student_id",
      "name motherName fatherName serialNumber address mobileNumber bloodGroup dob image_url",
    );

    const { class_name, subjects } = currentClass;

    const result = await Promise.all(
      relations.map(async (r) => {
        // eslint-disable-next-line
        const student = r.student_id as any;

        const {
          name,
          motherName,
          fatherName,
          serialNumber,
          _id,
          address,
          mobileNumber,
          bloodGroup,
          dob,
          image_url,
        } = student;

        // get rollnumber from relation
        const { rollnumber } = r;

        const subjectMarks: Record<
          string,
          {
            subject_name: string;
            exam: Record<string, { max: number; obtained: number }>;
          }
        > = {};

        for (const subject of subjects) {
          const marks = await MarksModel.find({
            class_id,
            student_id: _id,
            subject_id: subject._id,
          });

          const mark: Record<string, { max: number; obtained: number }> = {};

          for (const m of marks) {
            mark[m.examType] = {
              max: examMaxMarks[m.examType],
              obtained: m.obtained,
            };
          }

          subjectMarks[subject._id!.toString()] = {
            subject_name: subject.name,
            exam: mark,
          };
        }

        return {
          name,
          motherName,
          fatherName,
          serialNumber,
          _id: (_id as Types.ObjectId).toString(),
          class_name,

          // ✅ Added fields (no structure change)
          address,
          mobileNumber,
          bloodGroup,
          dob,
          image_url,
          rollnumber,

          subjectMarks,
        };
      }),
    );

    return {
      success: true,
      message: "Fetched tabulation successfully",
      data: result,
    };
    // eslint-disable-next-line
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}
