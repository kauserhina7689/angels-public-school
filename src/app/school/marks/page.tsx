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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpen } from "lucide-react";

const examTypes = [
  "Unit Test 1",
  "Unit Test 2",
  "Unit Test 3",
  "Unit Test 4",
  "Half-Yearly Exam",
  "Final Exam",
];

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
];

const students = [
  { id: 1, name: "John Smith", rollNo: "10A001", class: "10A" },
  { id: 2, name: "Emma Johnson", rollNo: "10A002", class: "10A" },
  { id: 3, name: "Michael Brown", rollNo: "10B001", class: "10B" },
  { id: 4, name: "Sarah Davis", rollNo: "10B002", class: "10B" },
];

const marksData = [
  {
    id: 1,
    studentName: "John Smith",
    rollNo: "10A001",
    class: "10A",
    subject: "Mathematics",
    examType: "Unit Test 1",
    marks: 85,
    maxMarks: 100,
  },
  {
    id: 2,
    studentName: "Emma Johnson",
    rollNo: "10A002",
    class: "10A",
    subject: "Physics",
    examType: "Unit Test 1",
    marks: 92,
    maxMarks: 100,
  },
  {
    id: 3,
    studentName: "John Smith",
    rollNo: "10A001",
    class: "10A",
    subject: "Chemistry",
    examType: "Half-Yearly Exam",
    marks: 78,
    maxMarks: 100,
  },
];

export default function MarksPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");

  const filteredMarks = marksData.filter((mark) => {
    const matchesClass =
      selectedClass === "all" || mark.class === selectedClass;
    const matchesExam =
      selectedExam === "all" || mark.examType === selectedExam;
    return matchesClass && matchesExam;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add/View Marks</h1>
          <p className="text-muted-foreground">
            Enter and edit marks for different exams and view marks per class
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Marks
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Student Marks</DialogTitle>
              <DialogDescription>
                Enter marks for a student in a specific subject and exam.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem
                        key={student.id}
                        value={student.id.toString()}
                      >
                        {student.name} - {student.rollNo} ({student.class})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((exam) => (
                      <SelectItem key={exam} value={exam}>
                        {exam}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks Obtained</Label>
                  <Input
                    id="marks"
                    type="number"
                    placeholder="85"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMarks">Maximum Marks</Label>
                  <Input
                    id="maxMarks"
                    type="number"
                    placeholder="100"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 rounded-xl">Add Marks</Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl bg-transparent"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Student Marks</CardTitle>
                <CardDescription>
                  View and manage marks for all exams
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="9A">Class 9A</SelectItem>
                  <SelectItem value="9B">Class 9B</SelectItem>
                  <SelectItem value="10A">Class 10A</SelectItem>
                  <SelectItem value="10B">Class 10B</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-48 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {examTypes.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Type</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarks.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.studentName}
                  </TableCell>
                  <TableCell>{record.rollNo}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>{record.examType}</TableCell>
                  <TableCell>
                    {record.marks}/{record.maxMarks}
                  </TableCell>
                  <TableCell>
                    {Math.round((record.marks / record.maxMarks) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
