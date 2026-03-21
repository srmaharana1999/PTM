import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AxiosError } from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
  return twMerge(clsx(inputs));
}
/**
 * Safely extract a human-readable error message from:
 *  - An Axios error with a server `data.message` payload
 *  - A plain Error object
 *  - A string
 *  - Anything else → a generic fallback
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  // Axios-style error with response payload
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }
  // Plain Error object
  if (error instanceof Error) {
    return error.message;
  }
  // String
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}
/** Format a date string to a readable short date */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
/** Check if a due-date string is strictly in the past */
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}
/** Get initials from a name (up to 2 chars) */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
