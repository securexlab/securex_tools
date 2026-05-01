import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes with conditional logic.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
