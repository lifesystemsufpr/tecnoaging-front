import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export * from "./format";
export * from "./sanatize";
export * from "./mask";
export * from "./label";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
