"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { programs } from "@/lib/programs";
import { cn } from "@/lib/utils";
import { useSubmissions } from "@/components/dashboard/use-submissions";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  GLASS_CARD,
  STATUS_CONFIG,
  STATUS_ORDER,
  type SubmissionStatus,
} from "@/lib/dashboard";

const STATUS_TONE: Record<SubmissionStatus, "amber" | "blue" | "emerald" | "neutral"> = {
  PENDING: "amber",
  CONTACTED: "blue",
  ENROLLED: "emerald",
  ARCHIVED: "neutral",
};

const STATUS_UNIT: Record<SubmissionStatus, string> = {
  PENDING: "awaiting",
  CONTACTED: "in progress",
  ENROLLED: "admitted",
  ARCHIVED: "closed",
};

const STATUS_ICON: Record<SubmissionStatus, ReactNode> = {
  PENDING: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  CONTACTED: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  ),
  ENROLLED: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  ARCHIVED: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  ),
};

export default function DashboardPage() {
  const { submissions, loading, error, refetch } = useSubmissions();

  const statusCounts = useMemo(() => {
    const counts = {} as Record<SubmissionStatus, number>;
    for (const status of STATUS_ORDER) {
      counts[status] = submissions.filter((s) => s.status === status).length;
    }
    return counts;
  }, [submissions]);

  const programCounts = useMemo(
    () =>
      programs.map((program) => ({
        ...program,
        count: submissions.filter((s) => s.program === program.slug).length,
      })),
    [submissions]
  );

  const total = submissions.length;
  const share = (count: number) => (total === 0 ? 0 : Math.round((count / total) * 100));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-7 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-3xl font-bold leading-tight text-km-charcoal sm:text-[2.4rem]">
          Dashboard
        </h1>
        <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-km-charcoal/60">
          {loading
            ? "Loading pre-registrations…"
            : `${total} ${total === 1 ? "pre-registration" : "pre-registrations"} on record, grouped by status and by program.`}
        </p>
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

      {/* Applications by status */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-km-charcoal">
              Applications by Status
            </h2>
            <p className="mt-0.5 text-[11px] text-km-charcoal/50">
              Select a status card to open that queue.
            </p>
          </div>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/35">
            {STATUS_ORDER.length} statuses
          </span>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATUS_ORDER.map((status) => (
            <StatCard
              key={status}
              tone={STATUS_TONE[status]}
              label={STATUS_CONFIG[status].label}
              value={statusCounts[status]}
              unit={STATUS_UNIT[status]}
              share={share(statusCounts[status])}
              href={`/dashboard/applications?status=${status}`}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {STATUS_ICON[status]}
                </svg>
              }
            />
          ))}
        </div>
      </section>

      {/* Applications by program */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-km-charcoal">
              Applications by Program
            </h2>
            <p className="mt-0.5 text-[11px] text-km-charcoal/50">
              Select a program card to open its applications.
            </p>
          </div>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/35">
            {programs.length} programs
          </span>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {programCounts.map((program, index) => (
            <Link
              key={program.slug}
              href={`/dashboard/applications?program=${program.slug}`}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-km-orange/40",
                GLASS_CARD
              )}
            >
              <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-km-orange/15 blur-3xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/35">
                  Program {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/70 text-km-charcoal/40 transition-colors group-hover:border-km-orange/30 group-hover:bg-km-orange/10 group-hover:text-km-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>

              <div className="relative mt-4 flex items-end gap-2">
                <span className="font-body text-[3.2rem] font-bold leading-[0.85] tracking-tight tabular-nums text-km-charcoal">
                  {loading ? "–" : program.count}
                </span>
                <span className="pb-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/40">
                  {program.count === 1 ? "applicant" : "applicants"}
                </span>
              </div>

              <h3 className="relative mt-3 text-[13.5px] font-semibold leading-snug text-km-charcoal">
                {program.name}
              </h3>

              <div className="relative mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-km-charcoal/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-km-orange to-amber-400 transition-all duration-700 ease-out"
                    style={{ width: `${share(program.count)}%` }}
                  />
                </div>
                <span className="text-[10.5px] font-semibold tabular-nums text-km-charcoal/40">
                  {share(program.count)}%
                </span>
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-white/60 pt-3">
                <span className="text-[10.5px] font-medium text-km-charcoal/40">
                  {share(program.count)}% of all records
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[10.5px] font-semibold text-km-charcoal/60 transition-colors group-hover:bg-km-orange/10 group-hover:text-km-orange">
                  View
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
