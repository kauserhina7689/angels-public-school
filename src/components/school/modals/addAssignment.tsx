import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, Plus, Trash2 } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { deleteFromCloudinary, uploadCloudinary } from "@/lib/cloudinary";
import addAssignmentServer from "@/server/actions/school/assignment/addAssignmentServer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Type definitions
type ClassType = {
  session: string;
  class_name: string;
  _id: string;
  students: string[];
  subjects: {
    name: string;
    _id: string;
  }[];
};

// Zod schema
const subjectAssignment = z.object({
  title: z
    .string()
    .min(3, "Enter a proper assignment title")
    .max(100, "Title too long"),
  description: z
    .string()
    .min(3, "Enter a proper assignment description")
    .max(500, "Description too long"),
  file: z.union([
    // Allow empty/default file object
    z.object({
      image_public_id: z.string(),
      image_url: z.string(),
      name: z.string(),
      size: z.number(),
    }),
    z.object({
      image_public_id: z.string().min(1, "Image public ID cannot be empty"),

      image_url: z.string().url("Please provide a valid image URL"),

      name: z.string().min(1, "File name is required"),
      size: z.number().min(1, "File size must be greater than zero"),
    }),
  ]),
  subject: z.string().min(1, "Please select a subject"),
});

const formSchema = z.object({
  class_id: z.string().min(1, "Please select a class"),
  assignments: z
    .array(subjectAssignment)
    .min(1, "Please add at least one subject"),
});

