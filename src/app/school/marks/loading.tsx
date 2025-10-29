import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function MarksPageSkeleton() {
  return (
    <div className="p-2 md:p-6 space-y-6 overflow-y-auto">
      <div className="sm:flex items-center justify-between hidden">
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
            <div className="flex md:items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-64 mt-1" />
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>
                  <Button disabled>Save all</Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      disabled
                      className="w-16 text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Button disabled variant="link">
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default MarksPageSkeleton;
