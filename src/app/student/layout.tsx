import { StudentSidebar } from "@/components/students/sidebar";
import StudentsHeader from "@/components/students/StudentsHeader";
import type React from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full max-h-svh flex flex-col">
      <StudentsHeader />
      <section className="grow border flex overflow-hidden">
        <StudentSidebar />
        <main className="h-full overflow-hidden grow">{children}</main>
      </section>
    </div>
  );
}
