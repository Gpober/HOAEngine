type ClassValue = string | false | null | undefined;

/** Tiny class-name joiner — no runtime dependency needed for this project. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
