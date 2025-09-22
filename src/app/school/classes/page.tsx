import AddClassDialog from "@/components/school/modals/addClass";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClasses } from "@/server/actions/school/getClasses";
import { Edit, Users } from "lucide-react";
import React from "react";

async function ClassesPage() {
  const classes = await getClasses();
  const subjects = [
    {
      _id: "66f4a2b8e92a4c001f8d9a01",
      subject_name: "Mathematics",
      class_id: "66f4a2b8e92a4c001f8d9b07",
    },
    {
      _id: "66f4a2b8e92a4c001f8d9a02",
      subject_name: "Science",
      class_id: "66f4a2b8e92a4c001f8d9b07",
    },
    {
      _id: "66f4a2b8e92a4c001f8d9a03",
      subject_name: "English",
      class_id: "66f4a2b8e92a4c001f8d9b07",
    },
    {
      _id: "66f4a2b8e92a4c001f8d9a04",
      subject_name: "History",
      class_id: "66f4a2b8e92a4c001f8d9b08",
    },
    {
      _id: "66f4a2b8e92a4c001f8d9a05",
      subject_name: "Geography",
      class_id: "66f4a2b8e92a4c001f8d9b08",
    },
  ];

  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <header className="flex border-b z-10 pb-2 sticky top-0  flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Classes</h1>
          <p className="text-muted-foreground">
            View class and add new classes or subjects
          </p>
        </div>
        <AddClassDialog />
      </header>
      {classes.length == 0 ? (
        <Card className="col-span-full h-[40svh] border-none shadow-none flex items-center justify-center p-10">
          <CardContent className="flex flex-col items-center text-muted-foreground">
            <Users className="h-10 w-10 mb-3 opacity-60" />
            <p>No classes added for the current session</p>
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
                    <Button variant={"ghost"}>
                      <Edit />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge
                      variant={"outline"}
                      className="rounded-full bg-primary/40 border-primary"
                      key={subject._id}
                    >
                      {subject.subject_name}
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
