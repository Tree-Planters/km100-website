export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Human-readable reference number, e.g. KM100-2026-AB12C. */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `KM100-${year}-${random}`;
}
