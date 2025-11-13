"use server";

import { assignmentFormType } from "@/components/school/modals/addAssignment";
import { uploadCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/server/DB";
import { AssignmentModel } from "@/server/DB/models/assignment";
import mongoose from "mongoose";
import { getCurrentSession } from "../session";

interface AddAssignmentReturnType {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export default async function addAssignmentServer(
  data: assignmentFormType
): Promise<AddAssignmentReturnType> {
  try {
    await connectDB();
    console.log("Creating new assignment for class:", data.class_id);

    const { class_id, assignments } = data;

    // Upload each file to Cloudinary and attach URLs
    const uploadedAssignments = await Promise.all(
      assignments.map(async (item) => {
        // If the file already contains URLs, skip upload
        if (
          "image_url" in item.file &&
          item.file.image_url.startsWith("http")
        ) {
          return item;
        }

        const { public_id, secure_url } = await uploadCloudinary(
          item.file as unknown as File
        );

        return {
          ...item,
          file: {
            image_url: secure_url,
            image_public_id: public_id,
          },
        };
      })
    );
    const session_id = await getCurrentSession();
    const newAssignment = await AssignmentModel.create({
      date: new Date(),
      class_id: new mongoose.Types.ObjectId(class_id),
      assignments: uploadedAssignments,
      session_id,
    });

    console.log("Assignment created:", newAssignment._id);
    return { success: true, message: "Assignment added successfully" };
    // eslint-disable-next-line
  } catch (error: any) {
    console.error({ assignmentError: error });

    if (error.code === 11000) {
      const errors = Object.entries(error.keyValue).map(([field]) => ({
        field,
        message: `This ${field} already exists`,
      }));
      return {
        success: false,
        message: "Assignment validation failed",
        errors,
      };
    }

    return {
      success: false,
      message: "Something went wrong while adding assignment",
      errors: [],
    };
  }
}
