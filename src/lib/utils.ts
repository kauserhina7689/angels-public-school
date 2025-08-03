import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Get today's date at 12:00 PM IST (stored in UTC)
 */
export function getISTMiddayDate(dateString?: string): Date {
  const date = dateString ? new Date(dateString) : new Date();

  // Extract date components in local time
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // 12:00 PM IST = 06:30 AM UTC
  return new Date(Date.UTC(year, month, day, 6, 30, 0));
}
export function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // same format as input[type="date"]
}
