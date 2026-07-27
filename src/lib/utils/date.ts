/**
 * Formats a date string (YYYY-MM-DD) or other formats to YYYY-MM format.
 * If the date is "present", returns "Present".
 */
export function formatYear(yearStr: string): string {
  if (!yearStr) return "";
  if (yearStr.toLowerCase() === "present") return "Present";
  // Extract YYYY-MM-DD
  return yearStr.slice(0, 10);
}
