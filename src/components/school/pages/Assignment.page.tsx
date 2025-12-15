"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FileText, Calendar } from "lucide-react";
import { getClasses } from "@/server/actions/school/getClasses";
import AddAssignmentForm from "../modals/addAssignment";
import { getAssignments } from "@/server/actions/school/assignment/getAssignmentsServer";
import { formatDistanceToNow } from "date-fns";
import DeleteAssignmentModal from "../modals/deleteAssignmentModal";

interface propsType {
  classes: Awaited<ReturnType<typeof getClasses>>;
  assignments: Awaited<ReturnType<typeof getAssignments>>;
}

export default function AssignmentsPage({ classes, assignments }: propsType) {
  const formattedClassesMap = useMemo(() => {
    return classes.reduce<Record<string, (typeof classes)[0]>>((map, cls) => {
      map[cls._id] = cls;
      return map;
    }, {});
  }, []);

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row items-center space-y-2 justify-between">
        <div>
          <h1 className="text-3xl font-bold">Send Assignments</h1>
          <p className="text-muted-foreground">
            Post assignments to a selected class with title, description, and
            optional file upload
          </p>
        </div>
        <AddAssignmentForm formattedClassesMap={formattedClassesMap} />
      </div>

      <div className="grid gap-6">
        {assignments.map((group) => (
          <Card
            key={group._id}
            className="rounded-xl shadow-md w-full max-w-full"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {group.class_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Posted:
                    {formatDistanceToNow(new Date(group.date), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
                <DeleteAssignmentModal _id={group._id} />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {group.assignments.map((assignment, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 bg-gray-50 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Subject: {assignment.subject}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm">
                    {assignment.description}
                  </p>

                  <div className="flex gap-2">
                    {assignment.file?.image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl bg-transparent"
                        onClick={() =>
                          window.open(assignment.file.image_url, "_blank")
                        }
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View File
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
