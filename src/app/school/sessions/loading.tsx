import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function SessionsPageSkeleton() {
  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <header className="flex border-b z-10 pb-2 sticky top-0 flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-56 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </header>

      <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Skeleton className="h-6 w-32" />
                <div className="grow flex items-center justify-end gap-3">
                  <Button variant="ghost" size="icon" disabled>
                    <Skeleton className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

export default SessionsPageSkeleton;
