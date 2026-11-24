"use client";

import { useSubmissions } from "@/components/dashboard/use-submissions";
import { cn } from "@/lib/utils";
import { exportToCSV, exportToExcel, EXPORT_HEADERS, GLASS_CARD } from "@/lib/dashboard";

export default function ReportsPage() {
  const { submissions, loading, error, refetch } = useSubmissions();
  const disabled = submissions.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-7 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-km-charcoal sm:text-[2.4rem]">
            Reports
          </h1>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-km-charcoal/60">
            Download the full pre-registration record set in the format you need.
          </p>
        </div>

        <span className="rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-[11px] font-semibold text-km-charcoal/60 backdrop-blur-md">
          {submissions.length} {submissions.length === 1 ? "record" : "records"} ready
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

      {/* Export reports */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-km-orange/25 bg-gradient-to-br from-km-orange/[0.14] via-white/60 to-white/40 p-5 backdrop-blur-xl",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(37,37,37,0.04),0_18px_48px_-28px_rgba(37,37,37,0.3)]"
          )}
        >
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-km-orange/25 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="relative flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-km-orange/25 bg-white/70 text-km-orange">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.8} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M9 4v16" />
              </svg>
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/50">
              Spreadsheet
            </span>
          </div>
          <h2 className="relative mt-4 font-brand text-lg font-semibold text-km-charcoal">
            Excel Report
          </h2>
          <p className="relative mt-1 text-[11.5px] leading-relaxed text-km-charcoal/60">
            A formatted .xlsx workbook with a frozen header row, filters and all{" "}
            {EXPORT_HEADERS.length} columns for every submission.
          </p>
          <div className="relative mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium text-km-charcoal/45">
              {loading ? "Loading records…" : `${submissions.length} records included`}
            </span>
            <button
              onClick={() => exportToExcel(submissions)}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-full bg-km-orange px-4 py-2 text-[11.5px] font-semibold text-white shadow-sm transition-all hover:bg-km-orange/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Excel
            </button>
          </div>
        </div>

        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5",
            GLASS_CARD
          )}
        >
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-emerald-200/35 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="relative flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/45">
              Plain text
            </span>
          </div>
          <h2 className="relative mt-4 font-brand text-lg font-semibold text-km-charcoal">
            CSV Report
          </h2>
          <p className="relative mt-1 text-[11.5px] leading-relaxed text-km-charcoal/55">
            A UTF-8 comma-separated file with the same columns, ready for imports, mail
            merges or Google Sheets.
          </p>
          <div className="relative mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium text-km-charcoal/45">
              {loading ? "Loading records…" : `${submissions.length} records included`}
            </span>
            <button
              onClick={() => exportToCSV(submissions)}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-full border border-km-charcoal/15 bg-white/80 px-4 py-2 text-[11.5px] font-semibold text-km-charcoal transition-all hover:border-km-charcoal/30 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5 text-km-charcoal/45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-km-charcoal/35">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Exports always include every submission, regardless of the filters used in Applications.
      </p>
    </div>
  );
}
