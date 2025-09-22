"use client";
import React, { useEffect, useState } from "react";
import SessionEditFormModal, { sessionType } from "../modals/editSession";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CalendarCheck, CalendarClock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
function SessionsPage({
  sessions,
  message,
  error,
}: {
  sessions: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  }[];
  message: string;
  error: boolean;
}) {
  const [currentSession, setCurrentSession] = useState<sessionType | null>(
    null
  );
  useEffect(() => {
    console.log({ currentSession, sessions });
  }, [currentSession]);

  return (
    <div className="p-6 pt-0 space-y-6 h-full relative overflow-y-auto">
      <header className="flex border-b z-10 pb-2 sticky top-0  flex-col bg-background sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage sessions</h1>
          <p className="text-muted-foreground">
            View sessions and add new sessions
          </p>
        </div>
        <SessionEditFormModal
          currentSession={currentSession}
          setCurrentSession={setCurrentSession}
        />
      </header>
      {error ? (
        <main className="w-full h-[70svh] flex flex-col items-center justify-center gap-4 bg-red-100 text-red-700 rounded-lg p-6">
          <AlertCircle className="w-10 h-10" />
          <p className="text-lg font-semibold">
            {message || "Something went wrong!"}
          </p>
        </main>
      ) : (
        <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sessions.map((session) => {
            return (
              <Card key={session._id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {session.name}
                    <div className="grow flex items-center justify-end gap-3">
                      <Button
                        onClick={() => setCurrentSession(session)}
                        variant="ghost"
                        size="icon"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    <span>
                      <span className="font-medium">Start:</span>{" "}
                      {session.startDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    <span>
                      <span className="font-medium">End:</span>{" "}
                      {session.endDate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </main>
      )}
    </div>
  );
}

export default SessionsPage;
