"use client";
import AddClassDialog from "@/components/school/modals/addClass";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
export interface classType {
  session: string;
  class_name: string;
  _id: string;
  students: string[];
  subjects: {
    name: string;
    _id: string;
  }[];
}

function ClassesPage({ classes }: { classes: classType[] }) {
  const [selectedClass, setSelectedClass] = useState<classType | null>(null);
  const searchParams = useSearchParams();
  const errMessage = searchParams.get("message");
  useEffect(() => {
    if (errMessage) toast.error(errMessage);
  }, [errMessage]);
  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <header className="flex border-b z-10 pb-2 sticky top-0  flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Classes</h1>
          <p className="text-muted-foreground">
            View class and add new classes or subjects
          </p>
        </div>
        <AddClassDialog
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
      </header>
      {classes.length == 0 ? (
        <Card className="col-span-full h-[40svh] border-none shadow-none flex items-center justify-center p-10">
          <CardContent className="flex flex-col items-center text-muted-foreground">
            <Users className="h-10 w-10 mb-3 opacity-60" />
            {errMessage ?? <p>No classes added for the current session</p>}
          </CardContent>
        </Card>
      ) : (
        <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {classes.map((cls) => (
            <Card key={cls._id}>
              <CardHeader>
                <CardTitle className="flex items-center ">
                  {cls.class_name}{" "}
                  <div className="grow flex items-center justify-end gap-3">
                    <span className="flex items-center text-muted-foreground">
                      <Users className="h-6 w-6 p-1 aspect-square" />
                      {cls.students.length}
                    </span>
                    <Button
                      onClick={() => setSelectedClass(cls)}
                      variant={"ghost"}
                    >
                      <Edit />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full flex-wrap gap-2">
                  {cls.subjects.map((subject) => (
                    <Badge
                      variant={"default"}
                      className="rounded-full"
                      key={subject._id}
                    >
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      )}
    </div>
  );
}

export default ClassesPage;
