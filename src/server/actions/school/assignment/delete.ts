"use server";

import { AssignmentModel } from "@/server/DB/models/assignment";

export async function deleteAssignmentServer(_id: string) {
  try {
    if (!_id) {
      return {
        status: false,
        message: "Assignment ID is required.",
      };
    }

    const deleted = await AssignmentModel.findByIdAndDelete(_id);

    if (!deleted) {
      return {
        status: false,
        message: "Assignment not found or already deleted.",
      };
    }

    return {
      status: true,
      message: "Assignment deleted successfully.",
    };
  } catch (error: any) {
    console.error("Delete Assignment Error:", error);

    return {
      status: false,
      message: "An unexpected error occurred while deleting the assignment.",
      error: error?.message || null,
    };
  }
}
