"use server";

import { StudentFormData } from "@/components/school/modals/addStudentForm";
import { uploadCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/server/DB";
import { ClassModel } from "@/server/DB/models/Class";
import { StudentModel } from "@/server/DB/models/student";
import { hashPassword } from "@/server/utils/password";
import mongoose from "mongoose";
import { getCurrentSession } from "./session";
export interface FilteredStudentType {
  _id: string;
  class_name: string;
  class_id: string;
  name: string;
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: number;
  adhaarNumber: number;
  serialNumber: number;
  rollnumber: string;
  image_url: string;
  image_public_id: string;
}
const studentUniqueErrormap: Record<string, string> = {
  adhaarNumber: "aadhaar number",
  serialNumber: "serial number",
  "classes.rollnumber": "roll number",
  "classes.class_id": "class",
};

type createStudentReturnType =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors: {
        field: string;
        message: string;
      }[];
      message: string;
    };
export async function createStudent({
  class_id,
  rollnumber,
  ...student
}: StudentFormData): Promise<createStudentReturnType> {
  try {
    await connectDB();
    await StudentModel.init();
    const { public_id, secure_url } = await uploadCloudinary(student.file);
    const session = await getCurrentSession();
    console.log({ student, rollnumber, session, class_id });

    const password = await hashPassword(student.adhaarNumber + student.dob);
    const newStudent = await StudentModel.create({
      ...student,
      password,
      image_public_id: public_id,
      image_url: secure_url,
      classes: [
        {
          class_id: class_id,
          session_id: session,
          rollnumber: rollnumber,
        },
      ],
    });

    const studentClass = await ClassModel.findById(class_id);
    await studentClass?.students.push(
      newStudent._id as mongoose.Types.ObjectId
    );
    await studentClass?.save();
    return { success: true, message: "Added student successfully" };
    // eslint-disable-next-line
  } catch (error: any) {
    console.log({ studentRegisterErro: error });
    if (error.code === 11000) {
      const errors = Object.entries(error.keyValue)
        .map(([field]) => {
          if (field == "classes.class_id") return null;
          console.log(field);

          return {
            field: field.split(".").at(-1)!,
            message: `This ${studentUniqueErrormap[field]} is already registered`,
          };
        })
        .filter((val) => val !== null);
      console.log({ errors, o: error.keyValue });
      return { success: false, errors, message: "Student validation failed" };
    }
    return { success: false, message: "Some thing went wrong", errors: [] };
  }
}
