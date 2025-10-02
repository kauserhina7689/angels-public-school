"use client";

import { Button } from "@/components/ui/button";
import { Edit, Users } from "lucide-react";
import React from "react";

function Class({
  cls,
}: {
  cls: {
    session: string;
    class_name: string;
    _id: string;
    students: string[];
    subjects: {
      name: string;
      _id: string;
    }[];
  };
}) {
  return (
    <div className="grow flex items-center justify-end gap-3">
      <span className="flex items-center text-muted-foreground">
        <Users className="h-6 w-6 p-1 aspect-square" />
        {cls.students.length}
      </span>
      <Button variant={"ghost"}>
        <Edit />
      </Button>
    </div>
  );
}

export default Class;
