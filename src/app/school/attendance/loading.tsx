import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendancePageSkeleton() {
  return (
    <div className="sm:p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <Skeleton className="h-7 w-48 mb-2 hidden md:block" />
        <Skeleton className="h-5 w-96 hidden md:block" />
      </div>

      <Card className="rounded-xl w-full sm:w-auto">
        <CardHeader className="flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64 mt-1" />
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-min">
            <Skeleton className="h-10 w-32 flex-1 sm:flex-none" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button disabled className="cursor-pointer w-full">
            Save Attendance
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
