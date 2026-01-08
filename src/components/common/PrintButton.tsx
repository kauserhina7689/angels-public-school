"use client";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Printer } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function PrintButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  return (
    <Button
      onClick={() => window.print()}
      {...props}
      className={cn(props.className, "printButton")}
    >
      <Printer />
      {props.children}
    </Button>
  );
}

export default PrintButton;
