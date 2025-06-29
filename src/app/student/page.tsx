import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Target,
} from "lucide-react";

const studentData = {
  name: "Student name",
  class: "10A",
  rollNo: "01",
  overallGrade: "A",
  overallPercentage: 85,
  attendanceRate: 92,
  totalSubjects: 5,
  completedAssignments: 12,
  pendingAssignments: 3,
};

const recentGrades = [
  {
    subject: "Mathematics",
    marks: 85,
    maxMarks: 100,
    grade: "A",
    examType: "Mid-term",
    date: "2024-01-15",
  },
  {
    subject: "Physics",
    marks: 78,
    maxMarks: 100,
    grade: "B+",
    examType: "Quiz",
    date: "2024-01-12",
  },
  {
    subject: "Chemistry",
    marks: 92,
    maxMarks: 100,
    grade: "A+",
    examType: "Lab Test",
    date: "2024-01-10",
  },
  {
    subject: "Biology",
    marks: 88,
    maxMarks: 100,
    grade: "A",
    examType: "Assignment",
    date: "2024-01-08",
  },
];

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

const weeklyAttendance = [
  { day: "Monday", status: "present" },
  { day: "Tuesday", status: "present" },
  { day: "Wednesday", status: "absent" },
  { day: "Thursday", status: "present" },
  { day: "Friday", status: "present" },
];

const subjectProgress = [
  { subject: "Mathematics", progress: 85, grade: "A" },
  { subject: "Physics", progress: 78, grade: "B+" },
  { subject: "Chemistry", progress: 92, grade: "A+" },
  { subject: "Biology", progress: 88, grade: "A" },
  { subject: "English", progress: 82, grade: "A" },
];

export default function StudentDashboard() {
  return (
    <div className="p-4 space-y-6 h-full w-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {studentData.name}!
        </h1>
        <p className="text-muted-foreground">
          Class {studentData.class} • Roll No: {studentData.rollNo}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="rounded-2xl relative">
          <div className="absolute hidden md:block top-6 bottom-6 right-6">
            <img src="images/grade.svg" className="max-h-full" alt="" />
          </div>
          <CardHeader className="pb-3 z-10">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-sm">Overall Grade</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-yellow-600">
              {studentData.overallGrade}
            </div>
            <p className="text-sm text-muted-foreground">
              {studentData.overallPercentage}% Average
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl relative">
          <CardHeader className="pb-3 z-10">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <CardTitle className="text-sm">Attendance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-green-600">
              {studentData.attendanceRate}%
            </div>
            <p className="text-sm text-muted-foreground">This semester</p>
          </CardContent>{" "}
          <div className="absolute hidden  md:block top-6 bottom-6 right-6">
            <img src="images/attendance.svg" className="max-h-full" alt="" />
          </div>
        </Card>

        {/* <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm">Completed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {studentData.completedAssignments}
            </div>
            <p className="text-sm text-muted-foreground">Assignments</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-sm">Pending</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {studentData.pendingAssignments}
            </div>
            <p className="text-sm text-muted-foreground">Assignments</p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Recent Grades
            </CardTitle>
            <CardDescription>
              Your latest test and assignment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-sm">{grade.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {grade.examType} • {grade.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {grade.marks}/{grade.maxMarks}
                      </span>
                      <Badge
                        variant="outline"
                        className={`rounded-2xl text-xs ${
                          grade.grade === "A+"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : grade.grade === "A"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {grade.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Weekly Attendance */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              This Week&apos;s Attendance
            </CardTitle>
            <CardDescription>
              Your attendance record for this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyAttendance.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <span className="font-medium text-sm">{day.day}</span>
                  <Badge
                    variant="outline"
                    className={`rounded-2xl ${
                      day.status === "present"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {day.status === "present" ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Present
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Absent
                      </>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
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
        {/* Subject Progress */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Subject Progress
            </CardTitle>
            <CardDescription>
              Syllabus completed in all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {subject.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{subject.progress}%</span>
                      <Badge
                        variant="outline"
                        className={`rounded-2xl text-xs ${
                          subject.grade === "A+"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : subject.grade === "A"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {subject.grade}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
