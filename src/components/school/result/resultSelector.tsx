"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function ReportSelector({
  classes,
  currentClass,
}: {
  classes: {
    _id: string;
    class_name: string;
  }[];
  currentClass: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedClass, setSelectedClass] = useState(
    currentClass || classes[0]?._id,
  );

  // sync URL when class changes
  useEffect(() => {
    if (!selectedClass) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("class_id", selectedClass);

    router.replace(`?${params.toString()}`);
  }, [selectedClass]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* TITLE */}
      <div>
        <h1 className="text-xl font-bold">Report Cards</h1>
        <p className="text-sm text-muted-foreground">
          View and print student report cards
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* CLASS SELECT */}
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Classes</SelectLabel>
              {classes.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.class_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* PRINT BUTTON */}
        <Button onClick={() => window.print()}>Print</Button>
      </div>
    </div>
  );
}

export default ReportSelector;
