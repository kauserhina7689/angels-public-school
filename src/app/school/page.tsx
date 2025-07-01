"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const dashboardStats = {
  totalStudents: 156,
  totalTeachers: 12,
  totalClasses: 8,
  activeAssignments: 15,
  attendanceRate: 92,
  pendingSubmissions: 45,
};
const upcomingAssignments = [
  {
    id: 1,
    title: "Quadratic Equations Problem Set",
    subject: "Mathematics",
    dueDate: "2024-01-25",
    status: "pending",
    daysLeft: 5,
  },
  {
    id: 2,
    title: "Cell Division Diagram",
    subject: "Biology",
    dueDate: "2024-01-28",
    status: "pending",
    daysLeft: 8,
  },
  {
    id: 3,
    title: "Newton's Laws Lab Report",
    subject: "Physics",
    dueDate: "2024-01-30",
    status: "pending",
    daysLeft: 10,
  },
];
const recentActivities = [
  {
    id: 1,
    type: "assignment",
    message: "New assignment created for Class 10A - Mathematics",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "attendance",
    message: "Attendance marked for Class 9B",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "marks",
    message: "Marks updated for Physics Mid-term exam",
    time: "6 hours ago",
  },
  {
    id: 4,
    type: "student",
    message: "New student enrolled - Ashley Miller (11A)",
    time: "1 day ago",
  },
  {
    id: 5,
    type: "assignment",
    message: "Assignment submitted by 15 students in Class 10B",
    time: "1 day ago",
  },
];

const classPerformance = [
  { class: "9A", students: 17, avgAttendance: 89, avgMarks: 78 },
  { class: "9B", students: 16, avgAttendance: 94, avgMarks: 82 },
  { class: "10A", students: 20, avgAttendance: 91, avgMarks: 85 },
  { class: "10B", students: 19, avgAttendance: 96, avgMarks: 88 },
  { class: "11A", students: 18, avgAttendance: 93, avgMarks: 86 },
  { class: "11B", students: 22, avgAttendance: 90, avgMarks: 84 },
];

export default function SchoolDashboard() {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">School Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm">Total Students</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-center sm:text-left font-bold text-blue-600">
              {dashboardStats.totalStudents}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-green-600" />
              <CardTitle className="text-sm">Teachers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-center sm:text-left font-bold text-green-600">
              {dashboardStats.totalTeachers}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-sm">Classes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-center sm:text-left font-bold text-purple-600">
              {dashboardStats.totalClasses}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-sm">Attendance Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-center sm:text-left font-bold text-emerald-600">
              {dashboardStats.attendanceRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates and activities in your school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Today&apos;s Assignments
            </CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-sm">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.subject}
                    </p>
                  </div>
                  {/* <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`rounded-2xl text-xs mb-1 ${
                        assignment.daysLeft <= 3
                          ? "bg-red-50 text-red-700 border-red-200"
                          : assignment.daysLeft <= 7
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {assignment.daysLeft} days left
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Due: 25/01/2024
                    </p>
                  </div> */}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 rounded-2xl" variant="outline">
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Overview */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Class Performance Overview
          </CardTitle>
          <CardDescription>
            Academic performance and attendance statistics by class
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Avg Attendance</TableHead>
                <TableHead>Avg Marks</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classPerformance.map((classData) => (
                <TableRow key={classData.class}>
                  <TableCell className="font-medium">
                    {classData.class}
                  </TableCell>
                  <TableCell>{classData.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${classData.avgAttendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {classData.avgAttendance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${classData.avgMarks}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{classData.avgMarks}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-2xl ${
                        classData.avgMarks >= 85
                          ? "bg-green-50 text-green-700 border-green-200"
                          : classData.avgMarks >= 75
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {classData.avgMarks >= 85
                        ? "Excellent"
                        : classData.avgMarks >= 75
                        ? "Good"
                        : "Needs Improvement"}
                    </Badge>
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
