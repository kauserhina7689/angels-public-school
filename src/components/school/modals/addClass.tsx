"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { Input } from "@/components/ui/input";
import { createClass } from "@/server/actions/school/getClasses";
import { useRouter } from "next/navigation";
// class_name: { type: String, required: true, unique: true },
//     // batch: { type: Number, required: true },
//     students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
//     index: { type: Number },
export const classFormSchema = z.object({
  class_name: z.string().min(3, "Please enter a class name"),
});
export type classFormData = z.infer<typeof classFormSchema>;
function AddClassDialog() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const form = useForm<classFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      class_name: "",
    },
  });
  const onSubmit = async (data: classFormData) => {
    const id = toast.loading(`Registering ${data.class_name}...`);

    try {
      console.log("Form Data:", data);
      const resp = await createClass(data);
      if (!resp.success) {
        toast.error(resp.message, { id });
        console.log(resp.errors);

        resp.errors.forEach((err) =>
          form.setError(err.field as keyof classFormData, {
            message: err.message,
          })
        );
        return;
      }
      toast.success(resp.message, { id });
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong", { id });
      console.log("error while registering student ", error);
    }
  };
  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl max-w-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add class
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl max-w-sm h-min">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>Create a new class.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name={"class_name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"Enter class name "}
                      type={"text"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
              <Button type="submit">Add class</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddClassDialog;
