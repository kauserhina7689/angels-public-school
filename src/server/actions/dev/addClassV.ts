// "use server";
// // import { ClassModel } from "@/server/DB/models/Class";
// import students from "./class5.json";
// // import { connectDB } from "@/server/DB";
// // import { uploadCloudinary } from "@/lib/cloudinary";
// // import { getCurrentSession } from "../school/session";
// // import { hashPassword } from "@/server/utils/password";
// // import { StudentModel } from "@/server/DB/models/student";
// // import mongoose from "mongoose";

// // const studentUniqueErrormap: Record<string, string> = {
// //   adhaarNumber: "aadhaar number",
// //   serialNumber: "serial number",
// //   "classes.rollnumber": "roll number",
// //   "classes.class_id": "class",
// // };
// export function parseDob(dob: string) {
//   const [day, month, year] = dob.split("/");
//   return new Date(`${year}-${month}-${day}`); // ISO format
// }
// interface Student {
//   rollNO: number;
//   serialNumber: number;
//   name: string;
//   adhaarNumber: string;
//   dob: string; // e.g., "06/05/2012"
//   fName: string;
//   mName: string;
//   Address: string;
//   mobno: number;
//   bg: string; // e.g., "B+"
// }
// export async function addClassV(img: File) {
//   //   const classes = await ClassModel.find().select("id class_name");
//   //   console.log({ classes });
//   console.log("wroking", { classVId: "6958a15ff461e63c1446c19b" }, students[0]);
//   try {
//     const res = await Promise.all(
//       students.map((s) => createStudent(s as Student, img))
//     );
//     console.log(res);
//   } catch  {}
// }
// async function createStudent(student: Student, img: File) {
//   // try {
//   //   await connectDB();
//   //   const class_id = "6958a15ff461e63c1446c19b";
//   //   const {
//   //     name,
//   //     fName: fatherName,
//   //     mName: motherName,
//   //     Address: address,
//   //     mobno: mobileNumber,
//   //     adhaarNumber,
//   //     serialNumber,
//   //     dob,
//   //     bg: bloodGroup,
//   //   } = {
//   //     name: student.name,
//   //     fName: student.fName,
//   //     mName: student.mName,
//   //     Address: student.Address,
//   //     mobno: student.mobno,
//   //     adhaarNumber: student.adhaarNumber,
//   //     serialNumber: student.serialNumber,
//   //     dob: parseDob(student.dob),
//   //     bg: student.bg,
//   //   };
//   //   const rollnumber = student.rollNO;
//   //   console.log({ rollnumber, name, dob });
//   //   // const { public_id, secure_url } = await uploadCloudinary(img);
//   //   // const currentSession = await getCurrentSession();
//   //   // console.log({ student, rollnumber, currentSession, class_id });
//   //   // const password = await hashPassword(
//   //   //   `${student.adhaarNumber + student.serialNumber}`
//   //   // );
//   //   // const newStudent = await StudentModel.create({
//   //   //   fatherName,
//   //   //   name,
//   //   //   motherName,
//   //   //   mobileNumber,
//   //   //   address,
//   //   //   adhaarNumber,
//   //   //   serialNumber,
//   //   //   dob,
//   //   //   bloodGroup,
//   //   //   password,
//   //   //   image_public_id: public_id,
//   //   //   image_url: secure_url,
//   //   //   classes: [
//   //   //     {
//   //   //       class_id: new mongoose.Types.ObjectId(class_id),
//   //   //       session_id: new mongoose.Types.ObjectId(currentSession),
//   //   //       rollnumber: rollnumber,
//   //   //     },
//   //   //   ],
//   //   // });
//   //   // const studentClass = await ClassModel.findById(class_id);
//   //   // await studentClass?.students.push(
//   //   //   newStudent._id as mongoose.Types.ObjectId
//   //   // );
//   //   // await studentClass?.save();
//   //   return { success: true, message: "Added student successfully" };
//   //   // eslint-disable-next-line
//   // } catch (error: any) {
//   //   console.log({ studentRegisterErro: error.message });
//   //   if (error.code === 11000) {
//   //     const errors = Object.entries(error.keyValue)
//   //       .map(([field]) => {
//   //         if (field == "classes.class_id") return null;
//   //         console.log(field);
//   //         return {
//   //           field: field.split(".").at(-1)!,
//   //           message: `This ${studentUniqueErrormap[field]} is already registered`,
//   //         };
//   //       })
//   //       .filter((val) => val !== null);
//   //     console.log({ errors, o: error.keyValue });
//   //     return { success: false, errors, message: "Student validation failed" };
//   //   }
//   //   return { success: false, message: "Some thing went wrong", errors: [] };
//   // }
// }
