"use server";
import "@/server/DB/models/Class";
import { connectDB } from "@/server/DB";
import { ClassDocument } from "@/server/DB/models/Class";
import { PopulatedStudent, StudentModel } from "@/server/DB/models/student";
import { ObjectId } from "mongoose";
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
}

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
        class_id: (class_id._id as ObjectId).toString(),
        _id: (_id as ObjectId).toString(),
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
