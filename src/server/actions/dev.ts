"use server";

import mongoose from "mongoose";
import { ClassModel } from "../DB/models/Class";

export interface studentType {
  name: string;
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: number;
  adhaarNumber: number;
  serialNumber: number;
  class_id: mongoose.Types.ObjectId;
  rollnumber: string;
  password: string;
}

export const classes = [
  {
    class_name: "Class I",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baec"),
  },
  {
    class_name: "Class II",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baed"),
  },
  {
    class_name: "Class III",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baee"),
  },
  {
    class_name: "Class IV",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baef"),
  },
  {
    class_name: "Class V",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baf0"),
  },
  {
    class_name: "Class VI",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baf1"),
  },
  {
    class_name: "Class VII",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baf2"),
  },
  {
    class_name: "Class VIII",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baf3"),
  },
  {
    class_name: "Class Nursery",
    // _id: new mongoose.Types.ObjectId("6886238210c502581b99baf3"),
  },
];

export const generateStudentsForClass = (
  classId: mongoose.Types.ObjectId,
  count: number,
  classIndex: number
) => {
  const students: studentType[] = [];
  for (let i = 1; i <= count; i++) {
    const serial = classIndex * 100 + i;
    students.push({
      name: `Student ${classIndex}-${i}`,
      fatherName: `Father ${classIndex}-${i}`,
      motherName: `Mother ${classIndex}-${i}`,
      address: `Address ${classIndex}-${i}`,
      mobileNumber: 9999900000 + i,
      adhaarNumber: 123456789000 + serial,
      serialNumber: serial,
      class_id: classId,
      rollnumber: `R-${classIndex}${i.toString().padStart(2, "0")}`,
      password: `password${classIndex}${i}`,
    });
  }
  return students;
};

// export async function insertDummyStudents() {
//   const allStudents: (studentType & { password: string })[] = [];

//   classes.forEach((cls, idx) => {
//     const students = generateStudentsForClass(cls._id, 10, idx + 1);
//     allStudents.push(...students);
//   });
//   const newStudents = await StudentModel.countDocuments();
//   console.log({ newStudents });
// }

export async function generateclasses() {
  try {
    console.log("addign classes");

    const new_classes = await ClassModel.find();
    console.log("added classs", { new_classes });
  } catch (error) {
    console.log({ error });
  }
}
