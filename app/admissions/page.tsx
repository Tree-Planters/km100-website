import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission information, pre-registration guidance and next steps for KM100 Skills and Training Center, Inc.",
};

/*
  Step artwork slots. Replace the inline SVG in any of these with your own
  image or SVG, e.g.:

    <Image src="/admissions/step-1.svg" alt="" width={240} height={180} />
    <img src="/admissions/step-1.png" alt="" className="h-full w-full object-contain" />

  The wrapper already handles sizing and the warm tile behind the art.
*/
function ProgramArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="h-full w-full">
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="12" width="17" height="13" rx="2.5" />
        <rect x="7" y="31" width="17" height="13" rx="2.5" />
        <rect x="30" y="12" width="10" height="13" rx="2.5" className="text-km-charcoal/25" />
        <path d="M11 18.5h9M11 24h5M11 37.5h9M11 43h5" />
      </g>
      <rect x="28.5" y="30.5" width="16" height="16" rx="4" className="fill-km-orange" />
      <path
        d="M33 38.5l3 3 5.5-5.5"
        fill="none"
        stroke="#fff"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="h-full w-full">
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 9h24l8 8v38H16z" />
        <path d="M39 9v9h9" className="text-km-charcoal/40" />
        <path d="M23 25h18M23 32h18M23 39h10" />
      </g>
      <circle cx="43" cy="45" r="9" className="fill-km-orange" />
      <path
        d="M39 45.2l2.8 2.8 5.4-5.4"
        fill="none"
        stroke="#fff"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResponseArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="h-full w-full">
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="18" width="40" height="29" rx="3.5" />
        <path d="M9 20.5L28 34l19-13.5" />
        <path d="M14 41l9.5-9M42 41l-9.5-9" className="text-km-charcoal/30" />
      </g>
      <circle cx="47" cy="17" r="6.5" className="fill-km-orange" />
      <path d="M47 22v-9" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
      <path d="M47 13l-3.2 3.2M47 13l3.2 3.2" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
    </svg>
  );
}

function EnrollmentArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="h-full w-full">
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 9l18 6.5v16.5c0 10.5-7.4 17.8-18 22-10.6-4.2-18-11.5-18-22V15.5z" />
        <path d="M32 9l18 6.5-18 6.5L14 15.5z" className="text-km-charcoal/30" />
      </g>
      <path
        d="M23.5 33.5l6 6 11.5-11.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-km-orange"
      />
    </svg>
  );
}

type Step = {
  title: string;
  body: string;
  art: ReactNode;
  action?: ReactNode;
};

const steps: Step[] = [
  {
    title: "Choose a preferred program",
    body: "Review our five TESDA-registered, PQF Level 5 diploma programs and pick the track that fits your goals.",
    art: <ProgramArt />,
    action: (
      <ButtonLink href="/programs" variant="outline" shape="pill" className="mt-4 self-start">
        Explore programs
      </ButtonLink>
    ),
  },
  {
    title: "Complete the pre-registration form",
    body: "Fill in your details and select your preferred program in the online pre-registration form.",
    art: <FormArt />,
    action: (
      <ButtonLink href="/pre-registration" shape="pill" className="mt-4 self-start">
        Start pre-registration
      </ButtonLink>
    ),
  },
  {
    title: "Wait for the school's response",
    body: "Our admissions team reviews your submission and gets in touch with the result and your next instructions.",
    art: <ResponseArt />,
  },
  {
    title: "Proceed with the official admission process",
    body: "Once your registration is confirmed, follow the instructions from KM100 to complete official admission and enrollment.",
    art: <EnrollmentArt />,
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        title="Admissions"
        description="Admission information and pre-registration guidance."
      />

      <Section>
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-km-orange">
              Admission Process
            </p>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
              How to apply
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-km-charcoal/60 sm:text-base">
              Four steps, from choosing a program to official enrollment.
            </p>
          </div>

          {/* Vertical timeline — phones and tablets */}
          <ol className="mt-10 max-w-4xl xl:hidden">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;

              return (
                <li
                  key={step.title}
                  className={
                    index === 0
                      ? "grid grid-cols-[2.5rem_2.75rem_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[3rem_2.75rem_minmax(0,1fr)] sm:gap-x-4 md:grid-cols-[13rem_3.5rem_minmax(0,1fr)] md:gap-x-6 lg:grid-cols-[15rem_4rem_minmax(0,1fr)] lg:gap-x-8"
                      : "grid grid-cols-[2.5rem_2.75rem_minmax(0,1fr)] items-start gap-x-3 pt-10 sm:grid-cols-[3rem_2.75rem_minmax(0,1fr)] sm:gap-x-4 md:grid-cols-[13rem_3.5rem_minmax(0,1fr)] md:gap-x-6 md:pt-12 lg:grid-cols-[15rem_4rem_minmax(0,1fr)] lg:gap-x-8"
                  }
                >
                  <div className="flex items-start justify-center pt-1">
                    <div className="aspect-square w-full text-km-charcoal/70 md:text-km-charcoal/60">
                      {step.art}
                    </div>
                  </div>

                  <div className="relative flex self-stretch justify-center">
                    {isLast ? null : (
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-[1.375rem] -bottom-10 w-0 -translate-x-1/2 border-l border-dashed border-km-charcoal/25 md:top-6 md:-bottom-12"
                      />
                    )}
                    <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-km-orange font-brand text-sm font-bold text-white ring-4 ring-white md:size-12">
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 pt-1 md:pt-2">
                    <h3 className="font-brand text-base font-bold tracking-[-0.01em] text-km-charcoal sm:text-lg md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-km-charcoal/70 md:mt-2 md:text-[15px]">
                      {step.body}
                    </p>
                    {step.action}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Four across — desktop: bare icons under one flowing dashed line */}
          <div className="relative mt-14 hidden xl:block">
            <svg
              viewBox="0 0 1000 64"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full"
            >
              <path
                d="M0 32 Q65.4 6 130.8 32 T261.6 32 T392.4 32 T523.2 32 T654 32 T784.8 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray="7 8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="text-km-charcoal/30"
              />
            </svg>

            <ol className="relative grid grid-cols-4 gap-x-14">
              {steps.map((step, index) => (
                <li key={step.title} className="flex flex-col">
                  <div className="relative z-10 flex size-16 items-center justify-center bg-white text-km-charcoal/70">
                    {step.art}
                  </div>

                  <div className="mt-5 flex items-start gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-km-orange font-brand text-[12px] font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="pt-1 font-brand text-lg font-bold tracking-[-0.01em] text-km-charcoal">
                      {step.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-[14px] leading-relaxed text-km-charcoal/70">
                    {step.body}
                  </p>
                  {step.action}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 max-w-3xl rounded-3xl border border-km-charcoal/10 bg-km-warm-white/70 p-6 shadow-[0_28px_60px_-46px_rgba(37,37,37,0.55)] backdrop-blur-sm sm:p-7 lg:mt-20">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-km-orange/10 text-km-orange ring-1 ring-inset ring-km-orange/20">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
                  <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth={1.5} />
                  <path
                    d="M12 7.5v5.75"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16.4" r="1.05" fill="currentColor" />
                </svg>
              </span>

              <div className="min-w-0">
                <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.22em] text-km-orange">
                  Note
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-km-charcoal/80 sm:text-sm">
                  Submitting this pre-registration form does not constitute
                  official admission or enrollment. Your registration will be
                  subject to confirmation and further instructions from KM100.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
