import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function versionToNumericVersion(version: string): number {
  const parts = version.split(".");
  
  const major = parts[0] ? parseInt(parts[0]) * 1_000_000_000 : 0; // 12 digits
  const minor = parts[1] ? parseInt(parts[1]) * 1_000_000: 0;     // 9 digits
  const patch = parts[2] ? parseInt(parts[2]) * 1_000 : 0;         // 6 digits
  const build = parts[3] ? parseInt(parts[3]) : 0;                     // No extra digits
  
  return 1_000_000_000_000 + major + minor + patch + build;
}