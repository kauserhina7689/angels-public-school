"use client";
import React, { useEffect, useState } from "react";
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
import { studentType } from "@/lib/types";
import { createOrUpdateStudent } from "@/server/actions/school/students/createStudent";
import ClassChangeAlertModal from "./ClassChangeAlertModal";

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
  _id: z.string().min(1, "Id is required"),
  file: z.union([
    z
      .custom<File>((val) => val instanceof File, {
        message: "Please upload a valid image file",
      })
      .refine((file) => file.size <= 100 * 1024 * 1024, {
        message: "Max size exceeded (100MB limit)",
      }),
    z.object({
      image_public_id: z
        .string({
          required_error: "Image public ID is required",
        })
        .min(1, { message: "Image public ID cannot be empty" }),

      image_url: z
        .string({
          required_error: "Image URL is required",
        })
        .url({ message: "Please provide a valid image URL" })
        .refine((url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url), {
          message:
            "Only image URLs are allowed (jpg, jpeg, png, gif, webp, svg)",
        }),
    }),
  ]),
});

export type StudentFormData = z.infer<typeof studentSchema>;

function AddStudentForm({
  classes,
  setCurrentStudent,
  currentStudent,
}: {
  classes: {
    session: string;
    class_name: string;
    _id: string;
  }[];
  currentStudent:
    | (studentType & {
        class_id: string;
        _id: string;
      })
    | null;
  setCurrentStudent: React.Dispatch<
    React.SetStateAction<
      | (studentType & {
          class_id: string;
          _id: string;
        })
      | null
    >
  >;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const [classChangeComfirmation, setClassChangeConfirmation] = useState(false);
  const [confirmationModelOpen, setConfirmationModelOpen] = useState(false);
  const [pendingClassId, setPendigClassId] = useState("");
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "Arslaan",
      fatherName: "Anees ahmad",
      motherName: "Aarzoo parveen",
      address: "123",
      serialNumber: 1,
      class_id: classes[0]?._id ?? "",
      rollnumber: 1,
      mobileNumber: 9876543210,
      adhaarNumber: 123123123123,
      dob: formatDateLocal(new Date()),
      bloodGroup: "AB−",
      _id: "new",
    },
  });
  useEffect(() => {
    if (!currentStudent) return;
    const { _id, dob, image_url, image_public_id, class_id, ...rest } =
      currentStudent;
    form.reset({
      ...rest,
      class_id,
      dob: formatDateLocal(dob),
      _id,
      file: { image_public_id, image_url },
    });
    setPreview(image_url);
    setIsAddModalOpen(true);
  }, [currentStudent]);
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
      const resp = await createOrUpdateStudent({
        ...data,
        oldClassId: currentStudent?.class_id || "new",
      });
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
    } finally {
      setClassChangeConfirmation(false);
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
    <>
      {" "}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(state) => {
          setIsAddModalOpen(state);
          if (!state) {
            form.reset({
              name: "Arslaan",
              fatherName: "Anees ahmad",
              motherName: "Aarzoo parveen",
              address: "123",
              serialNumber: 1,
              class_id: classes[0]?._id ?? "",
              rollnumber: 1,
              mobileNumber: 9876543210,
              adhaarNumber: 123123123123,
              dob: formatDateLocal(new Date()),
              bloodGroup: "AB−",
              _id: "new",
              file: null as unknown as File, //how to do this properly
            });
            setPreview(null);
            setCurrentStudent(null);
            setClassChangeConfirmation(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="rounded-xl w-full sm:w-auto">
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
                        // onValueChange={field.onChange}
                        onValueChange={(value) => {
                          if (
                            value !== currentStudent?.class_id &&
                            currentStudent &&
                            !classChangeComfirmation
                          ) {
                            console.log("class changed");
                            setPendigClassId(value);
                            setConfirmationModelOpen(true);
                          } else field.onChange(value);
                        }}
                        defaultValue={field.value}
                        value={field.value}
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
                      <ClassChangeAlertModal
                        confirmationModelOpen={confirmationModelOpen}
                        setConfirmationModelOpen={setConfirmationModelOpen}
                        pendingClassId={pendingClassId}
                        setPendigClassId={setPendigClassId}
                        setClassChangeConfirmation={setClassChangeConfirmation}
                        change={field.onChange}
                      />
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
    </>
  );
}

export default AddStudentForm;
