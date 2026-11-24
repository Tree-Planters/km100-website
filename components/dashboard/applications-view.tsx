"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { programs, getProgramBySlug } from "@/lib/programs";
import { cn } from "@/lib/utils";
import { useSubmissions } from "@/components/dashboard/use-submissions";
import {
  GLASS_CARD,
  GLASS_PANEL,
  PAGE_SIZE,
  STATUS_CONFIG,
  WEEKDAYS,
  buildCalendarDays,
  buildPageList,
  formatDateKey,
  keyToDate,
  monthStart,
  shiftDateKey,
  toDateKey,
} from "@/lib/dashboard";
import type { DashboardSubmission } from "@/app/api/dashboard/route";

// Loaded on first row click instead of with the applications table.
const SubmissionDrawer = dynamic(
  () =>
    import("@/components/dashboard/submission-drawer").then(
      (mod) => mod.SubmissionDrawer
    ),
  { ssr: false }
);

export function ApplicationsView({
  initialProgram = "ALL",
  initialStatus = "ALL",
  initialDate = null,
}: {
  initialProgram?: string;
  initialStatus?: string;
  initialDate?: string | null;
}) {
  const { submissions, loading, error, updatingId, refetch, updateStatus } = useSubmissions();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(initialProgram);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  // Day filter (calendar) - null means "All dates".
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    monthStart(initialDate ? keyToDate(initialDate) : new Date())
  );

  // Pagination (fixed at PAGE_SIZE rows per page)
  const [page, setPage] = useState(1);

  // Selected submission for the detail drawer
  const [activeItem, setActiveItem] = useState<DashboardSubmission | null>(null);

  // Any filter change starts the list from page one.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedProgram, selectedStatus, selectedDate]);

  const todayKey = toDateKey(new Date());

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

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedProgram !== "ALL" ||
    selectedStatus !== "ALL" ||
    selectedDate !== null;

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

  // Keep the drawer in sync after a status change.
  const activeItemLive = activeItem
    ? submissions.find((s) => s.id === activeItem.id) ?? activeItem
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-7 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-km-charcoal sm:text-[2.4rem]">
            Applications
          </h1>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-km-charcoal/60">
            Every pre-registration submission, with search, program, status and day filters.
          </p>
        </div>

        <span className="rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-[11px] font-semibold text-km-charcoal/60 backdrop-blur-md">
          {submissions.length} {submissions.length === 1 ? "record" : "records"} total
        </span>
      </div>

      {error && (
        <div className="mb-6 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-800 shadow-xs">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={refetch}
            className="rounded-full bg-red-600 px-3.5 py-1.5 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className={cn("mt-6 rounded-2xl p-4", GLASS_CARD)}>
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
                  <div className="fixed inset-0 z-40" onClick={() => setCalendarOpen(false)} />
                  <div
                    className={cn(
                      "absolute left-0 z-50 mt-2 w-[276px] max-w-[calc(100vw-2rem)] rounded-2xl p-3 sm:left-auto sm:right-0",
                      GLASS_PANEL
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
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
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
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
                              !isSelected && isToday && "border border-km-orange/40 text-km-orange",
                              !isSelected && !isToday && !isFuture && "text-km-charcoal/75 hover:bg-km-warm-white",
                              isFuture && "cursor-not-allowed text-km-charcoal/25 hover:bg-transparent"
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

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-km-charcoal/45">
          <span>Showing {filteredSubmissions.length} of {submissions.length} submissions</span>
          {filteredSubmissions.length !== submissions.length && (
            <span className="text-km-charcoal/30">(filters applied)</span>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className={cn("mt-6 overflow-hidden rounded-2xl", GLASS_CARD)}>
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
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span
                        role="status"
                        aria-label="Loading applications"
                        className="h-9 w-9 animate-spin rounded-full border-[3px] border-km-orange/20 border-t-km-orange"
                      />
                      <span className="text-xs font-medium text-km-charcoal/45">
                        Loading applications…
                      </span>
                    </div>
                  </td>
                </tr>
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
                    <tr key={item.id} className="group transition-colors hover:bg-km-warm-white/50">
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
                        <div className="text-[12px] font-medium text-km-charcoal">{item.email}</div>
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
        <div className="flex flex-col gap-3 border-t border-white/60 bg-white/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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

              <div className="hidden items-center gap-1 sm:flex">
                {pageList.map((entry, index) =>
                  entry === "ellipsis" ? (
                    <span key={`gap-${index}`} className="px-1 text-[11px] text-km-charcoal/35">
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

      {activeItemLive && (
        <SubmissionDrawer
          item={activeItemLive}
          updatingId={updatingId}
          onClose={() => setActiveItem(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}
