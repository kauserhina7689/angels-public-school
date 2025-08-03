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
import { FilteredStudentType } from "@/server/actions/admin/students";
import { cn, formatDateLocal } from "@/lib/utils";
import { toast } from "sonner";
import { addAttendanceAction } from "@/server/actions/admin/attendance";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// import { DatePicker } from "@/components/common/DatePicker";
const DatePicker = dynamic(() => import("@/components/common/DatePicker"), {
  ssr: false,
});

export default function AttendancePage({
  studentsByClass,
  attendance,
  date,
}: {
  studentsByClass: Record<string, FilteredStudentType[]>;
  attendance: {
    class_id: string;
    student_id: string;
  }[];
  date?: string;
}) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = React.useState("Class I");
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

  const filteredStudents = studentsByClass[selectedClass] || [];

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
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again..",
        id,
      });
    }
  }

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

  return (
    <div className="sm:p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">
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
                    <TableHead>Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
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
                      <TableCell>{student.class_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
        <CardFooter>
          {" "}
          <Button onClick={UploadAttendance} className="cursor-pointer w-full">
            Save Attendance
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
