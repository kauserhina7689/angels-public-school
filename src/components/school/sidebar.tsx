import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  BookOpen,
} from "lucide-react";
import NavLink from "../common/NavBarLink";
import { LogoutDialog } from "../common/logoutDialog";

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

interface StudentSidebarProps {
  className?: string;
}

export function SchoolSidebar({ className }: StudentSidebarProps) {
  return (
    <aside
      className={cn(
        " flex-col h-full bg-white border-r border-gray-200 w-44 hidden sm:flex",
        className
      )}
    >
      {/* Navigation */}
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

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <LogoutDialog />
      </div>
    </aside>
  );
}
