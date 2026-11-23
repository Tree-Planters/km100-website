"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { programs, getProgramBySlug } from "@/lib/programs";
import { cn } from "@/lib/utils";
import type { DashboardSubmission } from "@/app/api/dashboard/route";

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

const PAGE_SIZES = [6, 10, 20] as const;

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

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);

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

  // Any change to the filters or page size starts the list from page one.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedProgram, selectedStatus, pageSize]);

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

      return matchesProgram && matchesStatus && matchesSearch;
    });
  }, [submissions, selectedProgram, selectedStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const firstVisible = filteredSubmissions.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastVisible = Math.min(safePage * pageSize, filteredSubmissions.length);
  const pagedSubmissions = filteredSubmissions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const pageList = buildPageList(safePage, totalPages);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedProgram !== "ALL" || selectedStatus !== "ALL";

  function clearFilters() {
    setSearchQuery("");
    setSelectedProgram("ALL");
    setSelectedStatus("ALL");
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

  // Export to CSV
  function exportToCSV() {
    if (filteredSubmissions.length === 0) return;

    const headers = [
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

    const rows = filteredSubmissions.map((s) => [
      `"${s.referenceNumber}"`,
      `"${s.lastName}, ${s.firstName} ${s.middleName || ""} ${s.suffix || ""}".trim()`,
      `"${getProgramBySlug(s.program)?.name || s.program}"`,
      `"${s.status}"`,
      `"${s.email}"`,
      `"${s.mobile}"`,
      `"${s.civilStatus || ""}"`,
      `"${s.region || ""}"`,
      `"${s.province || ""}"`,
      `"${s.municipality || ""}"`,
      `"${s.district || ""}"`,
      `"${s.barangay || ""}"`,
      `"${s.address || s.sitio || ""}"`,
      `"${s.isCurrentlyEnrolled || ""}"`,
      `"${s.currentSchool || ""}"`,
      `"${s.highestAttainment || ""}"`,
      `"${new Date(s.createdAt).toLocaleString("en-PH")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `KM100_PreRegistrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              className="group inline-flex items-center gap-2 bg-white px-3.5 py-1.5 text-xs font-semibold text-km-charcoal"
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

            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                disabled={filteredSubmissions.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full bg-km-charcoal px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-km-charcoal/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
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

            <div className="flex items-center gap-2 text-[11px] text-km-charcoal/50">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-km-orange" />
              <span>
                Last synced{" "}
                {new Date().toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
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
          <div
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-km-charcoal/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-km-orange/40",
              CARD_SHADOW
            )}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-km-orange/5 transition-transform duration-500 group-hover:scale-125" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/50">
                  Total Submissions
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold tracking-tight text-km-charcoal">
                    {stats.total}
                  </span>
                  <span className="text-[11px] text-km-charcoal/50">students</span>
                </div>
              </div>
              <span className="rounded-xl border border-km-orange/20 bg-km-orange/10 p-2.5 text-km-orange">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-km-charcoal/5">
              <div className="h-full w-full rounded-full bg-km-orange" />
            </div>
            <p className="mt-2 text-[11px] text-km-charcoal/45">All recorded inquiries</p>
          </div>

          <div
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-km-charcoal/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300",
              CARD_SHADOW
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/50">
                  Pending Review
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold tracking-tight text-amber-600">
                    {stats.pending}
                  </span>
                  <span className="text-[11px] text-km-charcoal/50">awaiting</span>
                </div>
              </div>
              <span className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-km-charcoal/5">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${share(stats.pending)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-km-charcoal/45">{share(stats.pending)}% of all submissions</p>
          </div>

          <div
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-km-charcoal/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300",
              CARD_SHADOW
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/50">
                  Contacted
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold tracking-tight text-blue-600">
                    {stats.contacted}
                  </span>
                  <span className="text-[11px] text-km-charcoal/50">in progress</span>
                </div>
              </div>
              <span className="rounded-xl border border-blue-200 bg-blue-50 p-2.5 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-km-charcoal/5">
              <div
                className="h-full rounded-full bg-blue-400 transition-all duration-500"
                style={{ width: `${share(stats.contacted)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-km-charcoal/45">{share(stats.contacted)}% of all submissions</p>
          </div>

          <div
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-km-charcoal/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300",
              CARD_SHADOW
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/50">
                  Officially Enrolled
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold tracking-tight text-emerald-600">
                    {stats.enrolled}
                  </span>
                  <span className="text-[11px] text-km-charcoal/50">admitted</span>
                </div>
              </div>
              <span className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-km-charcoal/5">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${share(stats.enrolled)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-km-charcoal/45">{share(stats.enrolled)}% of all submissions</p>
          </div>
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
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-km-charcoal/10 bg-km-warm-white/70 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/55">
                  <th className="px-5 py-3.5">Reference</th>
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
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-km-charcoal/60">
                      <div className="inline-flex items-center gap-2.5">
                        <svg className="h-5 w-5 animate-spin text-km-orange" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Loading pre-registrations from database…</span>
                      </div>
                    </td>
                  </tr>
                ) : pagedSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
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
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className="rounded-md bg-km-orange/8 px-2 py-1 font-mono text-[11px] font-semibold text-km-orange">
                            {item.referenceNumber}
                          </span>
                        </td>

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
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-km-charcoal/55">
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

            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <label className="flex items-center gap-1.5 text-[11px] text-km-charcoal/55">
                Rows
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border border-km-charcoal/12 bg-white px-2 py-1 text-[11px] font-semibold text-km-charcoal outline-none focus:border-km-orange"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

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
              {/* Quick Status Bar */}
              <div className="mt-5 rounded-2xl border border-km-charcoal/10 bg-km-warm-white/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/50">
                      Current Status
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        STATUS_CONFIG[activeItem.status as keyof typeof STATUS_CONFIG]?.bg
                      )}
                    >
                      {STATUS_CONFIG[activeItem.status as keyof typeof STATUS_CONFIG]?.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {STATUS_ORDER.map((st) => (
                      <button
                        key={st}
                        disabled={updatingId === activeItem.id || activeItem.status === st}
                        onClick={() => updateStatus(activeItem.id, st)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all",
                          activeItem.status === st
                            ? "border-km-charcoal bg-km-charcoal text-white"
                            : "border-km-charcoal/15 bg-white text-km-charcoal/75 hover:border-km-orange hover:text-km-orange",
                          updatingId === activeItem.id && "opacity-60"
                        )}
                      >
                        {updatingId === activeItem.id ? "Saving…" : `Mark ${st}`}
                      </button>
                    ))}
                  </div>
                </div>
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


            </div>
          </div>
        </div>
      )}
    </div>
  );
}
