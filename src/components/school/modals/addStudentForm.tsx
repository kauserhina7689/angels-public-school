"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User2 } from "lucide-react";
// schemas/studentSchema.ts
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/common/DatePicker";
import { bloodGroups, formatDateLocal } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createStudent } from "@/server/actions/school/student";

export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  address: z.string().min(1, "Address is required"),

  mobileNumber: z.coerce
    .number()
    .int()
    .refine((val) => /^\d{10}$/.test(val.toString()), {
      message: "Mobile number must be 10 digits",
    }),

  adhaarNumber: z.coerce
    .number()
    .refine((val) => /^\d{12}$/.test(val.toString()), {
      message: "Aadhaar number must be 12 digits",
    }),
  serialNumber: z.coerce.number().int().min(1, "Serial number is required"),
  class_id: z.string().min(1, "Class is required"),
  rollnumber: z.coerce.number().int().min(1, "Roll number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.enum(bloodGroups, {
    errorMap: () => ({ message: "Invalid blood group" }),
  }),
  file: z
    .custom<File>(
      (val) => {
        return val instanceof File;
      },
      {
        message: "Please upload student image",
      }
    )
    .refine((val) => val.size <= 100 * 1024 * 1024, {
      message: "Max size exceeded",
    }),
});

export type StudentFormData = z.infer<typeof studentSchema>;

function AddStudentForm({
  classes,
}: {
  classes: {
    session: string;
    class_name: string;
    _id: string;
  }[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "Arslaan ansari",
      fatherName: "Anees ahmad",
      motherName: "Aarzoo parveen",
      address: "123 Green Street, Delhi",
      serialNumber: 1,
      class_id: classes[0]?._id ?? "",
      rollnumber: 1,
      mobileNumber: 9876543210,
      adhaarNumber: 123123123123,
      dob: formatDateLocal(new Date()),
      bloodGroup: "AB−",
    },
  });
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      // Optional: cleanup old preview
      return () => URL.revokeObjectURL(url);
    }
  };
  const onSubmit = async (data: StudentFormData) => {
    const id = toast.loading(`Registering ${data.name}...`);

    try {
      const resp = await createStudent(data);
      if (!resp.success) {
        toast.error(resp.message, { id });
        console.log(resp.errors);

        resp.errors.forEach((err) =>
          form.setError(err.field as keyof StudentFormData, {
            message: err.message,
          })
        );
        return;
      }
      toast.success(resp.message, { id });
      form.reset();
      router.refresh();
      setIsAddModalOpen(false);
      setPreview("");
    } catch (error) {
      toast.error("Something went wrong", { id });
      console.log("error while registering student ", error);
    }
  };
  const textFields: {
    name: keyof Omit<StudentFormData, "file">;
    label: string;
    type?: string;
  }[] = [
    { name: "name", label: "Name" },
    { name: "fatherName", label: "Father's Name" },
    { name: "motherName", label: "Mother's Name" },
    { name: "address", label: "Address" },
    {
      name: "mobileNumber",
      label: "Mobile Number",
      type: "number",
    },
    {
      name: "adhaarNumber",
      label: "Aadhaar Number",
      type: "number",
    },
    {
      name: "serialNumber",
      label: "Serial Number",
      type: "number",
    },
    { name: "rollnumber", label: "Roll Number", type: "number" },
  ];

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl ">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl lg:max-w-3/4 max-h-11/12 h-min">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Create a new student account.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-auto flex flex-col max-h-[70svh]"
          >
            <div className="grid md:grid-cols-2 gap-5 overflow-auto p-2 grow">
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem className="md:col-span-2">
                    <FormLabel
                      htmlFor="studentImage"
                      className="relative h-32 rounded-full overflow-clip aspect-square col-span-2 mx-auto"
                    >
                      {preview ? (
                        <>
                          <img
                            src={preview}
                            alt=""
                            className="object-cover absolute rounded-full inset-0 h-full w-full"
                          />
                        </>
                      ) : (
                        <div className="h-full w-full rounded-full bg-secondary">
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
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {textFields.map(({ name, label, type = "text" }) => {
                return (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof StudentFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={label}
                            type={type}
                            // eslint-disable-next-line
                            {...(field as any)}
                          />
                        </FormControl>
                        {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.class_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodGroups.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => {
                          const formattedDate = formatDateLocal(date!);
                          field.onChange(formattedDate);
                        }}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button type="submit">Register Student</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStudentForm;
