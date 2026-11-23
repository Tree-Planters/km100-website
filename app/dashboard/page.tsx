"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { programs, getProgramBySlug } from "@/lib/programs";
import { cn } from "@/lib/utils";
import type { DashboardSubmission } from "@/app/api/dashboard/route";
import { createXlsx } from "@/lib/xlsx";

const STATUS_CONFIG = {
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

const STATUS_ORDER = ["PENDING", "CONTACTED", "ENROLLED", "ARCHIVED"] as const;

/** Fixed page size — 10 submissions per page. */
const PAGE_SIZE = 10;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const PANEL_SHADOW =
  "shadow-[0_1px_2px_rgba(37,37,37,0.05),0_24px_60px_-20px_rgba(37,37,37,0.35)]";

/** Local YYYY-MM-DD key, so day filtering ignores timezone drift. */
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function keyToDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDateKey(key: string, days: number): string {
  const date = keyToDate(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

function formatDateKey(key: string): string {
  return keyToDate(key).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Day cells for one month, padded so the week always starts on Sunday. */
function buildCalendarDays(month: Date): (string | null)[] {
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

function SkeletonBar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block animate-pulse rounded bg-km-charcoal/10", className)}
    />
  );
}

const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(37,37,37,0.04),0_16px_40px_-24px_rgba(37,37,37,0.25)]";

/** Compact page list with ellipses, e.g. 1 … 4 5 6 … 12 */
function buildPageList(current: number, total: number): (number | "ellipsis")[] {
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

const STAT_TONES = {
  orange: {
    glow: "bg-km-orange/10",
    tile: "border-km-orange/25 bg-gradient-to-br from-km-orange/15 to-km-orange/5 text-km-orange",
    bar: "bg-gradient-to-r from-km-orange to-amber-400",
    dot: "bg-km-orange/60",
    hover: "hover:border-km-orange/40",
  },
  amber: {
    glow: "bg-amber-300/20",
    tile: "border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600",
    bar: "bg-gradient-to-r from-amber-400 to-amber-300",
    dot: "bg-amber-400",
    hover: "hover:border-amber-300",
  },
  blue: {
    glow: "bg-blue-300/20",
    tile: "border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600",
    bar: "bg-gradient-to-r from-blue-500 to-blue-400",
    dot: "bg-blue-400",
    hover: "hover:border-blue-300",
  },
  emerald: {
    glow: "bg-emerald-300/20",
    tile: "border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600",
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    dot: "bg-emerald-400",
    hover: "hover:border-emerald-300",
  },
} as const;

function StatCard({
  tone,
  label,
  value,
  unit,
  note,
  share,
  icon,
}: {
  tone: keyof typeof STAT_TONES;
  label: string;
  value: number;
  unit: string;
  note: string;
  share: number;
  icon: ReactNode;
}) {
  const palette = STAT_TONES[tone];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-km-charcoal/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5",
        palette.hover,
        CARD_SHADOW
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125",
          palette.glow
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="block truncate text-[10.5px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/45">
            {label}
          </span>
          <div className="mt-3 flex items-end gap-1.5">
            <span className="font-body text-[2.6rem] font-bold leading-none tracking-tight text-km-charcoal tabular-nums">
              {value}
            </span>
            <span className="pb-1 text-[11px] font-medium text-km-charcoal/45">{unit}</span>
          </div>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
            palette.tile
          )}
        >
          {icon}
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-km-charcoal/[0.06]">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", palette.bar)}
            style={{ width: `${share}%` }}
          />
        </div>
        <span className="text-[10.5px] font-semibold tabular-nums text-km-charcoal/40">
          {share}%
        </span>
      </div>

      <p className="relative mt-2.5 flex items-center gap-1.5 text-[11px] text-km-charcoal/45">
        <span className={cn("h-1.5 w-1.5 rounded-full", palette.dot)} />
        {note}
      </p>
    </div>
  );
}

