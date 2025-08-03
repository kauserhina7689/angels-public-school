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

function StudentsPage({ students }: { students: FilteredStudentType[] }) {
  const [query, setQuery] = useState("");
  const handleReset = () => {
    setQuery("");
  };
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.rollnumber.toLowerCase().includes(query.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(query.toLowerCase())
  );
  const studentsByClass = filteredStudents!.reduce((acc, student) => {
    if (!acc[student.class_name]) acc[student.class_name] = [];
    acc[student.class_name]!.push(student);
    return acc;
  }, {} as Record<string, typeof students>);
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <AddStudentForm />
      </div>

      <div className="space-y-10">
        {Object.entries(studentsByClass).map(([className, classStudents]) => (
          <div key={className}>
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
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
                      <Avatar className="h-8 w-8 ">
                        {/* <AvatarImage src="/placeholder.svg?height=32&width=32" /> */}
                        <AvatarFallback className=" text-white text-sm bg-gradient-to-r from-indigo-600 to-purple-600">
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
