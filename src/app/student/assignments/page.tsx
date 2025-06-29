import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";

// 🧠 New grouped format
const dailyHomework = [
  {
    date: "2024-01-15",
    homework: [
      {
        subject: "Mathematics",
        title: "Quadratic Equations Problem Set",
        description:
          "Solve 20 quadratic equations using different methods including factoring, completing the square, and quadratic formula.",
        hasFile: true,
      },
      {
        subject: "Physics",
        title: "Newton's Laws Lab Report",
        description:
          "Write a detailed lab report on Newton's three laws of motion experiment.",
        hasFile: false,
      },
    ],
  },
  {
    date: "2024-01-12",
    homework: [
      {
        subject: "English",
        title: "Shakespeare Essay Analysis",
        description:
          "Write a 750-word analytical essay on the themes of love and conflict in Romeo and Juliet.",
        hasFile: true,
      },
      {
        subject: "Chemistry",
        title: "Organic Chemistry Worksheet",
        description:
          "Complete the worksheet on organic chemistry reactions with mechanisms.",
        hasFile: true,
      },
    ],
  },
];

export default function StudentAssignmentsPage() {
  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-3xl font-bold">Daily Homework</h1>
        <p className="text-muted-foreground">
          Review homework assigned for each subject by date
        </p>
      </div>

      {dailyHomework.map(({ date, homework }) => (
        <Card key={date} className="rounded-xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {new Date(date).toLocaleDateString()}
              </CardTitle>
            </div>
            <CardDescription>
              {homework.length} subject{homework.length > 1 ? "s" : ""} assigned
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {homework.map((task, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4 bg-muted/30 p-4 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      {task.subject}: {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  </div>
                </div>
                {task.hasFile && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="w-4 h-4 mr-1" />
                    File
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
