import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User2 } from "lucide-react";
import { addClassV } from "./addClassV";
import { toast } from "sonner";

function AddCLassV() {
  const [preview, setPreview] = useState<string | null>(null);
  const [img, setImg] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImg(file);
      setPreview(url);
      // Optional: cleanup old preview
      return () => URL.revokeObjectURL(url);
    }
  };
  async function add() {
    try {
      if (!img) {
        toast("PLease add a image");
        return;
      }
      toast("Adding class V");

      const resp = await addClassV(img);
      console.log(resp);
      toast("Added");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <form>
        <DialogContent className="sm:max-w-[425px] h-1/2">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label>
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt=""
                    className="object-cover absolute rounded-full inset-0 h-64 w-64"
                  />
                </>
              ) : (
                <div className="h-64 w-64 rounded-full bg-secondary">
                  <User2 className="h-full w-full text-gray-600" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="studentImage"
              />
            </Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={add}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddCLassV;
