"use server";

import { examMaxMarks } from "@/lib/utils";
import { connectDB } from "@/server/DB";
import { ClassModel } from "@/server/DB/models/Class";
import { MarksDocument, MarksModel } from "@/server/DB/models/marks";
import { StudentDocument } from "@/server/DB/models/student";
import mongoose from "mongoose";

export async function getMarks({
  classname,
  exam,
  subject,
}: {
  classname: string;
  subject: string;
  exam: string;
}) {
  try {
    await connectDB();
    const classCurrent = await ClassModel.findById(classname).populate(
      "students",
      "name classes"
    );

    if (!classCurrent) {
      return {
        sucess: false,
        marks: [],
        message: "Class not found. Please check the class ID.",
      };
    }

    const students = (
      classCurrent!.students as unknown as StudentDocument[]
    ).map(({ classes, name, _id }) => {
      return {
        name,
        rollnumber: classes.find((c) => c.class_id.toString() == classname)!
          .rollnumber,
        _id: (_id as mongoose.Types.ObjectId).toString(),
      };
    });

    if (!students.length) {
      return {
        sucess: false,
        marks: [],
        message: "No students found for the selected class.",
      };
    }

    let max = examMaxMarks[exam];
    // await MarksModel.deleteMany();
    await MarksModel.syncIndexes();

    const marks = await Promise.all(
      students.map(async (student) => {
        const existingMarks: MarksDocument | null = await MarksModel.findOne({
          examType: exam,
          class_id: classname,
          subject_id: subject,
          student_id: student._id,
        });

        if (existingMarks) {
          console.log("found old marks");
          max = existingMarks.max;
          return {
            marks: existingMarks.obtained,
            max: existingMarks.max,
            absent: existingMarks.absent,
            name: student.name,
            rollNumber: student.rollnumber,
            _id: (existingMarks._id as mongoose.Types.ObjectId).toString(),
          };
        }

        const newMarks: MarksDocument = await MarksModel.create({
          examType: exam,
          class_id: classname,
          subject_id: subject,
          student_id: student._id,
          max,
          obtained: 0,
        });

        return {
          marks: newMarks.obtained,
          max: newMarks.max,
          absent: newMarks.absent,
          name: student.name,
          rollNumber: student.rollnumber,
          _id: (newMarks._id as mongoose.Types.ObjectId).toString(),
        };
      })
    );

    return {
      sucess: true,
      marks,
      message: "Fetched or created marks successfully.",
    };
    // eslint-disable-next-line
  } catch (error: any) {
    console.error("Error in getMarks:", error);

    let errorMessage = "An unexpected error occurred while fetching marks.";
    if (error instanceof mongoose.Error.CastError) {
      errorMessage = "Invalid class ID format.";
    } else if (error.code === 11000) {
      errorMessage = "Duplicate marks entry detected.";
    }

    return {
      sucess: false,
      marks: [],
      message: errorMessage,
    };
  }
}

export async function saveOneMark(
  markId: string,
  { obtained, absent }: { obtained: number; absent: boolean }
) {
  try {
    await connectDB();

    const updated = await MarksModel.findByIdAndUpdate(
      markId,
      { obtained, absent },
      { new: true, runValidators: true }
    );

    if (!updated) return { success: false, message: "Document not found" };
    return { success: true, message: "Saved marks successfully" };
  } catch {
    return { success: false, message: "Something went wrong please try again" };
  }
}

export async function saveAllMarks(
  marks: {
    markId: string;
    obtained: number;
    absent: boolean;
  }[]
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectDB();
    // Perform updates inside the transaction
    for (const m of marks) {
      const updated = await MarksModel.findByIdAndUpdate(
        m.markId,
        { obtained: m.obtained, absent: m.absent },
        { new: true, runValidators: true, session }
      );

      if (!updated) {
        await session.abortTransaction();
        session.endSession();
        return { success: false, message: "Document not found" };
      }
    }

    // Commit all if successful
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "All marks saved successfully",
    };
  } catch (error) {
    // Rollback all changes
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", error);
    return {
      success: false,
      message: "Saving failed please check and try again",
    };
  }
}
