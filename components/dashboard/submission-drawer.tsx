"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getProgramBySlug } from "@/lib/programs";
import { tesdaPdfPath } from "@/lib/tesda-form";
import { cn } from "@/lib/utils";
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type DashboardSubmission,
  type SubmissionStatus,
} from "@/lib/dashboard";

export function SubmissionDrawer({
  item,
  updatingId,
  onClose,
  onStatusChange,
  startWithForm = false,
}: {
  item: DashboardSubmission;
  updatingId: string | null;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  /** Opens the drawer straight into the A4 registration form. */
  startWithForm?: boolean;
}) {
  // Status change awaiting admin confirmation
  const [pendingStatus, setPendingStatus] = useState<SubmissionStatus | null>(null);
  // Full A4 Learners Profile Form (TESDA MIS 03-01)
  const [showForm, setShowForm] = useState(startWithForm);

  const formUrl = tesdaPdfPath(item.referenceNumber);

  // Close the confirmation first, then the form, then the drawer, with Escape
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (pendingStatus) {
        setPendingStatus(null);
        return;
      }
      if (showForm) {
        setShowForm(false);
        return;
      }
      onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pendingStatus, showForm]);

  const activeStatus =
    STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  const pendingConfig = pendingStatus ? STATUS_CONFIG[pendingStatus] : null;

  function confirmPendingStatus() {
    if (!pendingStatus) return;
    onStatusChange(item.id, pendingStatus);
    setPendingStatus(null);
  }

  const STATUS_CONFIRM_COPY: Record<SubmissionStatus, string> = {
    PENDING:
      "The applicant goes back to Pending Review. Use this when the submission still needs to be reassessed.",
    CONTACTED:
      "The applicant is marked as Contacted. Use this once you have reached out to them about their pre-registration.",
    ENROLLED:
      "The applicant is marked as officially Enrolled. Confirm this only after the enrollment requirements are complete.",
    ARCHIVED:
      "The applicant is moved to Archived and leaves the active queue. Use this for closed or withdrawn applications.",
  };

  return (
    <>
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
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-brand text-base font-bold uppercase tracking-[0.06em] text-black sm:text-lg">
                  Ref Code:
                </span>
                <span className="select-all font-mono text-base font-bold uppercase leading-none tracking-[0.08em] text-km-orange sm:text-lg">
                  {item.referenceNumber}
                </span>
              </div>
              <h3 className="mt-3 font-brand text-xl font-semibold leading-tight text-km-charcoal">
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
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/45">
                  Current Status
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                    activeStatus.bg
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus.dot)} />
                  {activeStatus.label}
                </span>
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-medium",
                  updatingId === item.id ? "text-km-orange" : "text-km-charcoal/45"
                )}
              >
                {updatingId === item.id ? (
                  <>
                    <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving changes…
                  </>
                ) : (
                  "Tap a status to update this applicant"
                )}
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
                    onClick={() => setPendingStatus(st)}
                    disabled={isSaving || isCurrent}
                    aria-pressed={isCurrent}
                    aria-label={
                      isCurrent
                        ? `${config.label} — current status`
                        : `Change status to ${config.label}`
                    }
                    title={
                      isCurrent
                        ? `${config.label} is the current status`
                        : `Change status to ${config.label}`
                    }
                    className={cn(
                      "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange/40 focus-visible:ring-offset-1",
                      isCurrent
                        ? cn(config.bg, "cursor-default shadow-sm")
                        : "cursor-pointer border-km-charcoal/15 bg-white text-km-charcoal/75 shadow-[0_1px_2px_rgba(37,37,37,0.06)] hover:-translate-y-0.5 hover:border-km-orange/60 hover:bg-km-orange/5 hover:text-km-orange hover:shadow-md active:translate-y-0 active:scale-[0.97]",
                      isSaving && !isCurrent && "cursor-wait opacity-60 hover:translate-y-0 hover:shadow-none"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        isCurrent ? config.dot : "bg-km-charcoal/25"
                      )}
                    />
                    {st.charAt(0) + st.slice(1).toLowerCase()}
                    {isCurrent && (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-km-charcoal/45">
              <svg className="mt-px h-3 w-3 shrink-0 text-km-orange/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m0 3.75h.008M12 21a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <span>
                Pick any status to open a confirmation first — the applicant stays unchanged until you confirm.
              </span>
            </p>
          </div>

          {/* A4 Pre-Registration Form */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-km-orange/25 bg-gradient-to-br from-km-orange/[0.09] via-white to-km-warm-white/80 p-4 shadow-[0_16px_40px_-30px_rgba(234,88,12,0.75)]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-km-orange text-white shadow-[0_10px_22px_-12px_rgba(234,88,12,0.95)]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.9}
                    d="M7 3.75h6.19a1.5 1.5 0 0 1 1.06.44l3.56 3.56a1.5 1.5 0 0 1 .44 1.06v10.44a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.9}
                    d="M13 4v4.25h4.25M9 13h6M9 16.25h4"
                  />
                </svg>
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-km-orange/80">
                  TESDA MIS 03 – 01
                </p>
                <p className="font-brand text-sm font-bold leading-tight text-km-charcoal">
                  Pre-Registration Form
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-km-charcoal/55">
                  A4 &middot; answers already filled in from this application
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-km-orange px-4 py-2.5 text-xs font-semibold text-white shadow-[0_12px_26px_-14px_rgba(234,88,12,0.95)] transition-all hover:-translate-y-0.5 hover:bg-km-orange/90 hover:shadow-[0_16px_30px_-14px_rgba(234,88,12,0.95)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange/40 focus-visible:ring-offset-1"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z"
                  />
                  <circle cx="12" cy="12" r="2.75" strokeWidth={2} />
                </svg>
                View form
              </button>

              <a
                href={formUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-km-charcoal/15 bg-white px-4 py-2.5 text-xs font-semibold text-km-charcoal/75 transition-colors hover:border-km-orange/50 hover:text-km-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange/30 focus-visible:ring-offset-1"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.5 5.25H18a.75.75 0 0 1 .75.75v4.5M18 6l-7.5 7.5M10.5 4.5H6.75a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V13.5"
                  />
                </svg>
                Open in new tab
              </a>
            </div>
          </div>

          {/* Modal Body Sections */}
          <div className="mt-6 space-y-4 text-sm text-km-charcoal">
            {/* Section I: Personal Info */}
            <section className="rounded-2xl border border-white bg-white/40 p-4 shadow-[0_1px_3px_rgba(37,37,37,0.05)]">
              <h4 className="font-brand text-sm font-bold uppercase tracking-[0.1em] text-km-charcoal/70 sm:text-[15px]">
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
                  <span className="text-km-charcoal/55">Sex</span>
                  <div className="font-semibold">{item.sex || "N/A"}</div>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Civil Status</span>
                  <div className="font-semibold">{item.civilStatus || "N/A"}</div>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Nationality</span>
                  <div className="font-semibold">{item.nationality || "N/A"}</div>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Birthdate</span>
                  <div className="font-semibold">
                    {item.birthMonth && item.birthDay && item.birthYear
                      ? `${item.birthMonth}/${item.birthDay}/${item.birthYear}`
                      : "N/A"}
                    {item.age != null ? ` · ${item.age} yrs old` : ""}
                  </div>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Employment Status</span>
                  <div className="font-semibold">
                    {item.employmentStatus || "N/A"}
                    {item.employmentType ? ` · ${item.employmentType}` : ""}
                  </div>
                </div>
              </div>
            </section>

            {/* Section II: Complete Address */}
            <section className="rounded-2xl border border-white bg-white/40 p-4 shadow-[0_1px_3px_rgba(37,37,37,0.05)]">
              <h4 className="font-brand text-sm font-bold uppercase tracking-[0.1em] text-km-charcoal/70 sm:text-[15px]">
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
            <section className="rounded-2xl border border-white bg-white/40 p-4 shadow-[0_1px_3px_rgba(37,37,37,0.05)]">
              <h4 className="font-brand text-sm font-bold uppercase tracking-[0.1em] text-km-charcoal/70 sm:text-[15px]">
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
                    <span className="font-semibold">
                      {item.educationalAttainment || item.highestAttainment || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Section IV: Birthplace, Classification & Scholarship */}
            <section className="rounded-2xl border border-white bg-white/40 p-4 shadow-[0_1px_3px_rgba(37,37,37,0.05)]">
              <h4 className="font-brand text-sm font-bold uppercase tracking-[0.1em] text-km-charcoal/70 sm:text-[15px]">
                IV. Birthplace, Classification & Scholarship
              </h4>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-km-charcoal/55">Birthplace:</span>{" "}
                  <span className="font-semibold">
                    {[item.birthCity, item.birthProvince, item.birthRegion]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Scholarship Package:</span>{" "}
                  <span className="font-semibold">
                    {item.scholarshipPackage || "Not a scholar"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-km-charcoal/55">Classification:</span>{" "}
                  <span className="font-semibold">
                    {[
                      ...(item.classification || []).map((entry) =>
                        entry === "Others" && item.classificationOthers
                          ? `Others: ${item.classificationOthers}`
                          : entry
                      ),
                    ].join("; ") || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">Parent/Guardian:</span>{" "}
                  <span className="font-semibold">{item.parentName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-km-charcoal/55">
                    Parent/Guardian Address:
                  </span>{" "}
                  <span className="font-semibold">
                    {item.parentAddress || "N/A"}
                  </span>
                </div>
              </div>
            </section>

            {/* Section V: Program Applied */}
            <section className="rounded-2xl border border-white bg-gradient-to-br from-km-orange/5 to-km-warm-white/60 p-4 shadow-[0_1px_3px_rgba(37,37,37,0.05)]">
              <h4 className="font-brand text-sm font-bold uppercase tracking-[0.1em] text-km-charcoal/70 sm:text-[15px]">
                V. Program Applied
              </h4>
              <div className="mt-2 text-lg font-bold leading-snug text-km-orange">
                {getProgramBySlug(item.program)?.name || item.program}
              </div>
              <div className="mt-1 text-[11px] text-km-charcoal/60">
                3-Year Diploma Program • PQF Level 5 Qualification
              </div>
            </section>

            {/* Section VI: Consent & Acknowledgement */}
            <section className="rounded-2xl border border-white bg-km-warm-white/70 p-4 text-[11px] text-km-charcoal/65 shadow-[0_1px_3px_rgba(37,37,37,0.05)]">
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

    {/* Status change confirmation — ported so the overlay covers the whole viewport */}
    {typeof document !== "undefined" &&
      pendingStatus &&
      pendingConfig &&
      createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-confirm-title"
          aria-describedby="status-confirm-description"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-km-charcoal/60 p-4 backdrop-blur-sm"
          onClick={() => setPendingStatus(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-km-orange/10 text-km-orange">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3.75m0 3.75h.008M10.34 3.94l-7.5 12.99A1.75 1.75 0 004.35 19.5h15.3a1.75 1.75 0 001.51-2.57l-7.5-12.99a1.75 1.75 0 00-3.02 0z"
                  />
                </svg>
              </span>

              <div className="min-w-0">
                <h4
                  id="status-confirm-title"
                  className="font-heading text-lg font-bold leading-tight text-km-charcoal sm:text-xl"
                >
                  Confirm status change
                </h4>
                <p
                  id="status-confirm-description"
                  className="mt-1.5 text-sm leading-relaxed text-km-charcoal/60"
                >
                  You are about to change the application status of
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="font-heading text-base font-bold leading-snug text-km-charcoal sm:text-lg">
                {item.firstName} {item.middleName || ""} {item.lastName}{" "}
                {item.suffix || ""}
              </p>
              <p className="mt-0.5 truncate text-xs text-km-charcoal/50">
                {getProgramBySlug(item.program)?.name || item.program}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-km-charcoal/10 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/45">
                    Current
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                      activeStatus.bg
                    )}
                  >
                    {activeStatus.label}
                  </span>
                </div>
                <svg className="mt-4 h-4 w-4 shrink-0 text-km-charcoal/35" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/45">
                    New
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                      pendingConfig.bg
                    )}
                  >
                    {pendingConfig.label}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-km-charcoal/45">
              What this means
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-km-charcoal/75 sm:text-[15px]">
              {STATUS_CONFIRM_COPY[pendingStatus]}
            </p>


            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                className="rounded-full border border-km-charcoal/15 bg-white px-5 py-2 text-xs font-semibold text-km-charcoal/70 transition-colors hover:border-km-charcoal/30 hover:text-km-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPendingStatus}
                className="rounded-full bg-km-orange px-5 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_-12px_rgba(234,88,12,0.9)] transition-colors hover:bg-km-orange/90"
              >
                Confirm change
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    {/* Full A4 Learners Profile Form (TESDA MIS 03-01) */}
    {showForm ? (
      <div className="fixed inset-0 z-[80] flex flex-col bg-km-charcoal/70 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 shadow-sm sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/45">
              TESDA MIS 03 – 01 · Learners Profile Form
            </p>
            <p className="font-brand text-sm font-semibold text-km-charcoal">
              {item.lastName}, {item.firstName} ·{" "}
              <span className="font-mono text-km-orange">{item.referenceNumber}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] text-km-charcoal/50 sm:inline">
              Two A4 pages · print at 100% scale, margins none
            </span>
            <a
              href={formUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-km-charcoal/15 bg-white px-4 py-2 text-xs font-semibold text-km-charcoal/75 transition-colors hover:border-km-orange/50 hover:text-km-orange"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.5 5.25H18a.75.75 0 0 1 .75.75v4.5M18 6l-7.5 7.5M10.5 4.5H6.75a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V13.5"
                />
              </svg>
              Open in new tab
            </a>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-km-charcoal/15 bg-white px-5 py-2 text-xs font-semibold text-km-charcoal/70 transition-colors hover:border-km-charcoal/30 hover:text-km-charcoal"
            >
              Close
            </button>
          </div>
        </div>
        <iframe
          src={formUrl}
          title={`Learners Profile Form for ${item.referenceNumber}`}
          className="min-h-0 w-full flex-1 bg-stone-300"
        />
      </div>
    ) : null}
    </>
  );
}
