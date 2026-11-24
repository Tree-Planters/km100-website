"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";
import { cn } from "@/lib/utils";
import {
  preRegistrationSchema,
  CIVIL_STATUS_OPTIONS,
  HIGHEST_ATTAINMENT_OPTIONS,
  type PreRegistrationInput,
} from "@/lib/validation";

const inputClass =
  "mt-1 w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange focus:ring-1 focus:ring-km-orange";

export function PreRegistrationForm() {
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PreRegistrationInput>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      middleName: "",
      suffix: "",
      mobile: "",
      email: "",
      address: "",
      barangay: "",
      district: "",
      municipality: "",
      province: "",
      region: "",
      currentSchool: "",
      currentGradeLevel: "",
      currentProgram: "",
      highestAttainment: "",
      acknowledgement: false,
      consent: false,
    },
  });

  const isCurrentlyEnrolled = watch("isCurrentlyEnrolled");

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

    setEmailSent(data.confirmationEmailSent !== false);
    setReferenceNumber(data.referenceNumber);
  }

  if (referenceNumber) {
    return (
      <div className="rounded-xl border border-km-orange/40 bg-km-warm-white p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-km-orange/10 text-km-orange">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-bold text-km-charcoal">
          Pre-Registration Received
        </h2>
        <p className="mt-3 text-sm text-km-charcoal/80">
          Your reference code has been sent to the email address you entered.
          Please check your inbox to get it.
        </p>
        <div className="mx-auto mt-6 max-w-lg rounded-xl border border-km-orange/40 bg-km-orange/5 p-4 text-left">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-km-orange">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            Check your email
          </p>
          <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-km-charcoal/80">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-km-orange" />
              <span>
                <strong className="font-semibold text-km-charcoal">
                  Make sure it is your own official email account
                </strong>{" "}
                (for example, your personal Gmail). The reference code is sent only to
                your registered address:
                {" "}
                <span className="font-semibold break-all text-km-charcoal">{watch("email")}</span>{" "}
                — so if that inbox is not yours, your entry cannot be validated.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-km-orange" />
              <span>
                <strong className="font-semibold text-km-charcoal">
                  Open the email we just sent
                </strong>{" "}
                to get your reference code. If it is not in your inbox after a few minutes,
                check your Spam, Junk, or Promotions folder.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-km-orange" />
              <span>
                <strong className="font-semibold text-km-charcoal">
                  Screenshot that email
                </strong>{" "}
                or save the reference code. It serves as your validation for entry, and
                without it staff may not be able to locate or verify your pre-registration
                record.
              </span>
            </li>
          </ul>
        </div>
        <p className="mx-auto mt-4 max-w-md text-xs text-km-charcoal/70">
          {emailSent
            ? "A confirmation email with your reference number and the details you submitted has been sent to your email address."
            : "We could not send the confirmation email, so please keep or screenshot this reference number."}
        </p>
        <p className="mx-auto mt-3 max-w-md text-xs text-km-charcoal/70">
          This form serves as pre-registration only, not official enrollment. Our
          admissions team will contact you regarding required documents and
          enrollment schedules.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/programs" variant="outline">
            Explore our programs
          </ButtonLink>
          <ButtonLink href="/">Return to Home</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* SECTION I: PERSONAL INFORMATION */}
      <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
        <div className="border-b border-km-charcoal/10 pb-4">
          <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
            I. Personal Information
          </h3>
          <p className="mt-1 text-xs text-km-charcoal/70">
            Please provide your legal name, contact details, and current residential address.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Full Name Fields */}
          <div>
            <label className="block text-sm font-semibold text-km-charcoal">
              Full Name: <span className="font-normal text-km-charcoal/70">(Last Name, First Name, Middle Name)</span>
            </label>
            <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="lastName" className="text-xs font-medium text-km-charcoal/80">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  placeholder="e.g. Dela Cruz"
                  className={inputClass}
                  {...register("lastName")}
                />
                {errors.lastName ? (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="firstName" className="text-xs font-medium text-km-charcoal/80">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  placeholder="e.g. Juan"
                  className={inputClass}
                  {...register("firstName")}
                />
                {errors.firstName ? (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="middleName" className="text-xs font-medium text-km-charcoal/80">
                  Middle Name <span className="text-km-charcoal/50">(Optional)</span>
                </label>
                <input
                  id="middleName"
                  placeholder="e.g. Santos"
                  className={inputClass}
                  {...register("middleName")}
                />
              </div>

              <div>
                <label htmlFor="suffix" className="text-xs font-medium text-km-charcoal/80">
                  Suffix <span className="text-km-charcoal/50">(e.g. Jr., III)</span>
                </label>
                <input
                  id="suffix"
                  placeholder="e.g. Jr."
                  className={inputClass}
                  {...register("suffix")}
                />
              </div>
            </div>
          </div>

          {/* Contact Details & Civil Status */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="mobile" className="block text-xs font-medium text-km-charcoal/80">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="09XX XXX XXXX"
                className={inputClass}
                {...register("mobile")}
              />
              {errors.mobile ? (
                <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-km-charcoal/80">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={inputClass}
                {...register("email")}
              />
              {errors.email ? (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="civilStatus" className="block text-xs font-medium text-km-charcoal/80">
                Civil Status <span className="text-red-500">*</span>
              </label>
              <select id="civilStatus" className={inputClass} {...register("civilStatus")}>
                <option value="">Select status</option>
                {CIVIL_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.civilStatus ? (
                <p className="mt-1 text-xs text-red-600">{errors.civilStatus.message}</p>
              ) : null}
            </div>
          </div>

          {/* Complete Address */}
          <div>
            <label className="block text-sm font-semibold text-km-charcoal">
              Complete Address
            </label>
            <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="address" className="text-xs font-medium text-km-charcoal/80">
                  Number / Street <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  placeholder="House / Unit / Street"
                  className={inputClass}
                  {...register("address")}
                />
                {errors.address ? (
                  <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="barangay" className="text-xs font-medium text-km-charcoal/80">
                  Barangay <span className="text-red-500">*</span>
                </label>
                <input
                  id="barangay"
                  placeholder="Barangay"
                  className={inputClass}
                  {...register("barangay")}
                />
                {errors.barangay ? (
                  <p className="mt-1 text-xs text-red-600">{errors.barangay.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="district" className="text-xs font-medium text-km-charcoal/80">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  id="district"
                  placeholder="District"
                  className={inputClass}
                  {...register("district")}
                />
                {errors.district ? (
                  <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="municipality" className="text-xs font-medium text-km-charcoal/80">
                  City / Municipality <span className="text-red-500">*</span>
                </label>
                <input
                  id="municipality"
                  placeholder="City or Municipality"
                  className={inputClass}
                  {...register("municipality")}
                />
                {errors.municipality ? (
                  <p className="mt-1 text-xs text-red-600">{errors.municipality.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="province" className="text-xs font-medium text-km-charcoal/80">
                  Province <span className="text-red-500">*</span>
                </label>
                <input
                  id="province"
                  placeholder="Province"
                  className={inputClass}
                  {...register("province")}
                />
                {errors.province ? (
                  <p className="mt-1 text-xs text-red-600">{errors.province.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="region" className="text-xs font-medium text-km-charcoal/80">
                  Region <span className="text-red-500">*</span>
                </label>
                <input
                  id="region"
                  placeholder="e.g. Region VII (Central Visayas)"
                  className={inputClass}
                  {...register("region")}
                />
                {errors.region ? (
                  <p className="mt-1 text-xs text-red-600">{errors.region.message}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION II: EDUCATIONAL INFORMATION */}
      <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
        <div className="border-b border-km-charcoal/10 pb-4">
          <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
            II. Educational Information
          </h3>
          <p className="mt-1 text-xs text-km-charcoal/70">
            Tell us about your current educational status and previous school background.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-km-charcoal">
              Are you currently enrolled in a school or educational Institution?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-3 flex gap-6">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-km-charcoal">
                <input
                  type="radio"
                  value="YES"
                  className="h-4 w-4 accent-km-orange"
                  {...register("isCurrentlyEnrolled")}
                />
                <span className="font-medium">YES</span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-km-charcoal">
                <input
                  type="radio"
                  value="NO"
                  className="h-4 w-4 accent-km-orange"
                  {...register("isCurrentlyEnrolled")}
                />
                <span className="font-medium">NO</span>
              </label>
            </div>
            {errors.isCurrentlyEnrolled ? (
              <p className="mt-2 text-xs text-red-600">{errors.isCurrentlyEnrolled.message}</p>
            ) : null}
          </div>

          {/* Conditional: If YES */}
          {isCurrentlyEnrolled === "YES" && (
            <div className="rounded-lg border border-km-orange/20 bg-km-warm-white/60 p-4 sm:p-6">
              <h4 className="text-sm font-semibold text-km-charcoal">
                If YES, please indicate:
              </h4>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="currentSchool" className="text-xs font-medium text-km-charcoal/80">
                    Name of School <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="currentSchool"
                    placeholder="School name"
                    className={inputClass}
                    {...register("currentSchool")}
                  />
                  {errors.currentSchool ? (
                    <p className="mt-1 text-xs text-red-600">{errors.currentSchool.message}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="currentGradeLevel" className="text-xs font-medium text-km-charcoal/80">
                    Current Grade/Year Level
                  </label>
                  <input
                    id="currentGradeLevel"
                    placeholder="e.g. Grade 12 / 1st Year"
                    className={inputClass}
                    {...register("currentGradeLevel")}
                  />
                </div>

                <div>
                  <label htmlFor="currentProgram" className="text-xs font-medium text-km-charcoal/80">
                    Program / Course
                  </label>
                  <input
                    id="currentProgram"
                    placeholder="e.g. STEM / TVL / General"
                    className={inputClass}
                    {...register("currentProgram")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional: If NO */}
          {isCurrentlyEnrolled === "NO" && (
            <div className="rounded-lg border border-km-orange/20 bg-km-warm-white/60 p-4 sm:p-6">
              <label htmlFor="highestAttainment" className="block text-sm font-semibold text-km-charcoal">
                If NO, please indicate your highest educational attainment:{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 max-w-md">
                <select id="highestAttainment" className={inputClass} {...register("highestAttainment")}>
                  <option value="">Select highest attainment</option>
                  {HIGHEST_ATTAINMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.highestAttainment ? (
                  <p className="mt-1 text-xs text-red-600">{errors.highestAttainment.message}</p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION III: PROGRAM INTEREST */}
      <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
        <div className="border-b border-km-charcoal/10 pb-4">
          <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
            III. Program Interest
          </h3>
          <p className="mt-1 text-xs text-km-charcoal/70">
            Select the 3-Year Diploma program (PQF Level 5) you wish to register for.
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="program" className="block text-xs font-medium text-km-charcoal/80">
            Select Program <span className="text-red-500">*</span>
          </label>
          <select id="program" className={cn(inputClass, "text-base sm:text-sm")} {...register("program")}>
            <option value="">Choose a diploma program</option>
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
      </section>

      {/* SECTION IV: ACKNOWLEDGEMENT */}
      <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
        <div className="border-b border-km-charcoal/10 pb-4">
          <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
            IV. Acknowledgement
          </h3>
        </div>

        <div className="mt-4 rounded-lg bg-km-warm-white p-4 text-xs leading-relaxed text-km-charcoal/85 sm:text-sm">
          I understand that this form serves as a registration/sign-up form only and does not
          confirm my official enrollment in the KM100 STC 3-Year Diploma Program. I understand
          that I will be contacted by KM100 Skills and Training Center, Inc. regarding the
          official enrollment process, requirements, schedule, and other necessary information.
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-km-charcoal">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-km-orange"
            {...register("acknowledgement")}
          />
          <span className="font-semibold text-km-charcoal">
            I ACKNOWLEDGE <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.acknowledgement ? (
          <p className="mt-1 text-xs text-red-600">{errors.acknowledgement.message}</p>
        ) : null}
      </section>

      {/* SECTION V: DATA PRIVACY AGREEMENT */}
      <section className="rounded-xl border border-km-charcoal/15 bg-white p-6 shadow-xs sm:p-8">
        <div className="border-b border-km-charcoal/10 pb-4">
          <h3 className="font-heading text-lg font-bold text-km-charcoal sm:text-xl">
            V. Data Privacy Agreement
          </h3>
        </div>

        <div className="mt-4 space-y-2 rounded-lg bg-km-warm-white p-4 text-xs leading-relaxed text-km-charcoal/85 sm:text-sm">
          <p>
            I understand that KM100 Skills and Training Center, Inc. respects my privacy and
            complies with Republic Act No. 10173 (Data Privacy Act of 2012). By signing this
            form, I consent to the collection and processing of my personal information for
            registration, enrollment, communication, and other legitimate purposes related to the
            3-Year Diploma Program.
          </p>
          <p>
            I understand that my information will be kept confidential and protected from
            unauthorized access or disclosure, except when required or permitted by law. I also
            understand that I have the right to access and request correction of my personal
            information, subject to applicable laws.
          </p>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-km-charcoal">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-km-orange"
            {...register("consent")}
          />
          <span className="font-semibold text-km-charcoal">
            I AGREE AND CONSENT <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-1 text-xs text-red-600">{errors.consent.message}</p>
        ) : null}
      </section>

      {submitError ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "inline-flex items-center justify-center rounded-md bg-km-orange px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-km-orange/90 active:scale-98",
            isSubmitting && "cursor-not-allowed opacity-60",
          )}
        >
          {isSubmitting ? "Submitting Registration…" : "Submit Pre-Registration"}
        </button>
      </div>
    </form>
  );
}
