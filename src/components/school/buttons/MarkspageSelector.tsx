"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---------- STATE ----------
  const [selectedClass, setSelectedClass] = useState(
    currentClass || classes[0]._id
  );

  const [selectedExam, setSelectedExam] = useState("unitTest1");

  // subjects for the selected class
  const subjects = useMemo(() => {
    return classes.find((c) => c._id === selectedClass)?.subjects ?? [];
  }, [classes, selectedClass]);

  // subject should always be valid for the selected class
  const [selectedSubject, setSelectedSubject] = useState(
    currentSubject || subjects[0]?._id || ""
  );

  // ---------- RESET SUBJECT WHEN CLASS CHANGES ----------
  useEffect(() => {
    if (!subjects.find((s) => s._id === selectedSubject)) {
      setSelectedSubject(subjects[0]?._id || "");
    }
  }, [subjects, selectedSubject]);

  // ---------- SYNC URL ----------
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("classname", selectedClass);
    params.set("exam", selectedExam);
    params.set("subject", selectedSubject);

    router.replace(`?${params.toString()}`);
  }, [selectedClass, selectedExam, selectedSubject]);

  // ---------- UI ----------
  return (
    <CardHeader>
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div className="flex md:items-center gap-3 border">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle>Student Marks</CardTitle>
            <CardDescription>
              View and manage marks for all exams
            </CardDescription>
          </div>
        </div>
        <Button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("class_id", selectedClass);

            router.replace(`/school/tabulation?${params.toString()}`);
          }}
        >
          Print tabulation
        </Button>

        <div className="flex gap-3 flex-wrap">
          {/* CLASS */}
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

          {/* SUBJECT */}
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

          {/* EXAM */}
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
