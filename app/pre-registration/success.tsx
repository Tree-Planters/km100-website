"use client";

import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";
import { tesdaPdfPath } from "@/lib/tesda-form";
import { cn } from "@/lib/utils";

import { DownloadIcon, MailIcon } from "./ui";
import { useRegistration } from "./use-registration";

/** Shown instead of the stepper once a submission returns a reference number. */
export function SuccessScreen() {
  const { form, referenceNumber, confirmationEmailSent } = useRegistration();

  if (!referenceNumber) return null;

  const submittedProgram =
    programs.find((program) => program.slug === form.program)?.name ?? null;
  const emailFailed = confirmationEmailSent === false;

  const nextSteps = [
    {
      title: "Print your Pre-Registration Form",
      body: "Download it below and print it on A4 paper, back to back — both pages on one sheet.",
    },
    {
      title: "Attach a 1×1 ID picture",
      body: "Paste it on the picture box at the top of the printed form.",
    },
    {
      title: "Sign it and visit admissions",
      body: "Bring the signed form to the KM100 admissions office.",
    },
  ];

  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-km-charcoal/12 bg-white shadow-sm">
          {/* Header band */}
          <div className="border-b border-km-charcoal/10 bg-km-warm-white px-6 py-8 sm:px-10 sm:py-9">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-km-orange">
                  Pre-registration complete
                </p>
                <h2 className="mt-1 font-brand text-2xl font-bold tracking-tight text-km-charcoal sm:text-3xl">
                  Pre-Registration Received
                </h2>
                <p className="mt-1.5 text-sm text-km-charcoal/70">
                  {form.firstName
                    ? `Thank you, ${form.firstName}.`
                    : "Thank you."}{" "}
                  {submittedProgram
                    ? `You are pre-registered for ${submittedProgram}.`
                    : "Your details are now on file."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-7 sm:px-10 sm:py-9 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
            {/* Left: email notice + next steps */}
            <div className="space-y-7">
              <div
                className={cn(
                  "flex gap-3.5 rounded-xl border p-4",
                  emailFailed
                    ? "border-amber-200 bg-amber-50/60"
                    : "border-km-charcoal/12 bg-km-warm-white/60"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0",
                    emailFailed ? "text-amber-600" : "text-km-orange"
                  )}
                >
                  <MailIcon />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-km-charcoal">
                    {emailFailed
                      ? "Your pre-registration is saved"
                      : "Check your email"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-km-charcoal/70">
                    {emailFailed ? (
                      <>
                        We couldn&rsquo;t send the confirmation email to{" "}
                        <strong className="break-all font-semibold text-km-charcoal">
                          {form.email}
                        </strong>{" "}
                        just now, but your details are on file. Our admissions
                        team will still review your submission and contact you
                        with the next steps.
                      </>
                    ) : (
                      <>
                        We sent a confirmation to{" "}
                        <strong className="break-all font-semibold text-km-charcoal">
                          {form.email}
                        </strong>
                        . It holds your reference number, a copy of the details
                        you entered, and your Pre-Registration Form attached as
                        a PDF. If it hasn&rsquo;t arrived in a few minutes, check
                        your spam folder.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-km-charcoal">
                  What to do next
                </h3>
                <ol className="mt-3 space-y-3.5">
                  {nextSteps.map((item, index) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-km-orange/10 text-[11px] font-bold text-km-orange">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-km-charcoal">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-km-charcoal/65">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: actions, a compact panel on phones */}
            <aside className="space-y-4">
              <div className="rounded-xl border border-km-charcoal/12 bg-km-warm-white/50 p-5">
                <p className="text-sm font-semibold text-km-charcoal">
                  Your form is ready
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-km-charcoal/60">
                  Download the PDF, then print it on A4 back to back, attach
                  your 1×1 picture and sign it.
                </p>
                <a
                  href={tesdaPdfPath(referenceNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-km-orange px-4 py-3 text-center text-[13px] font-semibold leading-snug text-white shadow-sm transition-colors hover:bg-km-orange/90 sm:text-sm"
                >
                  <DownloadIcon />
                  {"Download Pre\u2011Registration Form"}
                </a>
              </div>

              <div className="space-y-2 border-t border-km-charcoal/10 pt-4">
                <ButtonLink
                  href="/programs"
                  variant="outline"
                  className="w-full px-4 py-2.5 text-xs"
                >
                  Explore our programs
                </ButtonLink>
                <ButtonLink
                  href="/"
                  variant="outline"
                  className="w-full px-4 py-2.5 text-xs"
                >
                  Return to Home
                </ButtonLink>
              </div>
            </aside>
          </div>

          <div className="border-t border-km-charcoal/10 bg-km-warm-white px-6 py-4 sm:px-10">
            <p className="text-[11px] leading-relaxed text-km-charcoal/60">
              This form serves as pre-registration only, not official
              enrollment. Our admissions team reviews every submission and
              will contact you with the next steps.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
