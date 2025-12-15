"use client";
import { HolidayType } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddHolidayDialog from "../modals/addHolidayDialog";
import { deleteHoliday } from "@/server/actions/school/holiday/delete";

export default function HolidaysPage({
  holidays,
}: {
  holidays: HolidayType[];
}) {
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayType | null>(
    null
  );
  const searchParams = useSearchParams();
  const errMessage = searchParams.get("message");

  useEffect(() => {
    if (errMessage) toast.error(errMessage);
  }, [errMessage]);

  // Group holidays by month
  const groupedHolidays = holidays.reduce((acc, holiday) => {
    const date = new Date(holiday.date);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(holiday);
    return acc;
  }, {} as Record<string, HolidayType[]>);

  // Sort holidays within each month
  Object.keys(groupedHolidays).forEach((monthYear) => {
    groupedHolidays[monthYear].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  const handleDelete = async (holidayId: string, title: string) => {
    const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    const id = toast.loading("Deleting holiday...");
    try {
      // TODO: Replace with your actual delete action
      await deleteHoliday(holidayId);

      toast.success("Holiday deleted successfully", { id });
      // router.refresh();
    } catch (error) {
      toast.error("Failed to delete holiday", { id });
      console.error("Error deleting holiday:", error);
    }
  };

  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <header className="flex border-b z-10 pb-2 sticky top-0 flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Holidays</h1>
          <p className="text-muted-foreground">
            View and manage holidays for the current session
          </p>
        </div>
        <AddHolidayDialog
          selectedHoliday={selectedHoliday}
          setSelectedHoliday={setSelectedHoliday}
        />
      </header>

      {holidays.length === 0 ? (
        <Card className="col-span-full h-[40svh] border-none shadow-none flex items-center justify-center p-10">
          <CardContent className="flex flex-col items-center text-muted-foreground">
            <Calendar className="h-10 w-10 mb-3 opacity-60" />
            <p>{errMessage ?? "No holidays added for the current session"}</p>
          </CardContent>
        </Card>
      ) : (
        <main className="w-full space-y-6">
          {Object.entries(groupedHolidays).map(([monthYear, monthHolidays]) => (
            <div key={monthYear}>
              <h2 className="text-xl font-semibold mb-3 text-muted-foreground">
                {monthYear}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {monthHolidays.map((holiday) => {
                  const startDate = new Date(holiday.date);

                  // Compute end date using duration
                  const endDate = new Date(startDate);
                  endDate.setDate(endDate.getDate() + (holiday.duration - 1));

                  const isRange = holiday.duration > 1;

                  const formattedStart = startDate.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                  });

                  const formattedEnd = endDate.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                  });

                  const dayOfWeek = startDate.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  console.log(holiday);

                  return (
                    <Card
                      key={holiday._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {/* DATE BOX */}
                            <div className="bg-primary/10 rounded-lg p-2 text-center min-w-[60px]">
                              <p className="text-2xl font-bold text-primary">
                                {startDate.getDate()}
                              </p>
                              <p className="text-xs text-muted-foreground uppercase">
                                {startDate.toLocaleDateString("en-US", {
                                  month: "short",
                                })}
                              </p>
                            </div>

                            {/* TITLE + WEEKDAY + RANGE */}
                            <div>
                              <CardTitle className="text-lg">
                                {holiday.title}
                              </CardTitle>

                              <Badge variant="secondary" className="mt-1">
                                {dayOfWeek}
                              </Badge>

                              {/* Date Range Display */}
                              {isRange && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formattedStart} – {formattedEnd}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* EDIT + DELETE BUTTONS */}
                          <div className="flex gap-1">
                            <Button
                              onClick={() => setSelectedHoliday(holiday)}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() =>
                                handleDelete(holiday._id, holiday.title)
                              }
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {/* DESCRIPTION */}
                      {holiday.description && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            {holiday.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      )}
    </div>
  );
}
