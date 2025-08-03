"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function ClearSearchButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  return (
    <button
      type="reset"
      onClick={() => router.back()}
      disabled={disabled}
      className="absolute right-0 top-0 h-full px-1 text-stone-500"
    >
      <X className="h-full p-1" />
    </button>
  );
}

export default ClearSearchButton;
