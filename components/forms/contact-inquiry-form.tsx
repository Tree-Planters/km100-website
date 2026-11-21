"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  contactInquirySchema,
  type ContactInquiryInput,
} from "@/lib/validation";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.18em] text-km-charcoal";

const fieldClass =
  "mt-2 w-full border-0 border-b border-km-charcoal/40 bg-transparent pb-2.5 text-[15px] text-km-charcoal outline-none transition-colors placeholder:text-km-charcoal/35 focus:border-km-orange";

export function ContactInquiryForm() {
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryInput>({
    resolver: zodResolver(contactInquirySchema),
  });

  async function onSubmit(values: ContactInquiryInput) {
    setSubmitError(null);

    const response = await fetch("/api/contact-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setSubmitError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setIsSent(true);
  }

  if (isSent) {
    return (
      <div className="border-t border-km-charcoal/25 pt-6">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-km-orange">
          Sent
        </p>
        <h3 className="mt-3 font-heading text-2xl">Message received.</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-km-charcoal/60">
          Thank you for reaching out. We will get back to you as soon as
          possible during office hours.
        </p>
        <ButtonLink href="/" variant="outline" className="mt-6">
          Back to homepage
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            className={fieldClass}
            placeholder="Juan Dela Cruz"
            autoComplete="name"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            className={fieldClass}
            placeholder="juan@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <input
            id="subject"
            className={fieldClass}
            placeholder="Admission requirements for Computer Engineering Technology"
            {...register("subject")}
          />
          {errors.subject ? (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.subject.message}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className={cn(fieldClass, "resize-y leading-relaxed")}
            placeholder="Tell us what you would like to know — include the program you are asking about."
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      {submitError ? (
        <p className="mt-6 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "mt-9 inline-flex h-12 items-center justify-center rounded-full bg-km-charcoal px-9 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-km-orange",
          isSubmitting && "cursor-not-allowed opacity-60",
        )}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
