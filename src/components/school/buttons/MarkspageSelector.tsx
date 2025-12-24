"use client";

import { useEffect, useState } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BookOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { examTypes } from "@/lib/utils";

function MarkspageSelector({
  classes,
  currentClass,
  currentSubject,
}: {
  classes: {
    session: string;
    class_name: string;
    _id: string;
    students: string[];
    subjects: {
      name: string;
      _id: string;
    }[];
  }[];
  currentClass: string;
  currentSubject: string;
}) {
  const [selectedClass, setSelectedClass] = useState(
    currentClass || classes[0]._id
  );
  const [selectedExam, setSelectedExam] = useState("unitTest1");
  const subjects = classes.find((c) => c._id == selectedClass)!.subjects;
  const subject =
    subjects.find((s) => s._id == currentSubject)?._id ||
    subjects![0]?._id ||
    "";
  const [selectedSubject, setSelectedSubject] = useState(subject);

  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    setSelectedSubject(
      classes.find((c) => c._id == selectedClass)?.subjects[0]?._id || ""
    );
  }, [selectedClass, classes]);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("classname", selectedClass);

    params.set("exam", selectedExam);
    const subs = classes.find((c) => c._id == selectedClass)!.subjects;
    const sub =
      subs.find((s) => s._id == selectedSubject)?._id || subjects[0]._id;
    params.set("subject", sub);

    router.replace(`?${params.toString()}`);
  }, [selectedClass, selectedExam, selectedSubject]);

  return (
    <CardHeader>
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div className="flex md:items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle>Student Marks</CardTitle>
            <CardDescription>
              View and manage marks for all exams
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-min rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Classes</SelectLabel>
                {classes.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.class_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-min rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Subjects</SelectLabel>
                {subjects.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-min rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Examination</SelectLabel>
                {Object.entries(examTypes).map(([exam, examString]) => (
                  <SelectItem key={exam} value={exam}>
                    {examString}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
  );
}

export default MarkspageSelector;
