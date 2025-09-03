"use server";
import "@/server/DB/models/Class";
import { connectDB } from "@/server/DB";
import { ClassDocument, ClassModel } from "@/server/DB/models/Class";
import { PopulatedStudent, StudentModel } from "@/server/DB/models/student";
import mongoose from "mongoose";
import { StudentFormData } from "@/components/school/modals/addStudentForm";
import { hashPassword } from "@/server/utils/password";
import { uploadCloudinary } from "@/lib/cloudinary";
import { classFormData } from "@/components/school/modals/addClass";
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
  rollnumber: "roll number",
  class_name: "class",
};

export async function getAllStudents(): Promise<FilteredStudentType[]> {
  try {
    await connectDB();
    const newstudents: PopulatedStudent[] = await StudentModel.find().populate<{
      class_id: Pick<ClassDocument, "_id" | "class_name">;
    }>({
      path: "class_id",
      select: "class_name _id",
    });

    const transFormedStudents: FilteredStudentType[] = newstudents.map((st) => {
      const { class_id, _id, password, __v, createdAt, updatedAt, ...rest } =
        st.toObject();
      return {
        ...class_id,
        class_id: (class_id._id as mongoose.Types.ObjectId).toString(),
        _id: (_id as mongoose.Types.ObjectId).toString(),
        ...rest,
      };
      console.log({
        password,
        __v,
        createdAt,
        updatedAt,
      });
    });
    return transFormedStudents;
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function getClasses() {
  try {
    const classes = await ClassModel.find().select(
      "-__v -createdAt -updatedAt"
    );
    return classes.map(({ students, _id, batch, index, class_name }) => ({
      batch,
      index,
      class_name,
      _id: (_id as mongoose.Types.ObjectId).toString(),
      students: (students as unknown as mongoose.Types.ObjectId[]).map((st) =>
        st.toString()
      ),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

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
export async function createStudent(
  student: StudentFormData
): Promise<createStudentReturnType> {
  try {
    console.log({ student });
    await connectDB();
    await StudentModel.init();
    const { public_id, secure_url } = await uploadCloudinary(student.file);
    const password = await hashPassword(student.adhaarNumber + student.dob);
    const newStudent = await StudentModel.create({
      ...student,
      password,
      image_public_id: public_id,
      image_url: secure_url,
    });
    const studentClass = await ClassModel.findById(student.class_id);
    await studentClass?.students.push(
      newStudent._id as mongoose.Types.ObjectId
    );
    await studentClass?.save();
    return { success: true, message: "Added student successfully" };
    // eslint-disable-next-line
  } catch (error: any) {
    if (error.code === 11000) {
      const errors = Object.entries(error.keyValue)
        .map(([field]) => {
          if (field == "class_id") return null;
          return {
            field,
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

export async function createClass(data: classFormData) {
  try {
    console.log({ data });
    await connectDB();
    await ClassModel.create(data);
    return { success: true, message: "Added student successfully", errors: [] };
    // eslint-disable-next-line
  } catch (error: any) {
    if (error.code === 11000) {
      const errors = Object.entries(error.keyValue)
        .map(([field]) => {
          if (field == "class_id") return null;
          return {
            field,
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
