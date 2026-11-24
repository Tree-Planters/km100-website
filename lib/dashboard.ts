import { getProgramBySlug } from "@/lib/programs";
import { createXlsx } from "@/lib/xlsx";
import type { DashboardSubmission } from "@/app/api/dashboard/route";

export type SubmissionStatus = DashboardSubmission["status"];

export const STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    accent: "text-amber-600",
    track: "bg-amber-400",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    accent: "text-blue-600",
    track: "bg-blue-400",
  },
  ENROLLED: {
    label: "Enrolled",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    accent: "text-emerald-600",
    track: "bg-emerald-400",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    accent: "text-gray-500",
    track: "bg-gray-300",
  },
} as const;

export const STATUS_ORDER: SubmissionStatus[] = [
  "PENDING",
  "CONTACTED",
  "ENROLLED",
  "ARCHIVED",
];

/** Fixed page size — 10 submissions per page. */
export const PAGE_SIZE = 10;

export const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(37,37,37,0.04),0_16px_40px_-24px_rgba(37,37,37,0.25)]";

export const PANEL_SHADOW =
  "shadow-[0_1px_2px_rgba(37,37,37,0.05),0_24px_60px_-20px_rgba(37,37,37,0.35)]";

/** Frosted glass surface used by dashboard cards. */
export const GLASS_CARD =
  "border border-white/70 bg-white/60 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(37,37,37,0.04),0_18px_48px_-28px_rgba(37,37,37,0.3)]";

/** Slightly denser frosted surface for the sidebar and popovers. */
export const GLASS_PANEL =
  "border border-white/70 bg-white/70 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(37,37,37,0.05),0_28px_70px_-24px_rgba(37,37,37,0.35)]";

export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/** Local YYYY-MM-DD key, so day filtering ignores timezone drift. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function keyToDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function shiftDateKey(key: string, days: number): string {
  const date = keyToDate(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function formatDateKey(key: string): string {
  return keyToDate(key).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Day cells for one month, padded so the week always starts on Sunday. */
export function buildCalendarDays(month: Date): (string | null)[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = new Date(year, monthIndex, 1).getDay();
  const total = new Date(year, monthIndex + 1, 0).getDate();

  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= total; day += 1) {
    cells.push(toDateKey(new Date(year, monthIndex, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Compact page list with ellipses, e.g. 1 … 4 5 6 … 12 */
export function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);

  if (from > 2) pages.push("ellipsis");
  for (let i = from; i <= to; i += 1) pages.push(i);
  if (to < total - 1) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export const EXPORT_HEADERS = [
  "Reference Number",
  "Full Name",
  "Program",
  "Status",
  "Email",
  "Contact Number",
  "Civil Status",
  "Region",
  "Province",
  "City/Municipality",
  "District",
  "Barangay",
  "Street/Sitio",
  "Currently Enrolled",
  "School Name",
  "Highest Attainment",
  "Date Submitted",
];

export function buildExportRows(submissions: DashboardSubmission[]): string[][] {
  return submissions.map((s) => [
    s.referenceNumber,
    `${s.lastName}, ${s.firstName} ${s.middleName || ""} ${s.suffix || ""}`.trim(),
    getProgramBySlug(s.program)?.name || s.program,
    s.status,
    s.email,
    s.mobile,
    s.civilStatus || "",
    s.region || "",
    s.province || "",
    s.municipality || "",
    s.district || "",
    s.barangay || "",
    s.address || s.sitio || "",
    s.isCurrentlyEnrolled || "",
    s.currentSchool || "",
    s.highestAttainment || "",
    new Date(s.createdAt).toLocaleString("en-PH"),
  ]);
}

export function exportFileName(extension: "csv" | "xlsx") {
  return `KM100_PreRegistrations_${new Date().toISOString().slice(0, 10)}.${extension}`;
}

export function downloadFile(
  content: string | Uint8Array,
  filename: string,
  type: string
) {
  const blob = new Blob([content as BlobPart], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(submissions: DashboardSubmission[]) {
  if (submissions.length === 0) return;

  const rows = buildExportRows(submissions).map((row) =>
    row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
  );
  const csv = [
    EXPORT_HEADERS.map((header) => `"${header}"`).join(","),
    ...rows,
  ].join("\r\n");

  downloadFile("\ufeff" + csv, exportFileName("csv"), "text/csv;charset=utf-8");
}

export function exportToExcel(submissions: DashboardSubmission[]) {
  if (submissions.length === 0) return;

  const workbook = createXlsx({
    sheetName: "Pre-Registrations",
    headers: EXPORT_HEADERS,
    rows: buildExportRows(submissions),
    columnWidths: [20, 30, 34, 14, 30, 16, 14, 14, 16, 20, 12, 16, 26, 16, 26, 20, 22],
  });

  downloadFile(
    workbook,
    exportFileName("xlsx"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}