export type assignmentFormType = z.infer<typeof formSchema>;
type Props = {
  formattedClassesMap: Record<string, ClassType>;
};
export default function MultiSubjectAssignmentForm({
  formattedClassesMap,
}: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  // Initialize form
  const form = useForm<assignmentFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_id: Object.keys(formattedClassesMap)[0],
      assignments: [],
    },
  });

  // Field array for dynamic assignments
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignments",
  });

  // Get selected class
  const selectedClassId = form.watch("class_id");
  const selectedClass = selectedClassId
    ? formattedClassesMap[selectedClassId]
    : null;

  // Add new assignment
  const addAssignment = () => {
    append({
      title: "",
      description: "",
      file: { image_public_id: "", image_url: "", name: "", size: 0 },
      subject: "",
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedIndex(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile, index);
    }
  };

  const handleFileSelect = async (selectedFile: File, index: number) => {
    const maxSize = 4 * 1024 * 1024; // 4MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (selectedFile.size > maxSize) {
      form.setError(`assignments.${index}.file`, {
        message: "File must be less than 4MB",
      });
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      form.setError(`assignments.${index}.file`, {
        message: "Only PDF, DOC, DOCX, and image files are allowed",
      });
      return;
    }
    const currentFile = form.watch(`assignments.${index}.file`);
    console.log({ currentFile });

    if (currentFile?.image_public_id) {
      await deleteFromCloudinary(currentFile.image_public_id);
    }
    const { public_id, secure_url } = await uploadCloudinary(selectedFile);
    form.setValue(`assignments.${index}.file`, {
      image_public_id: public_id,
      image_url: secure_url,
      name: selectedFile.name,
      size: selectedFile.size,
    });
    form.clearErrors(`assignments.${index}.file`);
  };

  const handleSubmit = async (data: assignmentFormType) => {
    const id = toast.loading(
      `Sending assignment for class ${
        formattedClassesMap[data.class_id].class_name
      }`
    );
    try {
      const resp = await addAssignmentServer(data);
      if (!resp.success) {
        toast.error(resp.message, { id });
        console.log(resp.errors);

        resp.errors?.forEach((err) =>
          form.setError(err.field as keyof assignmentFormType, {
            message: err.message,
          })
        );
        return;
      }
      toast.success(resp.message, { id });
      form.reset();
      setModalOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong", { id });
      console.log("error while registering student ", error);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Send Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl sm:max-w-[95%] lg:max-w-5xl max-h-[90svh] h-full sm:w-5xl">
        <DialogHeader>
          <DialogTitle>Send New Assignment</DialogTitle>
          <DialogDescription>
            Post an assignment to a selected class.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 grow  overflow-y-auto px-1">
          <Form {...form}>
            <div className="space-y-4">
              {/* Class Select Field */}
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="class">Select Class</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset assignments when class changes
                        form.setValue("assignments", []);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl w-full" id="class">
                          <SelectValue placeholder="Choose class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(formattedClassesMap).map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.class_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignments Array */}
              {selectedClass && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center ">
                    <h3 className="text-lg font-semibold">
                      Subject Assignments
                    </h3>
                    <Button
                      type="button"
                      onClick={addAssignment}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Assignment
                    </Button>
                  </div>

                  {fields.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-xl">
                      <p className="text-muted-foreground">
                        No assignments added yet. Click &quot;Add
                        Assignment&quot; to start.
                      </p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4 ">
                    {fields.map((field, index) => {
                      const currentFile = form.watch(
                        `assignments.${index}.file`
                      );

                      return (
                        <div
                          key={field.id}
                          className="border rounded-xl p-4 space-y-4 bg-muted/30"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              Assignment {index + 1}
                            </h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {/* Subject Field */}
                          <FormField
                            control={form.control}
                            name={`assignments.${index}.subject`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="rounded-xl w-full">
                                      <SelectValue placeholder="Choose subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {selectedClass.subjects.map((subject) => (
                                      <SelectItem
                                        key={subject._id}
                                        value={subject.name}
                                      >
                                        {subject.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Title Field */}
                          <FormField
                            control={form.control}
                            name={`assignments.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assignment Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter assignment title"
                                    className="rounded-xl"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Description Field */}
                          <FormField
                            control={form.control}
                            name={`assignments.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter assignment description and instructions"
                                    className="rounded-xl min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* File Upload Field */}
                          <FormField
                            control={form.control}
                            name={`assignments.${index}.file`}
                            render={({
                              // eslint-disable-next-line
                              field: { onChange, value, ...field },
                            }) => (
                              <FormItem>
                                <FormLabel>Upload File (Optional)</FormLabel>
                                <FormControl>
                                  <div
                                    className={cn(
                                      "cursor-pointer transition-colors",
                                      draggedIndex === index &&
                                        "bg-green-400/20 rounded-xl"
                                    )}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onClick={() =>
                                      document
                                        .getElementById(`file-${index}`)
                                        ?.click()
                                    }
                                  >
                                    {currentFile?.image_public_id ? (
                                      <div className="w-full p-2 bg-background border rounded-xl flex justify-between items-center">
                                        <p className="text-sm">
                                          {currentFile.name}{" "}
                                          <span className="text-xs ml-2 text-muted-foreground">
                                            {(
                                              currentFile.size /
                                              (1024 * 1024)
                                            ).toFixed(2)}
                                            MB
                                          </span>
                                        </p>
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            form.setValue(
                                              `assignments.${index}.file`,
                                              {
                                                image_public_id: "",
                                                image_url: "",
                                                name: "",
                                                size: 0,
                                              }
                                            );
                                          }}
                                          variant="ghost"
                                          size="sm"
                                          type="button"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400 transition-colors">
                                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-600">
                                          Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          PDF, DOC, DOCX, Images up to 4MB
                                        </p>
                                      </div>
                                    )}
                                    <Input
                                      id={`file-${index}`}
                                      type="file"
                                      accept=".pdf,.doc,.docx,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                      className="hidden"
                                      onChange={(e) => {
                                        const selectedFile =
                                          e.target.files?.[0];
                                        if (selectedFile) {
                                          handleFileSelect(selectedFile, index);
                                        }
                                      }}
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {form.formState.errors.assignments?.root && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.assignments.root.message}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
            </div>
          </Form>
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1 rounded-xl"
            onClick={form.handleSubmit(handleSubmit)}
            type="button"
            disabled={!selectedClass || fields.length === 0}
          >
            Send Assignments
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl bg-transparent"
            type="button"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
