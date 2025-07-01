import SchoolHeader from "@/components/school/schoolHeader";
import { SchoolSidebar } from "@/components/school/sidebar";
import React from "react";

function SchoolLayout({ children }: { children: React.ReactNode }) {
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
