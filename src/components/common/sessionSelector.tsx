"use client";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCurrentSession } from "@/server/actions/school/session";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SessionSelector({
  sessions,
  currentSessionId,
}: {
  sessions: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  }[];
  currentSessionId?: string;
}) {
  const router = useRouter();
  async function handleChange(_id: string) {
    try {
      if (_id === currentSessionId) return;
      const set = await setCurrentSession(_id);
      if (!set) toast.error("Something went please try again");
      toast.success("Getting session data");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went please try again");
    }
  }
  useEffect(() => {
    if (currentSessionId) return;
    setCurrentSession(sessions.at(-1)!._id);
  }, [currentSessionId]);
  return (
    <Select
      onValueChange={handleChange}
      defaultValue={
        sessions.find((s) => s._id === currentSessionId)?._id ||
        sessions.at(-1)?._id
      }
    >
      <SelectTrigger className="w-full outline-0 border-0">
        <SelectValue placeholder="Session" />
      </SelectTrigger>
      <SelectContent>
        {sessions.map((session) => (
          <SelectItem key={session._id} value={session._id}>
            {session.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SessionSelector;
