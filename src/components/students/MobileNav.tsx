import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import NavLink from "../common/NavBarLink";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "My Results",
    href: "/student/results",
    icon: Trophy,
    badge: null,
  },
  {
    title: "Attendance",
    href: "/student/attendance",
    icon: Calendar,
    badge: "92%",
  },
  {
    title: "Assignments",
    href: "/student/assignments",
    icon: FileText,
    badge: "3",
  },
  {
    title: "Notifications",
    href: "/student/notifications",
    icon: Bell,
    badge: "2",
  },
];

export function MobileNavStudent() {
  return (
    <Sheet>
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
                <SheetClose key={item.href} asChild>
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
                </SheetClose>
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
