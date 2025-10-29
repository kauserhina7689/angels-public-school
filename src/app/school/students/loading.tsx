import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function StudentsPageSkeleton() {
  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <div className="flex border-b z-10 pb-2 sticky top-0 flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-48 mb-2 hidden md:block" />
          <Skeleton className="h-5 w-80 hidden md:block" />
        </div>

        <form className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            disabled
            className="pl-10 rounded-xl"
          />
        </form>
        <div className="flex items-center gap-4 grow md:justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="space-y-10">
        {[1, 2, 3].map((classIndex) => (
          <div key={classIndex}>
            <div className="flex items-center mb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-12 ml-5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((studentIndex) => (
                <Card key={studentIndex} className="rounded-xl shadow-sm">
                  <CardHeader>
                    <div className="flex space-x-4 items-center">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-gray-200">
                          <Skeleton className="h-full w-full rounded-full" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Button variant="ghost" disabled>
                        <Skeleton className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentsPageSkeleton;
