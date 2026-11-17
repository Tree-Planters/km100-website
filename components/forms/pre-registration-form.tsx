"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";
import { cn } from "@/lib/utils";
import {
  preRegistrationSchema,
  type PreRegistrationInput,
} from "@/lib/validation";

const inputClass =
  "mt-1 w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm outline-none focus:border-km-orange";

export function PreRegistrationForm() {
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreRegistrationInput>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: { consent: false },
  });

  async function onSubmit(values: PreRegistrationInput) {
    setSubmitError(null);

    const response = await fetch("/api/pre-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setSubmitError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setReferenceNumber(data.referenceNumber);
  }

  if (referenceNumber) {
    return (
      <div className="rounded-xl border border-km-orange/40 bg-km-warm-white p-8 text-center">
        <h2 className="font-heading text-2xl">Pre-registration received</h2>
        <p className="mt-3 text-sm text-km-charcoal/70">
          Keep your reference number:{" "}
          <span className="font-semibold text-km-charcoal">
            {referenceNumber}
          </span>
        </p>
        <p className="mt-2 text-sm text-km-charcoal/70">
          This is pre-registration only, not official enrollment.
        </p>
        <ButtonLink href="/programs" variant="outline" className="mt-6">
          Explore our programs
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">
            First name
          </label>
          <input id="firstName" className={inputClass} {...register("firstName")} />
          {errors.firstName ? (
            <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="middleName" className="text-sm font-medium">
            Middle name
          </label>
          <input id="middleName" className={inputClass} {...register("middleName")} />
        </div>

        <div>
          <label htmlFor="lastName" className="text-sm font-medium">
            Last name
          </label>
          <input id="lastName" className={inputClass} {...register("lastName")} />
          {errors.lastName ? (
            <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="suffix" className="text-sm font-medium">
            Suffix
          </label>
          <input id="suffix" className={inputClass} {...register("suffix")} />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mobile" className="text-sm font-medium">
            Mobile number
          </label>
          <input id="mobile" type="tel" className={inputClass} {...register("mobile")} />
          {errors.mobile ? (
            <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="program" className="text-sm font-medium">
            Program
          </label>
          <select id="program" className={inputClass} {...register("program")}>
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.slug} value={program.slug}>
                {program.name}
              </option>
            ))}
          </select>
          {errors.program ? (
            <p className="mt-1 text-xs text-red-600">{errors.program.message}</p>
          ) : null}
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-km-charcoal/80">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-km-orange"
          {...register("consent")}
        />
        <span>
          I confirm the information above is accurate and I accept the privacy
          notice. I understand this is pre-registration, not official
          enrollment.
        </span>
      </label>
      {errors.consent ? (
        <p className="text-xs text-red-600">{errors.consent.message}</p>
      ) : null}

      {submitError ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-km-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-km-orange/90",
          isSubmitting && "cursor-not-allowed opacity-60",
        )}
      >
        {isSubmitting ? "Submitting…" : "Submit pre-registration"}
      </button>
    </form>
  );
}
