import React from "react";

function SchoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full max-h-svh bg-red-200 flex flex-col">
      <header className="h-12 w-full border bg-red-700"></header>
      <section className="grow border flex overflow-hidden bg-amber-600">
        <aside className="w-28 hidden sm:block border h-full"></aside>
        <main className="h-full overflow-hidden p-2 bg-blue-500 grow">
          {children}
        </main>
      </section>
    </div>
  );
}

export default SchoolLayout;
