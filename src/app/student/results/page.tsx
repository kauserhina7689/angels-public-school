import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen } from "lucide-react";

const marksData = [
  {
    id: 1,
    subject: "Mathematics",
    examType: "Unit Test 1",
    marks: 85,
    maxMarks: 100,
    percentage: 85,
  },
  {
    id: 2,
    subject: "Physics",
    examType: "Unit Test 1",
    marks: 78,
    maxMarks: 100,
    percentage: 78,
  },
  {
    id: 3,
    subject: "Chemistry",
    examType: "Unit Test 1",
    marks: 92,
    maxMarks: 100,
    percentage: 92,
  },
  {
    id: 4,
    subject: "Mathematics",
    examType: "Unit Test 2",
    marks: 88,
    maxMarks: 100,
    percentage: 88,
  },
  {
    id: 5,
    subject: "Physics",
    examType: "Half-Yearly Exam",
    marks: 82,
    maxMarks: 100,
    percentage: 82,
  },
  {
    id: 6,
    subject: "Chemistry",
    examType: "Half-Yearly Exam",
    marks: 89,
    maxMarks: 100,
    percentage: 89,
  },
];

// const examTypes = [
//   "Unit Test 1",
//   "Unit Test 2",
//   "Unit Test 3",
//   "Unit Test 4",
//   "Half-Yearly Exam",
//   "Final Exam",
// ];

export default function StudentMarksPage() {
  const groupedMarks = marksData.reduce((acc, mark) => {
    if (!acc[mark.examType]) acc[mark.examType] = [];
    acc[mark.examType].push(mark);
    return acc;
  }, {} as Record<string, typeof marksData>);

  const visibleExamTypes = Object.keys(groupedMarks);

  const totalMarks = marksData.reduce((sum, m) => sum + m.marks, 0);
  const totalMaxMarks = marksData.reduce((sum, m) => sum + m.maxMarks, 0);
  const overallPercentage =
    totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 100) : 0;

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">My Marks</h1>
        <p className="text-muted-foreground">
          View your marks for each subject and exam
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {overallPercentage}%
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalMarks}
            </div>
            <p className="text-sm text-muted-foreground">/ {totalMaxMarks}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>My Results</CardTitle>
                <CardDescription>
                  Exam-wise breakdown of subject marks
                </CardDescription>
              </div>
            </div>
            {/* <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {examTypes.map((exam) => (
                  <SelectItem key={exam} value={exam}>
                    {exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          {visibleExamTypes.map((examType) => {
            const entries = groupedMarks[examType] || [];
            if (entries.length === 0) return null;

            const examTotal = entries.reduce((sum, m) => sum + m.marks, 0);
            const examMax = entries.reduce((sum, m) => sum + m.maxMarks, 0);

            return (
              <div key={examType}>
                <h2 className="text-xl font-semibold mb-2 text-blue-700">
                  {examType}
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Max</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((mark) => (
                      <TableRow key={mark.id}>
                        <TableCell className="font-medium">
                          {mark.subject}
                        </TableCell>
                        <TableCell>{mark.marks}</TableCell>
                        <TableCell>{mark.maxMarks}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full hidden sm:block h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${mark.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {mark.percentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-xl text-xs font-medium ${
                              mark.percentage >= 90
                                ? "bg-green-100 text-green-800"
                                : mark.percentage >= 80
                                ? "bg-blue-100 text-blue-800"
                                : mark.percentage >= 70
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {mark.percentage >= 90
                              ? "Excellent"
                              : mark.percentage >= 80
                              ? "Good"
                              : mark.percentage >= 70
                              ? "Average"
                              : "Needs Improvement"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex justify-between sm:justify-end space-x-3 text-sm font-semibold text-muted-foreground mt-2">
                  <p> Total:</p>{" "}
                  <p className="text-card-foreground">
                    {examTotal}/{examMax}
                  </p>
                </div>
                <div className="flex justify-between sm:justify-end space-x-3 text-sm font-semibold text-muted-foreground">
                  <p>Percentage:</p>{" "}
                  <p className="text-card-foreground">
                    {(examTotal / examMax) * 100} %
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
