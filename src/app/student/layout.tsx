import { StudentSidebar } from "@/components/students/sidebar";
import StudentsHeader from "@/components/students/StudentsHeader";
import { authenticateUser } from "@/server/actions/auth";
import { redirect } from "next/navigation";
import type React from "react";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await authenticateUser();
  if (!isAuthenticated) redirect("/login");
  if (isAuthenticated.role === "school") redirect("/school");

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
