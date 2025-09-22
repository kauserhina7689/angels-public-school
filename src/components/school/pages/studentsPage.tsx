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
import { Search, Users, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddStudentForm from "@/components/school/modals/addStudentForm";
import "@/server/DB/models/Class";
import { AvatarImage } from "@radix-ui/react-avatar";
import { getPopulatedClasses } from "@/server/actions/school/getClasses";

function StudentsPage({
  classes: populatedClasses,
}: {
  classes: Awaited<ReturnType<typeof getPopulatedClasses>>;
}) {
  const [query, setQuery] = useState("");
  const handleReset = () => {
    setQuery("");
  };
  const classes = populatedClasses.map(({ _id, session, class_name }) => ({
    _id,
    session,
    class_name,
  }));

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
          <AddStudentForm classes={classes} />
        </div>
      </div>

      <div className="space-y-10">
        {populatedClasses.map(({ class_name, students }) => (
          <div key={class_name}>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {class_name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {students!.filter(
                (student) =>
                  student.name.toLowerCase().includes(query.toLowerCase()) ||
                  student.rollnumber
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                  student.fatherName
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                  class_name.toLowerCase().includes(query.toLowerCase())
              ).length == 0 ? (
                <Card className="col-span-full border-none shadow-none flex items-center justify-center p-10">
                  <CardContent className="flex flex-col items-center text-muted-foreground">
                    <Users className="h-10 w-10 mb-3 opacity-60" />
                    <p>
                      {!query
                        ? "No student in this class"
                        : "No students found for the current search in this class"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {students!
                    .filter(
                      (student) =>
                        student.name
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                        student.rollnumber
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                        student.fatherName
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                        class_name.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((student) => (
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
                                <strong>Class:</strong> {class_name}
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
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentsPage;
