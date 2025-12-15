"use server";

import { connectDB } from "@/server/DB";
import mongoose, { Types } from "mongoose";
import { getCurrentSession } from "../session";
import { AssignmentModel } from "@/server/DB/models/assignment";

export async function getAssignments() {
  try {
    await connectDB();
    const session_id = await getCurrentSession();

    // Find all assignments whose class belongs to the current session
    const assignments = await AssignmentModel.find({ session_id })
      .populate({
        path: "class_id",
        select: "class_name session subjects",
      })
      .select("-__v -createdAt -updatedAt");

    return assignments
      .map(({ _id, class_id, date, assignments }) => {
        const cls = class_id as unknown as {
          _id: mongoose.Types.ObjectId;
          class_name: string;
          session: mongoose.Types.ObjectId;
          subjects: { name: string; _id: mongoose.Types.ObjectId }[];
        };

        return {
          _id: (_id as Types.ObjectId).toString(),
          date,
          class_id: cls._id.toString(),
          class_name: cls.class_name,
          session: cls.session.toString(),
          subjects: cls.subjects.map((s) => ({
            name: s.name,
            _id: s._id.toString(),
          })),
          assignments: assignments.map((a) => ({
            subject: a.subject,
            title: a.title,
            description: a.description,
            file: {
              image_url: a.file.image_url,
              image_public_id: a.file.image_public_id,
            },
          })),
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.log({ getAssignmentsError: error });
    return [];
  }
}
