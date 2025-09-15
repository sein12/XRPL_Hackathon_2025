import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function dropsToXrp(drops: number | string): number {
  return Number(drops) / 1_000_000;
}
export function xrpToDrops(xrp: number | string): number {
  return Math.round(Number(xrp) * 1_000_000);
}
