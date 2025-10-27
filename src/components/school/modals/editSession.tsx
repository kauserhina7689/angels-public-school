"use client";
const DatePicker = dynamic(() => import("@/components/common/DatePicker"), {
  ssr: false,
});
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateLocal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { saveSession } from "@/server/actions/school/session";
import { useRouter } from "next/navigation";

export const sessionSchema = z
  .object({
    name: z
      .string()
      .regex(/^\d{4}-\d{2}$/, {
        message: "Session name must be in format YYYY-YY (e.g. 2024-25)",
      })
      .min(7),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    _id: z.string().default("new"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );
export type sessionType = z.infer<typeof sessionSchema>;
function SessionEditFormModal({
  currentSession,
  setCurrentSession,
}: {
  currentSession: sessionType | null;
  setCurrentSession: React.Dispatch<React.SetStateAction<sessionType | null>>;
}) {
  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: currentSession?.name || "",
      startDate: currentSession?.startDate || formatDateLocal(new Date()),
      endDate: currentSession?.endDate || formatDateLocal(new Date()),
      _id: currentSession?._id || "new",
    },
  });
  const router = useRouter();
  useEffect(() => {
    if (currentSession) {
      form.reset({
        name: currentSession.name || "",
        startDate: currentSession.startDate || formatDateLocal(new Date()),
        endDate: currentSession.endDate || formatDateLocal(new Date()),
        _id: currentSession._id || "new",
      });
    }
  }, [currentSession, form]);
  async function onSubmit(data: sessionType) {
    const id = toast.loading("Saving session .....");
    try {
      const resp = await saveSession(data);
      if (resp.error) {
        toast.error(resp.message, { id });
      }
      toast.success(resp.message, { id });
      setCurrentSession(null);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong please try again");
      console.log({ error });
    }
  }

  return (
    <Dialog
      open={!!currentSession}
      onOpenChange={(open) => {
        if (!open) setCurrentSession(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            setCurrentSession({
              name: "",
              startDate: formatDateLocal(new Date()),
              endDate: formatDateLocal(new Date()),
              _id: "new",
            })
          }
          className="rounded-xl max-w-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New session
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl max-w-sm h-min">
        <DialogHeader>
          <DialogTitle>Add New session</DialogTitle>
          <DialogDescription>Create a new session.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 grid-cols-1 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Enter session</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"Eg. 2025-26 etc"}
                      type={"text"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"startDate"}
              render={({}) => (
                <FormItem>
                  <FormLabel>Enter start date</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={(e) => {
                        const formattedDate = formatDateLocal(e!);
                        form.setValue("startDate", formattedDate);
                      }}
                      value={form.getValues("startDate")}
                      className="w-full"
                      futureDateAllowed
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"endDate"}
              render={({}) => (
                <FormItem>
                  <FormLabel>Enter end date</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={(e) => {
                        const formattedDate = formatDateLocal(e!);
                        console.log({ endDate: formattedDate });

                        form.setValue("endDate", formattedDate);
                      }}
                      className="w-full"
                      futureDateAllowed
                      value={form.getValues("endDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="md:col-span-2">Add session</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SessionEditFormModal;
