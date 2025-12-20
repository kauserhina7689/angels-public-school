"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { cn, formatDateLocal } from "@/lib/utils";
import { toast } from "sonner";
import { addAttendanceAction } from "@/server/actions/school/attendance";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FilteredStudentType } from "@/app/school/attendance/page";
import {
  differenceInCalendarDays,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
} from "date-fns";
import { HolidayType } from "@/lib/types";
// import { DatePicker } from "@/components/common/DatePicker";
const DatePicker = dynamic(() => import("@/components/common/DatePicker"), {
  ssr: false,
});

export default function AttendancePage({
  studentsByClass,
  attendance,
  date,
  monthlyAttendance,
  holidays,
}: {
  studentsByClass: Record<string, FilteredStudentType[]>;
  attendance: {
    class_id: string;
    student_id: string;
  }[];
  monthlyAttendance: {
    class_id: string;
    student_id: string;
    date: string;
  }[];
  date?: string;
  holidays: HolidayType[];
}) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = React.useState(
    Object.keys(studentsByClass)[0]
  );
  const [absentStudents, setAbsentStudents] = React.useState<
    {
      student_id: string;
      class_id: string;
    }[]
  >(attendance);

  const [presentStudents, setPresentStudents] = React.useState<
    {
      student_id: string;
      class_id: string;
    }[]
  >([]);
  React.useEffect(() => {
    console.log("updated");
    setPresentStudents([]);
    setAbsentStudents(attendance);
  }, [attendance]);

  async function UploadAttendance() {
    const id = toast.loading("Saving attendance");
    try {
      const { status, message } = await addAttendanceAction(
        absentStudents,
        presentStudents,
        date
      );
      if (!status) toast.error(message, { id });
      toast.success(message, { id });
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again..",
        id,
      });
    }
  }
  const holidaysByMonthYear = React.useMemo(() => {
    return holidays.reduce((acc, holiday) => {
      const d =
        holiday.date instanceof Date ? holiday.date : new Date(holiday.date);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");

      const key = `${year}-${month}`; // e.g. "2025-01"

      if (!acc[key]) acc[key] = [];
      acc[key].push(holiday);

      return acc;
    }, {} as Record<string, HolidayType[]>);
  }, [holidays]);

  const getHolidaysForMonth = React.useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const key = `${year}-${month}`;
      return holidaysByMonthYear[key] || [];
    },
    [holidaysByMonthYear]
  );

  function getDaysCountForMonth(d?: string) {
    const today = new Date();
    const date = d ? new Date(d) : new Date();
    const holidays = getHolidaysForMonth(today);

    // If date is from the same month as today → days passed
    if (isSameMonth(date, today)) {
      return (
        differenceInCalendarDays(today, startOfMonth(today)) +
        1 -
        holidays.length
      );
      // OR simply: return today.getDate();
    }

    // If past month → full days of that month
    return getDaysInMonth(date) - holidays.length;
  }
  const totalDays = getDaysCountForMonth(date);

  const filteredStudents = (studentsByClass[selectedClass] || []).map((st) => {
    return {
      ...st,
      absentDays: monthlyAttendance.filter((a) => a.student_id == st._id)
        .length,
    };
  });

  const toggleAttendance = ({
    student_id,
    class_id,
  }: {
    student_id: string;
    class_id: string;
  }) => {
    const present = absentStudents.find((st) => st.student_id == student_id);
    if (!present) {
      setAbsentStudents((st) => {
        return [
          ...st,
          {
            student_id,
            class_id,
          },
        ];
      });
      setPresentStudents((st) => {
        return st.filter((sts) => sts.student_id !== student_id);
      });
    } else {
      setAbsentStudents((st) => {
        return st.filter((sts) => sts.student_id !== student_id);
      });
      setPresentStudents((st) => {
        return [
          ...st,
          {
            student_id,
            class_id,
          },
        ];
      });
    }
  };
  const isHoliday = holidays.some((h) => {
    return isSameDay(h.date, date ? new Date(date) : new Date());
  });
  return (
    <div className="sm:p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h3 className="hidden md:block">Mark Attendance</h3>
        <p className="text-muted-foreground hidden md:block">
          Select a class and date to mark students as Present or Absent
        </p>
      </div>

      <Card className="rounded-xl w-full sm:w-auto">
        <CardHeader className="flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Attendance Marking
            </CardTitle>
            <CardDescription>Click on student to mark absent</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-min">
            <Select
              name="class"
              value={selectedClass}
              onValueChange={setSelectedClass}
            >
              <SelectTrigger className="w-min flex-1 h-full">
                <SelectValue placeholder="Choose class" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(studentsByClass).map((class_name) => (
                  <SelectItem key={class_name} value={class_name}>
                    {class_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePicker
              value={date}
              onChange={(e) => {
                const formattedDate = formatDateLocal(e!);
                router.replace(`/school/attendance?date=${formattedDate}`);
              }}
              notAllowedDates={holidays.map((h) => h.date)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedClass && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents
                    .sort((a, b) => {
                      const rollA = Number(a.rollnumber);
                      const rollB = Number(b.rollnumber);
                      if (!isNaN(rollA) && !isNaN(rollB)) {
                        return rollA - rollB;
                      }
                      return a.rollnumber.localeCompare(b.rollnumber);
                    })
                    .map((student) => (
                      <TableRow
                        onClick={() =>
                          toggleAttendance({
                            class_id: student.class_id,
                            student_id: student._id,
                          })
                        }
                        className={cn(
                          "cursor-pointer",
                          !!absentStudents.find(
                            (st) => st.student_id == student._id
                          ) && "bg-destructive/40  hover:bg-destructive/40"
                        )}
                        key={student._id}
                      >
                        <TableCell className="font-medium">
                          {student.rollnumber}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          {student.absentDays}/{totalDays}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
        <CardFooter>
          {" "}
          <Button
            disabled={isHoliday}
            onClick={UploadAttendance}
            className="cursor-pointer w-full"
          >
            Save Attendance
          </Button>
        </CardFooter>
      </Card>
      <h3></h3>
    </div>
  );
}
