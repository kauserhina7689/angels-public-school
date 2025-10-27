import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
function ClassChangeAlertModal({
  confirmationModelOpen,
  setConfirmationModelOpen,
  setClassChangeConfirmation,
  change,
  pendingClassId,
  setPendigClassId,
}: {
  confirmationModelOpen: boolean;
  setConfirmationModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setClassChangeConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setPendigClassId: React.Dispatch<React.SetStateAction<string>>;
  pendingClassId: string;
  // eslint-disable-next-line
  change: (...event: any[]) => void;
}) {
  return (
    <AlertDialog
      open={confirmationModelOpen}
      onOpenChange={setConfirmationModelOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Changing this student&apos;s class will permanently delete all marks
            and attendance records associated with their current class. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setClassChangeConfirmation(true);
              change(pendingClassId);
              setPendigClassId("");
            }}
            className="bg-destructive"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ClassChangeAlertModal;
