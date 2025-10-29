import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ClassesPageSkeleton() {
  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <header className="flex border-b z-10 pb-2 sticky top-0 flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-56 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </header>

      <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Skeleton className="h-6 w-24" />
                <div className="grow flex items-center justify-end gap-3">
                  <span className="flex items-center text-muted-foreground">
                    <Users className="h-6 w-6 p-1 aspect-square" />
                    <Skeleton className="h-5 w-6" />
                  </span>
                  <Button variant="ghost" disabled>
                    <Skeleton className="h-5 w-5" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex w-full flex-wrap gap-2">
                {[1, 2, 3, 4].map((subIndex) => (
                  <Badge
                    variant="default"
                    className="rounded-full"
                    key={subIndex}
                  >
                    <Skeleton className="h-4 w-16" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

export default ClassesPageSkeleton;
