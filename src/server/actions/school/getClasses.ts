"use server";

import { connectDB } from "@/server/DB";
import { getCurrentSession } from "./session";
import { ClassModel } from "@/server/DB/models/Class";
import mongoose from "mongoose";
import { classFormData } from "@/components/school/modals/addClass";
import { StudentDocument, StudentModel } from "@/server/DB/models/student";
// interface PopulatedClass {
//   _id: string;
//   session: string;
//   class_name: string;
//   students: {
//     _id: string;
//     class_id: string;
//     name: string;
//     fatherName: string;
//     motherName: string;
//     address: string;
//     mobileNumber: string;
//     adhaarNumber: string;
//     serialNumber: string;
//     rollnumber: string;
//     bloodGroup: string;
//     dob: Date;
//     image_url: string;
//     image_public_id: string;
//   }[];
// }

export async function getClasses() {
  try {
    await connectDB();
    const session = await getCurrentSession();
    const classes = await ClassModel.find({ session }).select(
      "-__v -createdAt -updatedAt"
    );
    return classes.map(({ students, _id, session, class_name }) => ({
      session: (session as mongoose.Types.ObjectId).toString(),
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

export async function getPopulatedClasses() {
  try {
    await connectDB();
    const session = (await getCurrentSession())!;
    await StudentModel.init();

    const classes = await ClassModel.find({ session })
      .select("-__v -createdAt -updatedAt")
      .populate(
        "students",
        "_id name fatherName classes motherName address mobileNumber adhaarNumber serialNumber rollnumber bloodGroup dob image_url image_public_id"
      );
    const formattedClasses = classes.map(({ students, _id, class_name }) => ({
      session,
      class_name,
      _id: (_id as mongoose.Types.ObjectId).toString(),
      students: students.map((student) => {
        const {
          _id: stId,
          name,
          fatherName,
          motherName,
          address,
          mobileNumber,
          adhaarNumber,
          serialNumber,
          bloodGroup,
          dob,
          image_url,
          image_public_id,
          classes,
        } = student as unknown as StudentDocument;
        return {
          _id: (stId as mongoose.Types.ObjectId).toString(),
          class_id: (_id as mongoose.Types.ObjectId).toString(),
          name,
          fatherName,
          motherName,
          address,
          mobileNumber,
          adhaarNumber,
          serialNumber,
          rollnumber: classes.find(
            (c) =>
              (c.session_id as mongoose.Types.ObjectId).toString() == session!
          )!.rollnumber,
          bloodGroup,
          dob,
          image_url,
          image_public_id,
        };
      }),
    }));
    return formattedClasses;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createClass(data: classFormData) {
  try {
    await connectDB();
    const session = await getCurrentSession();
    await ClassModel.create({ ...data, session });
    return { success: true, message: "Added class successfully", errors: [] };
    // eslint-disable-next-line
  } catch (error: any) {
    console.log(error);

    if (error.code === 11000) {
      const errors = Object.entries(error.keyValue)
        .map(([field]) => {
          if (field == "class_id") return null;
          return {
            field,
            message: `This class is already registered`,
          };
        })
        .filter((val) => val !== null);
      console.log({ errors, o: error.keyValue });
      return { success: false, errors, message: "Class validation failed" };
    }
    return { success: false, message: "Some thing went wrong", errors: [] };
  }
}
