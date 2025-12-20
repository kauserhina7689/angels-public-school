"use client";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
export default function DatePicker({
  onChange,
  value,
  className,
  futureDateAllowed = false,
  notAllowedDates,
}: {
  onChange?: (date?: Date) => void;
  value?: string;
  className?: string;
  futureDateAllowed?: boolean;
  notAllowedDates?: Date[];
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : new Date()
  );
  React.useEffect(() => {
    if (value) setDate(new Date(value));
  }, [value]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={cn("w-min justify-between font-normal", className)}
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          className="z-[99999]"
          mode="single"
          selected={date}
          captionLayout="dropdown"
          fromYear={1990}
          toYear={2100}
          disabled={(d) => {
            const isFutureBlocked = !futureDateAllowed && d > new Date();

            const isNotAllowed =
              notAllowedDates?.some((nd) => isSameDay(nd, d)) ?? false;

            return isFutureBlocked || isNotAllowed;
          }}
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
            if (onChange) onChange(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
