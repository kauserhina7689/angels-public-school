"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";
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
import { classType } from "../pages/Class.page";

export const classFormSchema = z.object({
  class_name: z.string().min(3, "Please enter a class name"),
  _id: z.string().default("new"),
  subjects: z
    .array(
      z.object({
        name: z.string().min(1, "Subject name is required"),
        _id: z.string().min(1, "Subject name is required"),
      })
    )
    .min(1, "Add atleast 1 subjects")
    .refine(
      (subjects) => {
        const names = subjects.map((s) => s.name.trim().toLowerCase());
        return new Set(names).size === names.length;
      },
      {
        message: "Subject names must be unique",
        path: ["subjects"], // applies error at the array level
      }
    ),
});
export type classFormData = z.infer<typeof classFormSchema>;
function AddClassDialog({
  selectedClass,
  setSelectedClass,
}: {
  selectedClass: classType | null;
  setSelectedClass: React.Dispatch<React.SetStateAction<classType | null>>;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(classFormSchema),
  });
  const { fields, append, remove } = useFieldArray({
    name: "subjects",
    control: form.control,
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
      setIsAddModalOpen(false);
      setSelectedClass(null);
    } catch (error) {
      toast.error("Something went wrong", { id });
      console.log("error while registering student ", error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      console.log({ selectedClass });

      form.reset({
        class_name: selectedClass.class_name || "",
        subjects: selectedClass.subjects || [],
        _id: selectedClass._id || "new",
      });
      console.log(form.getValues());

      setIsAddModalOpen(true);
    }
  }, [selectedClass, form]);
  return (
    <Dialog
      open={isAddModalOpen}
      onOpenChange={(state) => {
        setIsAddModalOpen(state);
        if (!state) {
          setSelectedClass(null);
          form.reset({ class_name: "", subjects: [] });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-xl md:max-w-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add class
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl max-w-screen max-h-[calc(100%-2rem)] md:max-w-none w-3xl">
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
            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    <FormLabel>Subjects</FormLabel>

                    {form.formState.errors.subjects?.root && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.subjects.root.message}
                      </p>
                    )}
                    {form.formState.errors.subjects && (
                      <p className="text-sm text-destructive">
                        {
                          // eslint-disable-next-line
                          (form.formState.errors.subjects as any).subjects
                            ?.message
                        }
                      </p>
                    )}
                    {form.formState.errors.subjects?.message && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.subjects.message}
                      </p>
                    )}

                    <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[50svh]">
                      {fields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`subjects.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <span>{index + 1}</span>
                                <FormControl>
                                  <Input
                                    placeholder="Subject name"
                                    {...field}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        type="button"
                        onClick={() => append({ name: "", _id: "new" })}
                        variant="outline"
                        className="bg-primary/60"
                      >
                        + Add Subject
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                onClick={() => {
                  setIsAddModalOpen(false);
                  form.reset();
                }}
                type="button"
                variant={"outline"}
              >
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
