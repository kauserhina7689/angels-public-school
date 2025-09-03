"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddStudentForm from "@/components/school/modals/addStudentForm";
import "@/server/DB/models/Class";
import { FilteredStudentType } from "@/server/actions/admin/students";
import { AvatarImage } from "@radix-ui/react-avatar";
import AddClassDialog from "../modals/addClass";

function StudentsPage({
  students,
  classes,
}: {
  students: FilteredStudentType[];
  classes: {
    batch: number;
    index: number;
    class_name: string;
    _id: string;
    students: string[];
  }[];
}) {
  const [query, setQuery] = useState("");
  const handleReset = () => {
    setQuery("");
  };
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.rollnumber.toLowerCase().includes(query.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(query.toLowerCase()) ||
      student.class_name.toLowerCase().includes(query.toLowerCase())
  );
  const studentsByClass = filteredStudents!.reduce((acc, student) => {
    if (!acc[student.class_name]) acc[student.class_name] = [];
    acc[student.class_name]!.push(student);
    return acc;
  }, {} as Record<string, typeof students>);

  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <div className="flex border-b z-10 pb-2 sticky top-0  flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Students</h1>
          <p className="text-muted-foreground">
            View students by class and add new student accounts
          </p>
        </div>

        <form className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
          {query && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute right-0 top-0 h-full px-1 text-stone-500"
            >
              <X className="h-full p-1" />
            </button>
          )}
        </form>
        <div className="flex items-center gap-4 grow  md:justify-end">
          <AddClassDialog />
          <AddStudentForm classes={classes} />
        </div>
      </div>

      <div className="space-y-10">
        {Object.entries(studentsByClass).map(([className, classStudents]) => (
          <div key={className}>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {className}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {classStudents!.map((student) => (
                <Card
                  key={student._id}
                  className="rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <CardHeader>
                    <div className="flex space-x-4 items-center">
                      <Avatar className="h-14 w-14 ">
                        <AvatarImage
                          src={student.image_url}
                          className="object-cover w-full h-full"
                        />
                        <AvatarFallback className=" text-white text-sm bg-primary">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {student.name}
                        </CardTitle>
                        <CardDescription>
                          <strong>Class:</strong> {student.class_name}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="flex justify-between">
                      <strong>Roll No:</strong> {student.rollnumber}
                    </p>
                    <p className="flex justify-between">
                      <strong>Father Name:</strong> {student.fatherName}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentsPage;
