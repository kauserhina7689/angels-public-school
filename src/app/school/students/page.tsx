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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const students = [
  // 9A
  {
    id: 1,
    name: "James Wilson",
    rollNo: "9A001",
    class: "9A",
    email: "james@school.com",
  },
  {
    id: 2,
    name: "Lisa Anderson",
    rollNo: "9A002",
    class: "9A",
    email: "lisa@school.com",
  },
  {
    id: 3,
    name: "Sophie Turner",
    rollNo: "9A003",
    class: "9A",
    email: "sophie@school.com",
  },
  {
    id: 4,
    name: "Ryan Thomas",
    rollNo: "9A004",
    class: "9A",
    email: "ryan@school.com",
  },

  // 9B
  {
    id: 5,
    name: "David Martinez",
    rollNo: "9B001",
    class: "9B",
    email: "david@school.com",
  },
  {
    id: 6,
    name: "Jennifer Taylor",
    rollNo: "9B002",
    class: "9B",
    email: "jennifer@school.com",
  },
  {
    id: 7,
    name: "Ethan Lewis",
    rollNo: "9B003",
    class: "9B",
    email: "ethan@school.com",
  },
  {
    id: 8,
    name: "Olivia Walker",
    rollNo: "9B004",
    class: "9B",
    email: "olivia@school.com",
  },

  // 10A
  {
    id: 9,
    name: "John Smith",
    rollNo: "10A001",
    class: "10A",
    email: "john@school.com",
  },
  {
    id: 10,
    name: "Emma Johnson",
    rollNo: "10A002",
    class: "10A",
    email: "emma@school.com",
  },
  {
    id: 11,
    name: "Nathan Scott",
    rollNo: "10A003",
    class: "10A",
    email: "nathan@school.com",
  },
  {
    id: 12,
    name: "Grace Clark",
    rollNo: "10A004",
    class: "10A",
    email: "grace@school.com",
  },

  // 10B
  {
    id: 13,
    name: "Michael Brown",
    rollNo: "10B001",
    class: "10B",
    email: "michael@school.com",
  },
  {
    id: 14,
    name: "Sarah Davis",
    rollNo: "10B002",
    class: "10B",
    email: "sarah@school.com",
  },
  {
    id: 15,
    name: "Zoe Harris",
    rollNo: "10B003",
    class: "10B",
    email: "zoe@school.com",
  },
  {
    id: 16,
    name: "Henry Moore",
    rollNo: "10B004",
    class: "10B",
    email: "henry@school.com",
  },

  // 11A
  {
    id: 17,
    name: "Liam Baker",
    rollNo: "11A001",
    class: "11A",
    email: "liam@school.com",
  },
  {
    id: 18,
    name: "Ava Turner",
    rollNo: "11A002",
    class: "11A",
    email: "ava@school.com",
  },
  {
    id: 19,
    name: "Lucas Perez",
    rollNo: "11A003",
    class: "11A",
    email: "lucas@school.com",
  },
  {
    id: 20,
    name: "Mia Reed",
    rollNo: "11A004",
    class: "11A",
    email: "mia@school.com",
  },

  // 11B
  {
    id: 21,
    name: "Noah Rivera",
    rollNo: "11B001",
    class: "11B",
    email: "noah@school.com",
  },
  {
    id: 22,
    name: "Chloe Murphy",
    rollNo: "11B002",
    class: "11B",
    email: "chloe@school.com",
  },
  {
    id: 23,
    name: "Logan Jenkins",
    rollNo: "11B003",
    class: "11B",
    email: "logan@school.com",
  },
  {
    id: 24,
    name: "Ella Brooks",
    rollNo: "11B004",
    class: "11B",
    email: "ella@school.com",
  },
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentsByClass = filteredStudents.reduce((acc, student) => {
    if (!acc[student.class]) acc[student.class] = [];
    acc[student.class].push(student);
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

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  placeholder="e.g., 10A001"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {["9A", "9B", "10A", "10B", "11A", "11B"].map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Example@school.com"
                  className="rounded-xl"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 rounded-xl">Create Account</Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-10">
        {Object.entries(studentsByClass).map(([className, classStudents]) => (
          <div key={className}>
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {className} Class
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {classStudents.map((student) => (
                <Card
                  key={student.id}
                  className="rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <CardHeader>
                    <div className="flex space-x-4 items-center">
                      <Avatar className="h-8 w-8 ">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className=" text-white text-sm bg-gradient-to-r from-indigo-600 to-purple-600">
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {student.name}
                        </CardTitle>
                        <CardDescription>
                          <strong>Class:</strong> {student.class}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="flex justify-between">
                      <strong>Roll No:</strong> {student.rollNo}
                    </p>
                    <p className="flex justify-between">
                      <strong>Email:</strong> {student.email}
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