const EXPORT_HEADERS = [
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

function buildExportRows(submissions: DashboardSubmission[]): string[][] {
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

function exportFileName(extension: "csv" | "xlsx") {
  return `KM100_PreRegistrations_${new Date().toISOString().slice(0, 10)}.${extension}`;
}

function downloadFile(content: string | Uint8Array, filename: string, type: string) {
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

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Day filter (calendar) - defaults to today once the client mounts.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => monthStart(new Date()));

  // Pagination (fixed at PAGE_SIZE rows per page)
  const [page, setPage] = useState(1);

  // Selected Submission for Detailed View Modal
  const [activeItem, setActiveItem] = useState<DashboardSubmission | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchSubmissions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch submissions from database.");
      }
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      console.error("Failed to load dashboard submissions:", err);
      setError(err.message || "Failed to connect to the database.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Default the day filter to today. Set after mount so the prerendered HTML
  // and the first client render match (no hydration warning).
  useEffect(() => {
    const now = new Date();
    setSelectedDate(toDateKey(now));
    setCalendarMonth(monthStart(now));
  }, []);

  // Any filter change starts the list from page one.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedProgram, selectedStatus, selectedDate]);

  async function updateStatus(
    id: string,
    newStatus: "PENDING" | "CONTACTED" | "ENROLLED" | "ARCHIVED"
  ) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.submission) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        if (activeItem && activeItem.id === id) {
          setActiveItem((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(data.error || "Failed to update status in database.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status. Please verify database connection.");
    } finally {
      setUpdatingId(null);
    }
  }

  // Close the detail drawer with Escape
  useEffect(() => {
    if (!activeItem) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveItem(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem]);

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesProgram =
        selectedProgram === "ALL" || item.program === selectedProgram;
      const matchesStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.referenceNumber.toLowerCase().includes(q) ||
        item.firstName.toLowerCase().includes(q) ||
        item.lastName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.mobile.toLowerCase().includes(q) ||
        (item.municipality && item.municipality.toLowerCase().includes(q));

      const matchesDate =
        !selectedDate || toDateKey(new Date(item.createdAt)) === selectedDate;

      return matchesProgram && matchesStatus && matchesSearch && matchesDate;
    });
  }, [submissions, selectedProgram, selectedStatus, searchQuery, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const firstVisible =
    filteredSubmissions.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safePage * PAGE_SIZE, filteredSubmissions.length);
  const pagedSubmissions = filteredSubmissions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const pageList = buildPageList(safePage, totalPages);
  const todayKey = toDateKey(new Date());

  // Today's date is the default day view, so it does not count as a filter.
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedProgram !== "ALL" ||
    selectedStatus !== "ALL" ||
    (selectedDate !== null && selectedDate !== todayKey);

  function stepDate(delta: number) {
    setSelectedDate((current) => {
      const next = shiftDateKey(current ?? todayKey, delta);
      return next > todayKey ? todayKey : next;
    });
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedProgram("ALL");
    setSelectedStatus("ALL");
    setSelectedDate(null);
    setPage(1);
  }

  // Summary counts
  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "PENDING").length,
      contacted: submissions.filter((s) => s.status === "CONTACTED").length,
      enrolled: submissions.filter((s) => s.status === "ENROLLED").length,
    };
  }, [submissions]);

  const share = (count: number) =>
    stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);

  const activeStatus =
    (activeItem && STATUS_CONFIG[activeItem.status as keyof typeof STATUS_CONFIG]) ||
    STATUS_CONFIG.PENDING;

  // Export to CSV / Excel
  function exportToCSV() {
    if (filteredSubmissions.length === 0) return;

    const rows = buildExportRows(filteredSubmissions).map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    );
    const csv = [
      EXPORT_HEADERS.map((header) => `"${header}"`).join(","),
      ...rows,
    ].join("\r\n");

    downloadFile("\ufeff" + csv, exportFileName("csv"), "text/csv;charset=utf-8");
  }

  function exportToExcel() {
    if (filteredSubmissions.length === 0) return;

    const workbook = createXlsx({
      sheetName: "Pre-Registrations",
      headers: EXPORT_HEADERS,
      rows: buildExportRows(filteredSubmissions),
      columnWidths: [20, 30, 34, 14, 30, 16, 14, 14, 16, 20, 12, 16, 26, 16, 26, 20, 22],
    });

    downloadFile(
      workbook,
      exportFileName("xlsx"),
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }

  return (
    <div className="min-h-screen bg-km-warm-white/50">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(120%_100%_at_50%_0%,rgba(244,119,33,0.10),rgba(245,243,239,0)_70%)]" />

      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-30 border-b border-km-charcoal/10 bg-white/85 backdrop-blur-xl">
        <div className="h-[3px] w-full bg-gradient-to-r from-km-orange via-amber-400 to-km-orange/20" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 bg-white px-3.5 py-1.5 text-xs font-semibold text-orang-white"
            >
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3 pb-5 pt-1">
            <div>
            
              <h1 className="mt-1 font-heading text-3xl font-bold leading-tight text-km-charcoal sm:text-[2.4rem]">
                Admissions Portal
              </h1>
              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-km-charcoal/60">
                Pre-registration submissions and student inquiries, all in one overview.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={exportToCSV}
                disabled={filteredSubmissions.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-km-charcoal/15 bg-white px-4 py-2 text-xs font-semibold text-km-charcoal transition-all duration-200 hover:border-km-charcoal/30 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4 text-km-charcoal/45"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Export CSV</span>
              </button>

              <button
                onClick={exportToExcel}
                disabled={filteredSubmissions.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full bg-km-charcoal px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-km-charcoal/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4 text-km-orange"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.8} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M9 4v16" />
                </svg>
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6">
        {error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-800 shadow-xs">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchSubmissions}
              className="rounded-full bg-red-600 px-3.5 py-1.5 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            tone="orange"
            label="Total Submissions"
            value={stats.total}
            unit="students"
            note="All recorded inquiries"
            share={100}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />

          <StatCard
            tone="amber"
            label="Pending Review"
            value={stats.pending}
            unit="awaiting"
            note="Awaiting first contact"
            share={share(stats.pending)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <StatCard
            tone="blue"
            label="Contacted"
            value={stats.contacted}
            unit="in progress"
            note="In active follow-up"
            share={share(stats.contacted)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
          />

          <StatCard
            tone="emerald"
            label="Officially Enrolled"
            value={stats.enrolled}
            unit="admitted"
            note="Officially admitted"
            share={share(stats.enrolled)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Filter and Search Bar */}
        <div className={cn("mt-6 rounded-2xl border border-km-charcoal/10 bg-white p-4", CARD_SHADOW)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[260px] flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-km-charcoal/40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, reference number, email, or city…"
                className="w-full rounded-xl border border-km-charcoal/12 bg-km-warm-white/40 py-2.5 pl-10 pr-3 text-sm text-km-charcoal outline-none transition-all placeholder:text-km-charcoal/35 focus:border-km-orange/60 focus:bg-white focus:ring-4 focus:ring-km-orange/10"
              />
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-km-charcoal/12 bg-white px-3 py-2.5 text-xs font-medium text-km-charcoal outline-none transition-all focus:border-km-orange/60 focus:ring-4 focus:ring-km-orange/10 sm:flex-none"
              >
                <option value="ALL">All Programs ({submissions.length})</option>
                {programs.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-km-charcoal/12 bg-white px-3 py-2.5 text-xs font-medium text-km-charcoal outline-none transition-all focus:border-km-orange/60 focus:ring-4 focus:ring-km-orange/10 sm:flex-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <div className="relative sm:flex-none">
                <div className="flex items-stretch overflow-hidden rounded-xl border border-km-charcoal/12 bg-white">
                  <button
                    type="button"
                    onClick={() => stepDate(-1)}
                    aria-label="Previous day"
                    className="flex items-center px-2 text-km-charcoal/45 transition-colors hover:bg-km-warm-white hover:text-km-orange"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMonth(
                        monthStart(selectedDate ? keyToDate(selectedDate) : new Date())
                      );
                      setCalendarOpen((open) => !open);
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={calendarOpen}
                    className={cn(
                      "flex items-center gap-1.5 border-x border-km-charcoal/12 px-2.5 py-2.5 text-xs font-medium transition-colors",
                      selectedDate
                        ? "bg-km-orange/8 text-km-orange"
                        : "text-km-charcoal hover:bg-km-warm-white/60"
                    )}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="whitespace-nowrap">
                      {selectedDate ? formatDateKey(selectedDate) : "All dates"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => stepDate(1)}
                    disabled={selectedDate !== null && selectedDate >= todayKey}
                    aria-label="Next day"
                    className="flex items-center px-2 text-km-charcoal/45 transition-colors hover:bg-km-warm-white hover:text-km-orange disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-km-charcoal/45"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {calendarOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setCalendarOpen(false)}
                    />
                    <div
                      className={cn(
                        "absolute left-0 z-50 mt-2 w-[276px] max-w-[calc(100vw-2rem)] rounded-2xl border border-km-charcoal/10 bg-white p-3 sm:left-auto sm:right-0",
                        PANEL_SHADOW
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() - 1,
                                1
                              )
                            )
                          }
                          aria-label="Previous month"
                          className="rounded-full p-1.5 text-km-charcoal/50 transition-colors hover:bg-km-warm-white hover:text-km-orange"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-xs font-semibold text-km-charcoal">
                          {calendarMonth.toLocaleDateString("en-PH", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() + 1,
                                1
                              )
                            )
                          }
                          disabled={calendarMonth >= monthStart(keyToDate(todayKey))}
                          aria-label="Next month"
                          className="rounded-full p-1.5 text-km-charcoal/50 transition-colors hover:bg-km-warm-white hover:text-km-orange disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-2 grid grid-cols-7 gap-0.5">
                        {WEEKDAYS.map((day) => (
                          <span
                            key={day}
                            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-km-charcoal/35"
                          >
                            {day}
                          </span>
                        ))}
                      </div>

                      <div className="mt-0.5 grid grid-cols-7 gap-0.5">
                        {buildCalendarDays(calendarMonth).map((key, index) => {
                          if (!key) {
                            return <span key={`blank-${index}`} aria-hidden="true" />;
                          }

                          const isSelected = key === selectedDate;
                          const isToday = key === todayKey;
                          const isFuture = key > todayKey;

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setSelectedDate(key);
                                setCalendarOpen(false);
                              }}
                              disabled={isFuture}
                              className={cn(
                                "flex h-8 items-center justify-center rounded-lg text-[11px] font-medium transition-colors",
                                isSelected && "bg-km-charcoal text-white",
                                !isSelected &&
                                  isToday &&
                                  "border border-km-orange/40 text-km-orange",
                                !isSelected &&
                                  !isToday &&
                                  !isFuture &&
                                  "text-km-charcoal/75 hover:bg-km-warm-white",
                                isFuture &&
                                  "cursor-not-allowed text-km-charcoal/25 hover:bg-transparent"
                              )}
                            >
                              {keyToDate(key).getDate()}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-km-charcoal/10 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(null);
                            setCalendarOpen(false);
                          }}
                          className="rounded-full px-2 py-1 text-[11px] font-semibold text-km-charcoal/55 transition-colors hover:text-km-orange"
                        >
                          All dates
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(todayKey);
                            setCalendarOpen(false);
                          }}
                          className="rounded-full px-2 py-1 text-[11px] font-semibold text-km-orange transition-colors hover:bg-km-orange/10"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-km-charcoal/12 bg-white px-3 py-2.5 text-xs font-semibold text-km-charcoal/70 transition-colors hover:border-km-orange/50 hover:text-km-orange"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className={cn("mt-6 overflow-hidden rounded-2xl border border-km-charcoal/10 bg-white", CARD_SHADOW)}>
          <div className="overflow-x-auto">
            <table aria-busy={loading} className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-km-charcoal/10 bg-km-warm-white/70 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/55">
                  <th className="px-5 py-3.5">Applicant</th>
                  <th className="px-5 py-3.5">Program Applied</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Submitted</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-charcoal/[0.07]">
                {loading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <tr key={`skeleton-${index}`} aria-hidden="true">
                      <td className="px-5 py-3.5">
                        <SkeletonBar className="h-3 w-32" />
                        <SkeletonBar className="mt-1.5 h-2.5 w-20" />
                      </td>
                      <td className="px-5 py-3.5">
                        <SkeletonBar className="h-5 w-36 rounded-md" />
                      </td>
                      <td className="px-5 py-3.5">
                        <SkeletonBar className="h-3 w-40" />
                        <SkeletonBar className="mt-1.5 h-2.5 w-24" />
                      </td>
                      <td className="px-5 py-3.5">
                        <SkeletonBar className="h-5 w-24 rounded-full" />
                      </td>
                      <td className="px-5 py-3.5">
                        <SkeletonBar className="h-3 w-20" />
                      </td>
                      <td className="px-5 py-3.5">
                        <SkeletonBar className="ml-auto h-7 w-16 rounded-full" />
                      </td>
                    </tr>
                  ))
                ) : pagedSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-km-warm-white text-km-charcoal/40">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-km-charcoal">
                        No pre-registration records found
                      </p>
                      <p className="mt-1 text-xs text-km-charcoal/50">
                        {submissions.length === 0
                          ? "New student pre-registrations submitted via the website will appear here."
                          : "Try adjusting your search query or filter options."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-4 rounded-full border border-km-charcoal/15 px-4 py-1.5 text-[11px] font-semibold text-km-charcoal transition-colors hover:border-km-orange hover:text-km-orange"
                        >
                          Reset filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  pagedSubmissions.map((item) => {
                    const statusInfo =
                      STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ||
                      STATUS_CONFIG.PENDING;
                    const progObj = getProgramBySlug(item.program);

                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors hover:bg-km-warm-white/50"
                      >
                        <td className="px-5 py-3.5">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-km-charcoal">
                              {item.lastName}, {item.firstName} {item.middleName || ""}{" "}
                              {item.suffix || ""}
                            </div>
                            <div className="truncate text-[11px] text-km-charcoal/45">
                              {item.municipality || "Location not provided"}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className="inline-block max-w-[210px] truncate rounded-md border border-km-charcoal/10 bg-km-warm-white/60 px-2 py-1 text-[11px] font-medium text-km-charcoal/80"
                            title={progObj?.name || item.program}
                          >
                            {progObj?.name || item.program}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="text-[12px] font-medium text-km-charcoal">
                            {item.email}
                          </div>
                          <div className="text-[11px] text-km-charcoal/45">{item.mobile}</div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                              statusInfo.bg
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", statusInfo.dot)} />
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5 text-km-charcoal/60">
                          {new Date(item.createdAt).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                          <button
                            onClick={() => setActiveItem(item)}
                            className="inline-flex items-center gap-1 rounded-full border border-km-charcoal/12 bg-white px-3 py-1.5 text-[11px] font-semibold text-km-charcoal/80 transition-all hover:border-km-orange hover:bg-km-orange hover:text-white"
                          >
                            View
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-km-charcoal/10 bg-km-warm-white/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-km-charcoal/55", loading && "invisible")}>
              <span>
                Showing <strong className="font-semibold text-km-charcoal">{firstVisible}</strong>
                {"–"}
                <strong className="font-semibold text-km-charcoal">{lastVisible}</strong> of{" "}
                <strong className="font-semibold text-km-charcoal">
                  {filteredSubmissions.length}
                </strong>{" "}
                {filteredSubmissions.length === 1 ? "submission" : "submissions"}
              </span>
              {filteredSubmissions.length !== submissions.length && (
                <span className="text-km-charcoal/35">(filtered from {submissions.length})</span>
              )}
            </div>

            <div className={cn("flex flex-wrap items-center justify-between gap-3 sm:justify-end", loading && "invisible")}>
              <span className="hidden text-[11px] text-km-charcoal/45 sm:inline">
                {PAGE_SIZE} rows per page
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1 || loading}
                  aria-label="Previous page"
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-km-charcoal/12 bg-white px-3 text-[11px] font-semibold text-km-charcoal/75 transition-all hover:border-km-orange hover:text-km-orange disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-km-charcoal/12 disabled:hover:text-km-charcoal/75"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Number strip (desktop) */}
                <div className="hidden items-center gap-1 sm:flex">
                  {pageList.map((entry, index) =>
                    entry === "ellipsis" ? (
                      <span
                        key={`gap-${index}`}
                        className="px-1 text-[11px] text-km-charcoal/35"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={entry}
                        onClick={() => setPage(entry)}
                        aria-current={entry === safePage ? "page" : undefined}
                        className={cn(
                          "h-8 min-w-8 rounded-full px-2 text-[11px] font-semibold transition-all",
                          entry === safePage
                            ? "bg-km-charcoal text-white shadow-sm"
                            : "border border-km-charcoal/12 bg-white text-km-charcoal/70 hover:border-km-orange hover:text-km-orange"
                        )}
                      >
                        {entry}
                      </button>
                    )
                  )}
                </div>

                {/* Compact indicator (mobile) */}
                <span className="rounded-full border border-km-charcoal/12 bg-white px-3 py-1.5 text-[11px] font-semibold text-km-charcoal/70 sm:hidden">
                  Page {safePage} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages || loading}
                  aria-label="Next page"
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-km-charcoal/12 bg-white px-3 text-[11px] font-semibold text-km-charcoal/75 transition-all hover:border-km-orange hover:text-km-orange disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-km-charcoal/12 disabled:hover:text-km-charcoal/75"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-km-charcoal/35">
          KM100 Skills and Training Center — Admissions Records
        </p>
      </main>

      {/* DETAIL MODAL DRAWER */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-km-charcoal/55 p-4 backdrop-blur-sm"
          onClick={() => setActiveItem(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 rounded-t-3xl border-b border-km-charcoal/10 bg-white/95 px-6 py-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-km-orange">
                    {activeItem.referenceNumber}
                  </span>
                  <h3 className="font-brand text-xl font-semibold leading-tight text-km-charcoal">
                    {activeItem.lastName}, {activeItem.firstName}{" "}
                    {activeItem.middleName || ""} {activeItem.suffix || ""}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-km-charcoal/55">
                    Pre-registered on{" "}
                    {new Date(activeItem.createdAt).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <button
                  onClick={() => setActiveItem(null)}
                  aria-label="Close details"
                  className="rounded-full p-2 text-km-charcoal/50 transition-colors hover:bg-km-warm-white hover:text-km-charcoal"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              {/* Status Updater */}
              <div className="mt-5 rounded-2xl border border-km-charcoal/10 bg-km-warm-white/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/50">
                      Current Status
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        activeStatus.bg
                      )}
                    >
                      {activeStatus.label}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-km-charcoal/45">
                    {updatingId === activeItem.id
                      ? "Saving changes…"
                      : "Select a status below to update this applicant"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STATUS_ORDER.map((st) => {
                    const config =
                      STATUS_CONFIG[st as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
                    const isCurrent = activeItem.status === st;
                    const isSaving = updatingId === activeItem.id;

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateStatus(activeItem.id, st)}
                        disabled={isSaving || isCurrent}
                        aria-pressed={isCurrent}
                        title={`Set status to ${st.toLowerCase()}`}
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-semibold capitalize transition-all",
                          isCurrent
                            ? cn(config.bg, "cursor-default shadow-sm")
                            : "border-km-charcoal/12 bg-white text-km-charcoal/70 hover:-translate-y-0.5 hover:border-km-orange/50 hover:text-km-orange hover:shadow-sm",
                          isSaving && "opacity-60"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isCurrent ? config.dot : "bg-km-charcoal/25"
                          )}
                        />
                        {st.toLowerCase()}
                        {isCurrent && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2.5 text-[10.5px] text-km-charcoal/40">
                  Changes are saved to the database immediately.
                </p>
              </div>

              {/* Modal Body Sections */}
              <div className="mt-6 space-y-4 text-sm text-km-charcoal">
                {/* Section I: Personal Info */}
                <section className="rounded-2xl border border-km-charcoal/10 p-4">
                  <h4 className="font-brand text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/45">
                    I. Personal Information
                  </h4>
                  <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-km-charcoal/55">Email</span>
                      <div>
                        <a href={`mailto:${activeItem.email}`} className="font-semibold text-km-orange hover:underline">
                          {activeItem.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Contact Number</span>
                      <div>
                        <a href={`tel:${activeItem.mobile}`} className="font-semibold text-km-charcoal">
                          {activeItem.mobile}
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Civil Status</span>
                      <div className="font-semibold">{activeItem.civilStatus || "N/A"}</div>
                    </div>
                  </div>
                </section>

                {/* Section II: Complete Address */}
                <section className="rounded-2xl border border-km-charcoal/10 p-4">
                  <h4 className="font-brand text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/45">
                    II. Complete Address (PSGC)
                  </h4>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-km-charcoal/55">Region:</span>{" "}
                      <span className="font-semibold">{activeItem.region || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Province:</span>{" "}
                      <span className="font-semibold">{activeItem.province || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">City / Municipality:</span>{" "}
                      <span className="font-semibold">{activeItem.municipality || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">District:</span>{" "}
                      <span className="font-semibold">{activeItem.district || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Barangay:</span>{" "}
                      <span className="font-semibold">{activeItem.barangay || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Number / Street / Sitio:</span>{" "}
                      <span className="font-semibold">{activeItem.address || activeItem.sitio || "N/A"}</span>
                    </div>
                  </div>
                </section>

                {/* Section III: Educational Information */}
                <section className="rounded-2xl border border-km-charcoal/10 p-4">
                  <h4 className="font-brand text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/45">
                    III. Educational Background
                  </h4>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-km-charcoal/55">Currently Enrolled:</span>{" "}
                      <span className="font-semibold">{activeItem.isCurrentlyEnrolled || "N/A"}</span>
                    </div>
                    {activeItem.isCurrentlyEnrolled === "YES" ? (
                      <>
                        <div>
                          <span className="text-km-charcoal/55">Current School:</span>{" "}
                          <span className="font-semibold">{activeItem.currentSchool || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-km-charcoal/55">Current Grade / Year:</span>{" "}
                          <span className="font-semibold">{activeItem.currentGradeLevel || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-km-charcoal/55">Current Track / Program:</span>{" "}
                          <span className="font-semibold">{activeItem.currentProgram || "N/A"}</span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="text-km-charcoal/55">Highest Attainment:</span>{" "}
                        <span className="font-semibold">{activeItem.highestAttainment || "N/A"}</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Section IV: Program Applied */}
                <section className="rounded-2xl border border-km-orange/25 bg-gradient-to-br from-km-orange/5 to-km-warm-white/60 p-4">
                  <h4 className="font-brand text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/45">
                    IV. Program Applied
                  </h4>
                  <div className="mt-2 text-lg font-bold leading-snug text-km-orange">
                    {getProgramBySlug(activeItem.program)?.name || activeItem.program}
                  </div>
                  <div className="mt-1 text-[11px] text-km-charcoal/60">
                    3-Year Diploma Program • PQF Level 5 Qualification
                  </div>
                </section>

                {/* Section V: Consent & Acknowledgement */}
                <section className="rounded-2xl bg-km-warm-white/70 p-4 text-[11px] text-km-charcoal/65">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                    <span>Student acknowledged that this form serves as pre-registration only.</span>
                  </div>
                  <div className="mt-1.5 flex items-start gap-2">
                    <span className="mt-0.5 font-bold text-emerald-600">✓</span>
                    <span>Student consented to Republic Act No. 10173 (Data Privacy Act of 2012).</span>
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end border-t border-km-charcoal/10 pt-4">
                <button
                  onClick={() => setActiveItem(null)}
                  className="rounded-full bg-km-charcoal px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-km-charcoal/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
