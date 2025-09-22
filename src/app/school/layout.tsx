import SchoolHeader from "@/components/school/schoolHeader";
import { SchoolSidebar } from "@/components/school/sidebar";
import { authenticateUser } from "@/server/actions/auth";
import { getPopulatedClasses } from "@/server/actions/school/getClasses";
import { redirect } from "next/navigation";
import React from "react";

async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await authenticateUser();
  getPopulatedClasses();
  if (!isAuthenticated) redirect("/login");
  if (isAuthenticated.role === "student") redirect("/student");
  return (
    <div className="h-full w-full max-h-svh flex flex-col">
      <SchoolHeader></SchoolHeader>
      <section className="grow border flex overflow-hidden">
        <SchoolSidebar />
        <main className="h-full overflow-hidden p-2 grow">{children}</main>
      </section>
    </div>
  );
}

export default SchoolLayout;
