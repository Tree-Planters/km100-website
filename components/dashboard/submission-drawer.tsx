"use client";

import { useEffect } from "react";
import { getProgramBySlug } from "@/lib/programs";
import { cn } from "@/lib/utils";
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type SubmissionStatus,
} from "@/lib/dashboard";
import type { DashboardSubmission } from "@/app/api/dashboard/route";

export function SubmissionDrawer({
  item,
  updatingId,
  onClose,
  onStatusChange,
}: {
  item: DashboardSubmission;
  updatingId: string | null;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
}) {
  // Close the drawer with Escape
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const activeStatus =
    STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-km-charcoal/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white/85 shadow-2xl backdrop-blur-2xl"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 rounded-t-3xl border-b border-white/60 bg-white/80 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-km-orange">
                {item.referenceNumber}
              </span>
              <h3 className="font-brand text-xl font-semibold leading-tight text-km-charcoal">
                {item.lastName}, {item.firstName} {item.middleName || ""} {item.suffix || ""}
              </h3>
              <p className="mt-0.5 text-[11px] text-km-charcoal/55">
                Pre-registered on{" "}
                {new Date(item.createdAt).toLocaleString("en-PH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <button
              onClick={onClose}
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
                {updatingId === item.id
                  ? "Saving changes…"
                  : "Select a status below to update this applicant"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUS_ORDER.map((st) => {
                const config = STATUS_CONFIG[st];
                const isCurrent = item.status === st;
                const isSaving = updatingId === item.id;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onStatusChange(item.id, st)}
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
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                    <a href={`mailto:${item.email}`} className="font-semibold text-km-orange hover:underline">
                      {item.email}
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Contact Number</span>
                  <div>
                    <a href={`tel:${item.mobile}`} className="font-semibold text-km-charcoal">
                      {item.mobile}
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Civil Status</span>
                  <div className="font-semibold">{item.civilStatus || "N/A"}</div>
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
                  <span className="font-semibold">{item.region || "N/A"}</span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Province:</span>{" "}
                  <span className="font-semibold">{item.province || "N/A"}</span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">City / Municipality:</span>{" "}
                  <span className="font-semibold">{item.municipality || "N/A"}</span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">District:</span>{" "}
                  <span className="font-semibold">{item.district || "N/A"}</span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Barangay:</span>{" "}
                  <span className="font-semibold">{item.barangay || "N/A"}</span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Number / Street / Sitio:</span>{" "}
                  <span className="font-semibold">{item.address || item.sitio || "N/A"}</span>
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
                  <span className="font-semibold">{item.isCurrentlyEnrolled || "N/A"}</span>
                </div>
                {item.isCurrentlyEnrolled === "YES" ? (
                  <>
                    <div>
                      <span className="text-km-charcoal/55">Current School:</span>{" "}
                      <span className="font-semibold">{item.currentSchool || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Current Grade / Year:</span>{" "}
                      <span className="font-semibold">{item.currentGradeLevel || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-km-charcoal/55">Current Track / Program:</span>{" "}
                      <span className="font-semibold">{item.currentProgram || "N/A"}</span>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-km-charcoal/55">Highest Attainment:</span>{" "}
                    <span className="font-semibold">{item.highestAttainment || "N/A"}</span>
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
                {getProgramBySlug(item.program)?.name || item.program}
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
  );
}
