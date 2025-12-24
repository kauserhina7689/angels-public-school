"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { HolidayType } from "@/lib/types";
import { createHoliday } from "@/server/actions/school/holiday/create";

// Zod Schema
export const holidayFormSchema = z.object({
  _id: z.string(),
  date: z.string().min(1, "Please select a date"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  description: z.string().max(300, "Description too long"),
  duration: z.number().min(1, "Holiday must be of atleast 1 day"), // ✅ ADDED
});

export type HolidayFormData = z.infer<typeof holidayFormSchema>;

// Add Holiday Dialog Component
export default function AddHolidayDialog({
  selectedHoliday,
  setSelectedHoliday,
}: {
  selectedHoliday: HolidayType | null;
  setSelectedHoliday: React.Dispatch<React.SetStateAction<HolidayType | null>>;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      _id: "new",
      date: "",
      title: "",
      description: "",
      duration: 1,
    },
  });

  const onSubmit = async (data: HolidayFormData) => {
    const id = toast.loading(
      `${data._id === "new" ? "Adding" : "Updating"} holiday...`
    );

    try {
      console.log("Form Data:", data);

      const resp = await createHoliday(data);

      if (!resp.success) {
        toast.error(resp.message, { id });
        console.log(resp.errors);
        // eslint-disable-next-line
        resp.errors.forEach((err: any) =>
          form.setError(err.field as keyof HolidayFormData, {
            message: err.message,
          })
        );
        return;
      }

      toast.success(resp.message, { id });
      form.reset();
      router.refresh();
      setIsAddModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      toast.error("Something went wrong", { id });
      console.log("Error while saving holiday:", error);
    }
  };

  useEffect(() => {
    if (selectedHoliday) {
      const dateString =
        selectedHoliday.date instanceof Date
          ? selectedHoliday.date.toISOString().split("T")[0]
          : new Date(selectedHoliday.date).toISOString().split("T")[0];

      form.reset({
        _id: selectedHoliday._id || "new",
        date: dateString,
        title: selectedHoliday.title || "",
        description: selectedHoliday.description || "",
        duration: selectedHoliday.duration || 1, // ✅ ADDED
      });
      setIsAddModalOpen(true);
    }
  }, [selectedHoliday, form]);

  return (
    <Dialog
      open={isAddModalOpen}
      onOpenChange={(state) => {
        setIsAddModalOpen(state);
        if (!state) {
          form.reset({
            _id: "new",
            date: "",
            title: "",
            description: "",
            duration: 1, // ✅ ADDED
          });
          setSelectedHoliday(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-xl md:max-w-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Holiday
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl max-w-screen max-h-[calc(100%-2rem)] md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedHoliday ? "Edit Holiday" : "Add New Holiday"}
          </DialogTitle>
          <DialogDescription>
            {selectedHoliday
              ? "Update holiday details"
              : "Create a new holiday for the current session"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holiday Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Independence Day"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add additional details about the holiday"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 300 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ ADDED DURATION FIELD */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                form.reset();
                setSelectedHoliday(null);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)}>
              {selectedHoliday ? "Update Holiday" : "Add Holiday"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
