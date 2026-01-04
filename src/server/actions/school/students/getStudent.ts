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

// export async function getPopulatedClasses() {
//   try {
//     await connectDB();

//     const session = (await getCurrentSession())!;
//     const classes = await ClassModel.find({ session }).select(
//       "id session class_name"
//     );
//     const populatedClasses = await Promise.all(
//       classes.map(async (c) => {
//         const studentsClassRealtion = await ClassStudentRelation.find({
//           class_id: c._id,
//         })
//           .select("-__v -createdAt -updatedAt")
//           .populate(
//             "student_id",
//             "_id name fatherName motherName address mobileNumber adhaarNumber serialNumber rollnumber bloodGroup dob image_url image_public_id"
//           );
//         console.table(studentsClassRealtion[0].rollnumber);
//         const students = studentsClassRealtion.map(
//           (r: classStudentRelation) => {
//             const {
//               _id: stId,
//               name,
//               fatherName,
//               motherName,
//               address,
//               mobileNumber,
//               adhaarNumber,
//               serialNumber,
//               bloodGroup,
//               dob,
//               image_url,
//               image_public_id,
//             } = r.student_id as unknown as StudentDocument;
//             return {
//               _id: (stId as mongoose.Types.ObjectId).toString(),
//               name,
//               fatherName,
//               motherName,
//               address,
//               mobileNumber,
//               adhaarNumber,
//               serialNumber,
//               rollnumber: r.rollnumber,
//               bloodGroup,
//               dob,
//               image_url,
//               image_public_id,
//             };
//           }
//         );
//         console.log(students);

//         return {
//           session,
//           class_name: c.class_name,
//           _id: c._id.toString(),
//           students,
//         };
//       })
//     );
//     console.log({ populatedClasses });
//     return populatedClasses;
//   } catch (error) {
//     return [];
//   }
// }
