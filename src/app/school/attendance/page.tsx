"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Calendar } from "lucide-react";

const students = [
  { id: 1, name: "John Smith", rollNo: "10A001", class: "10A" },
  { id: 2, name: "Emma Johnson", rollNo: "10A002", class: "10A" },
  { id: 3, name: "Michael Brown", rollNo: "10B001", class: "10B" },
  { id: 4, name: "Sarah Davis", rollNo: "10B002", class: "10B" },
  { id: 5, name: "James Wilson", rollNo: "9A001", class: "9A" },
  { id: 6, name: "Lisa Anderson", rollNo: "9A002", class: "9A" },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState<
    Record<number, "present" | "absent">
  >({});

  const filteredStudents = students.filter(
    (student) => selectedClass === "" || student.class === selectedClass
  );

  const toggleAttendance = (studentId: number) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const markAllPresent = () => {
    const newAttendance: Record<number, "present" | "absent"> = {};
    filteredStudents.forEach((student) => {
      newAttendance[student.id] = "present";
    });
    setAttendance(newAttendance);
  };

  const saveAttendance = () => {
    // In a real app, this would save to a database
    alert(`Attendance saved for ${selectedClass} on ${selectedDate}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">
          Select a class and date to mark students as Present or Absent
        </p>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Attendance Marking
          </CardTitle>
          <CardDescription>
            Choose class and date to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9A">Class 9A</SelectItem>
                  <SelectItem value="9B">Class 9B</SelectItem>
                  <SelectItem value="10A">Class 10A</SelectItem>
                  <SelectItem value="10B">Class 10B</SelectItem>
                  <SelectItem value="11A">Class 11A</SelectItem>
                  <SelectItem value="11B">Class 11B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <Button
                onClick={markAllPresent}
                variant="outline"
                className="w-full rounded-xl bg-transparent"
                disabled={!selectedClass}
              >
                Mark All Present
              </Button>
            </div>
          </div>

          {selectedClass && (
            <>
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.rollNo}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-xl w-24 ${
                              attendance[student.id] === "present"
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : attendance[student.id] === "absent"
                                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => toggleAttendance(student.id)}
                          >
                            {attendance[student.id] === "present" ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Present
                              </>
                            ) : attendance[student.id] === "absent" ? (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Absent
                              </>
                            ) : (
                              "Mark"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveAttendance} className="rounded-xl">
                  Save Attendance
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
