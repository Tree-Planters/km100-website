"use client";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";

import { STEPS } from "./form-types";
import {
  StepClassification,
  StepCourse,
  StepEducation,
  StepNameAndAddress,
  StepPersonal,
  StepReview,
} from "./steps";
import { SuccessScreen } from "./success";
import { Spinner } from "./ui";
import {
  RegistrationProvider,
  useRegistration,
} from "./use-registration";

export default function PreRegistrationPage() {
  return (
    <RegistrationProvider>
      <PreRegistrationContent />
    </RegistrationProvider>
  );
}

function PreRegistrationContent() {
  const {
    step,
    maxStep,
    submitError,
    isSubmitting,
    referenceNumber,
    clearForm,
    goBack,
    goNext,
    goToStep,
    handleSubmit,
  } = useRegistration();

  if (referenceNumber) return <SuccessScreen />;

  const isReview = step === STEPS.length - 1;

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="mt-2 font-brand text-2xl font-bold tracking-tight text-km-charcoal sm:text-3xl">
              Pre-Registration
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-km-charcoal/70">
              Answer honestly, based on your own details. What you enter fills your
              Learners Profile Form, and our admissions team will review it.
            </p>
          </div>

          <button
            type="button"
            onClick={clearForm}
            className="inline-flex items-center gap-1.5 rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-xs font-semibold text-km-charcoal/70 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
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
                strokeWidth={2.2}
                d="M6 7h12M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7 0 .6 11.1A1.5 1.5 0 0 0 10.1 19.5h3.8a1.5 1.5 0 0 0 1.5-1.4L16 7"
              />
            </svg>
            Clear form
          </button>
        </div>

        {/* Step rail */}
        <ol className="mb-6 grid auto-rows-fr grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((item, index) => {
            const isCurrent = index === step;
            const isDone = index < step;
            const isLocked = index > maxStep;
            return (
              <li key={item.title} className="h-full">
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  disabled={isLocked}
                  aria-current={isCurrent ? "step" : undefined}
                  title={isLocked ? "Fill the earlier steps first" : item.title}
                  className={cn(
                    "flex h-full w-full flex-col justify-between gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-colors",
                    isCurrent
                      ? "border-km-orange bg-km-orange/10"
                      : isDone
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-km-charcoal/12 bg-white",
                    isLocked
                      ? "cursor-not-allowed opacity-50"
                      : isCurrent
                        ? "cursor-default"
                        : "cursor-pointer hover:border-km-orange/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      isCurrent
                        ? "bg-km-orange text-white"
                        : isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-km-charcoal/10 text-km-charcoal/60"
                    )}
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-km-charcoal">
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (isReview) void handleSubmit();
            else goNext();
          }}
          noValidate
          className="space-y-6"
        >
          <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-km-charcoal/10 pb-4">
              <span className="rounded-full bg-km-orange/10 px-3 py-1 text-[11px] font-semibold text-km-orange">
                Step {step + 1} of {STEPS.length}
              </span>
              <h2 className="font-brand text-lg font-bold tracking-tight text-km-charcoal sm:text-xl">
                {STEPS[step].title}
              </h2>
            </div>

            <div className="mt-6">
              {step === 0 ? <StepNameAndAddress /> : null}

              {step === 1 ? <StepPersonal /> : null}

              {step === 2 ? <StepEducation /> : null}

              {step === 3 ? <StepClassification /> : null}

              {step === 4 ? <StepCourse /> : null}

              {step === 5 ? <StepReview /> : null}
            </div>
          </section>

          {submitError ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || isSubmitting}
              className={cn(
                "rounded-md border border-km-charcoal/20 px-5 py-2.5 text-sm font-semibold text-km-charcoal transition-colors",
                step === 0
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-km-orange hover:text-km-orange"
              )}
            >
              Back
            </button>

            {isReview ? (
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className={cn(
                    "inline-flex min-w-[15rem] items-center justify-center gap-2.5 rounded-md px-8 py-3 text-base font-semibold text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange/40 focus-visible:ring-offset-2",
                    isSubmitting
                      ? "cursor-progress bg-km-orange/80 shadow-none"
                      : "bg-km-orange hover:bg-km-orange/90 active:scale-[0.99]"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      <span>Preparing your form…</span>
                    </>
                  ) : (
                    "Submit Pre-Registration"
                  )}
                </button>
                <p
                  aria-live="polite"
                  className={cn(
                    "text-xs transition-opacity",
                    isSubmitting
                      ? "text-km-charcoal/60"
                      : "pointer-events-none opacity-0"
                  )}
                >
                  Saving your registration and filling the form — a few
                  seconds.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-km-orange px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-km-orange/90"
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}
