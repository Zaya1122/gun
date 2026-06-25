import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount?: number) {
  if (amount === undefined || amount === null) return "";
  return `${amount.toLocaleString("mn-MN")} ₮`;
}

export function isValidUrl(url?: string | null) {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}
