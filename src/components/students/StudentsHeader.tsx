import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MobileNavStudent } from "./MobileNav";

function StudentsHeader() {
  return (
    <header className=" shrink-0 flex h-16 items-center gap-4 px-4 lg:px-6">
      <MobileNavStudent />
      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-900 lg:text-xl">
          Welcome, Student name!
        </h1>
        {/* {subtitle && ( */}
        <p className="text-sm text-gray-500 hidden sm:block">
          Class 12, RN - 7
        </p>
        {/* )} */}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ">
              <Avatar className="h-8 w-8 ">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className=" text-white text-sm bg-gradient-to-r from-indigo-600 to-purple-600">
                  JS
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Smith</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john@school.com
                </p>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>
                       <User className="mr-2 h-4 w-4" />
                       Profile
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                       <Settings className="mr-2 h-4 w-4" />
                       Settings
                     </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default StudentsHeader;
