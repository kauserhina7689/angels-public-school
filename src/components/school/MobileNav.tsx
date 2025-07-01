"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import NavLink from "../common/NavBarLink";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/school",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/school/students",
    icon: Users,
  },
  {
    title: "Attendance",
    href: "/school/attendance",
    icon: Calendar,
  },
  {
    title: "Marks",
    href: "/school/marks",
    icon: BookOpen,
  },
  {
    title: "Assignments",
    href: "/school/assignments",
    icon: FileText,
  },
];

export function MobileNavStudent() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="block sm:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Student name</SheetTitle>
          <SheetDescription>Class-5</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2 flex flex-col ">
            {menuItems.map((item) => {
              return (
                <Button key={item.href} variant={"ghost"} asChild>
                  <NavLink
                    href={item.href}
                    activeClassname="text-primary border border-primary bg-primary/10"
                    classname="w-full px-3 py-2 hover:bg-primary/10 text-gray-600 hover:text-primary h-11 duration-200 hover:border transition-all hover:border-primary rounded-sm flex text-sm items-center gap-2"
                  >
                    <>
                      <item.icon className="h-5 aspect-square" />{" "}
                      <p>{item.title}</p>
                    </>
                  </NavLink>
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
        <SheetFooter>
          <Button
            variant="ghost"
            // onClick={handleLogout}
            className={cn(
              "w-full justify-start h-11 px-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
            )}
          >
            <LogOut className={cn("h-5 w-5", "mr-3")} /> Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
