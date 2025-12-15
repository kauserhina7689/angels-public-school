"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteAssignmentServer } from "@/server/actions/school/assignment/delete";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function DeleteAssignmentModal({ _id }: { _id: string }) {
  const router = useRouter();
  async function deleteAssignment() {
    const id = toast.loading("Deleting assignment");
    try {
      const resp = await deleteAssignmentServer(_id);
      if (!resp.status) {
        toast.error(resp.message, { id, description: resp.error });
      }
      router.refresh();
      toast.success(resp.message, { id });
    } catch (assignmentDeletionError) {
      console.log({ assignmentDeletionError });
      toast.error(
        "An unexpected error occurred while deleting the assignment.",
        { id }
      );
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl text-red-600 hover:bg-red-50 bg-transparent"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this assignment? This action is
            permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAssignment}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAssignmentModal;
