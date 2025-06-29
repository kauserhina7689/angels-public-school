"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X, CalendarDays, List } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const attendanceData = [
  { date: "2024-01-22", status: "present" },
  { date: "2024-01-21", status: "present" },
  { date: "2024-01-20", status: "absent" },
  { date: "2024-01-19", status: "present" },
  { date: "2024-01-18", status: "present" },
  { date: "2024-01-17", status: "present" },
  { date: "2024-01-16", status: "absent" },
  { date: "2024-01-15", status: "present" },
  { date: "2024-01-14", status: "present" },
  { date: "2024-01-13", status: "present" },
  { date: "2024-01-12", status: "present" },
  { date: "2024-01-11", status: "absent" },
  { date: "2024-01-10", status: "present" },
  { date: "2024-01-09", status: "present" },
  { date: "2024-01-08", status: "present" },
  { date: "2024-02-05", status: "present" },
  { date: "2024-02-04", status: "absent" },
  { date: "2024-02-03", status: "present" },
  { date: "2024-02-02", status: "present" },
  { date: "2024-02-01", status: "present" },
];

export default function StudentAttendancePage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");

  const monthsAvailable = [
    ...new Set(attendanceData.map((a) => a.date.slice(0, 7))),
  ];

  const filteredAttendance = useMemo(
    () => attendanceData.filter((a) => a.date.startsWith(selectedMonth)),
    [selectedMonth]
  );

  const totalDays = filteredAttendance.length;
  const presentDays = filteredAttendance.filter(
    (a) => a.status === "present"
  ).length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">
          View your daily attendance by month
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {attendancePercentage}%
            </div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {presentDays}
            </div>
            <p className="text-sm text-muted-foreground">Days attended</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Absent Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{absentDays}</div>
            <p className="text-sm text-muted-foreground">Days missed</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalDays}</div>
            <p className="text-sm text-muted-foreground">School days</p>
          </CardContent>
        </Card>
      </div>
      {/* place month selection here  */}

      {/* place month selection here */}
      <div className="flex items-center p-1 justify-between">
        <p>Select Month</p>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-44 rounded-xl">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {monthsAvailable.map((month) => (
              <SelectItem key={month} value={month}>
                {new Date(month + "-01").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Card */}
      <Card className="rounded-xl">
        <CardHeader className="space-y-4">
          {/* Top Section: Title & Month Selector */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Attendance Record</CardTitle>
                <CardDescription>
                  Records for{" "}
                  {new Date(selectedMonth + "-01").toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardDescription>
              </div>
            </div>
            {/* <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-44 rounded-xl">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthsAvailable.map((month) => (
                  <SelectItem key={month} value={month}>
                    {new Date(month + "-01").toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 justify-end">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-xl"
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="rounded-xl"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Calendar View
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === "list" ? (
            <div className="space-y-3">
              {filteredAttendance.length === 0 ? (
                <p className="text-muted-foreground">
                  No attendance data for this month.
                </p>
              ) : (
                filteredAttendance.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                  >
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <Badge
                      variant="outline"
                      className={`rounded-xl ${
                        record.status === "present"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {record.status === "present" ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Present
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Absent
                        </>
                      )}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {filteredAttendance.map((record, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl text-center text-sm ${
                    record.status === "present"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div className="font-medium">
                    {new Date(record.date).getDate()}
                  </div>
                  <div className="text-xs">
                    {record.status === "present" ? "P" : "A"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
