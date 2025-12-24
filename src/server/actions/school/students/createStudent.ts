"use server";

import { StudentFormData } from "@/components/school/modals/addStudentForm";
import { deleteFromCloudinary, uploadCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/server/DB";
import { ClassModel } from "@/server/DB/models/Class";
import { StudentModel } from "@/server/DB/models/student";
import { hashPassword } from "@/server/utils/password";
import mongoose from "mongoose";
import { getCurrentSession } from "../session";
import deleteStudentFromClass from "./deleteStudentFromClass";
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
export async function createOrUpdateStudent(
  student: StudentFormData & { oldClassId: string }
): Promise<createStudentReturnType> {
  //*init database session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await connectDB();
    await StudentModel.init();

    if (student._id == "new") return createStudent(student);
    return updateStudent(student);
    // eslint-disable-next-line
  } catch (error: any) {
    await session.abortTransaction();
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
  } finally {
    session.endSession();
  }
}

async function createStudent({
  class_id,
  rollnumber,
  _id,
  ...student
}: StudentFormData): Promise<createStudentReturnType> {
  try {
    await connectDB();
    console.log("creating student ", _id);
    const { public_id, secure_url } = await uploadCloudinary(
      student.file as File
    );
    const currentSession = await getCurrentSession();
    console.log({ student, rollnumber, currentSession, class_id });

    const password = await hashPassword(
      `${student.adhaarNumber + student.serialNumber}`
    );
    const newStudent = await StudentModel.create({
      ...student,
      password,
      image_public_id: public_id,
      image_url: secure_url,
      classes: [
        {
          class_id: new mongoose.Types.ObjectId(class_id),
          session_id: new mongoose.Types.ObjectId(currentSession),
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

async function updateStudent({
  class_id,
  oldClassId,
  rollnumber,
  _id,
  ...student
}: StudentFormData & {
  oldClassId: string;
}): Promise<createStudentReturnType> {
  //*init database session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await connectDB();
    await StudentModel.init();
    const {
      address,
      adhaarNumber,
      bloodGroup,
      dob,
      fatherName,
      file,
      mobileNumber,
      motherName,
      name,
      serialNumber,
    } = student;
    const { public_id, secure_url } =
      file instanceof File
        ? await uploadCloudinary(student.file as File)
        : { public_id: file.image_public_id, secure_url: file.image_url };

    const oldStudent = await StudentModel.findByIdAndUpdate(
      _id,
      {
        address,
        adhaarNumber,
        bloodGroup,
        dob,
        fatherName,
        mobileNumber,
        motherName,
        name,
        serialNumber,
      },
      { session, new: true, runValidators: true }
    );

    if (!oldStudent)
      return {
        success: false,
        message: "Failed to update student",
        errors: [],
      };
    if (file instanceof File) {
      await deleteFromCloudinary(oldStudent?.image_public_id);
    }
    oldStudent.image_public_id = public_id;
    oldStudent.image_url = secure_url;
    const CurrentSession = (await getCurrentSession())!;
    if (class_id == oldClassId) {
      //*If new class_id=== old class then just update roll number of the class
      console.log("Class not changed over riding roll number if updated");
      oldStudent.classes = oldStudent.classes.map((c) => {
        if ((c.class_id as mongoose.Types.ObjectId).toString() == class_id)
          return { ...c, rollnumber: rollnumber.toString() };
        return c;
      });
      await oldStudent.save({ session });
      await session.commitTransaction();
    } else {
      // *Add new class
      oldStudent.classes.push({
        class_id: new mongoose.Types.ObjectId(class_id),
        session_id: new mongoose.Types.ObjectId(CurrentSession), // if session is string
        rollnumber: rollnumber.toString(),
      });
      console.table(oldStudent.classes);

      //* Add to new class
      const newClass = await ClassModel.findById(class_id);
      if (!newClass)
        return {
          success: false,
          errors: [],
          message: "New class does not exist",
        };
      newClass.students.push(new mongoose.Types.ObjectId(oldStudent._id));
      newClass.save({ session });
      await oldStudent.save({ session });
      await session.commitTransaction();
      console.log("deleting from old class");

      //* Delete student from old class
      await deleteStudentFromClass({
        classId: oldClassId,
        studentId: _id,
        deleteIfEmptyClass: false,
      });
      console.log("removed from old class");
    }

    return { success: true, message: "Updated student successfully" };
    // eslint-disable-next-line
  } catch (error: any) {
    await session.abortTransaction();
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
  } finally {
    session.endSession();
  }
}
