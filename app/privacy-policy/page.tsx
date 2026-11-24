import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | KM100 Skills and Training Center, Inc.",
  description:
    "Official Privacy Policy of KM100 Skills and Training Center, Inc. in compliance with Republic Act No. 10173 (Philippine Data Privacy Act of 2012). Learn how we collect, process, and safeguard your personal data.",
};

const tableOfContents = [
  { id: "institutional-commitment", title: "1. Institutional Commitment & Policy Statement" },
  { id: "scope-and-applicability", title: "2. Scope and Applicability" },
  { id: "data-we-collect", title: "3. Personal Data We Collect" },
  { id: "purpose-of-processing", title: "4. Purpose and Use of Personal Information" },
  { id: "legal-basis", title: "5. Legal Basis for Processing" },
  { id: "disclosure-and-sharing", title: "6. Data Disclosure and Third-Party Sharing" },
  { id: "security-measures", title: "7. Organizational, Physical, and Technical Security Measures" },
  { id: "retention-and-disposal", title: "8. Data Retention, Storage, and Disposal" },
  { id: "data-subject-rights", title: "9. Your Rights as a Data Subject under RA 10173" },
  { id: "cookies-and-tracking", title: "10. Cookies, Web Storage, and Analytics" },
  { id: "dpo-contact", title: "11. Data Protection Officer (DPO) Contact Information" },
  { id: "policy-updates", title: "12. Amendments and Effectivity" },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 24, 2026";

  return (
    <>
      <PageHeader
        title="Privacy Policy"
        titleClassName="font-body"
        description="Official Privacy Policy and Data Protection Notice in strict compliance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012 (DPA) of the Republic of the Philippines."
      />

      <Section className="bg-km-warm-white/40 pb-24 pt-12 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-km-charcoal/10 pb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-km-orange/10 text-km-orange">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </span>
                  <p className="font-body text-sm font-bold tracking-tight text-km-charcoal">
                    Table of Contents
                  </p>
                </div>
                <nav className="mt-4 flex flex-col space-y-1.5 text-xs">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="rounded-lg px-2.5 py-1.5 font-medium text-km-charcoal/70 transition-colors hover:bg-km-orange/5 hover:text-km-orange"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Philippine Statutory Reference Card */}
              <div className="rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50/80 to-orange-50/40 p-6 text-xs text-km-charcoal/80 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="font-body font-bold uppercase tracking-wider text-[11px] text-amber-900">
                    Statutory Compliance
                  </p>
                </div>
                <p className="mt-2.5 leading-relaxed">
                  This website operates under the regulatory jurisdiction of the <strong>National Privacy Commission (NPC)</strong> of the Philippines, adhering to the core tenets of <em>Transparency, Legitimate Purpose, and Proportionality</em>.
                </p>
                <div className="mt-3.5 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-km-charcoal/60">
                  <span>Last Updated:</span>
                  <span className="font-semibold text-km-charcoal">{lastUpdated}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Body */}
          <main className="space-y-10 lg:col-span-8">
            {/* Regulatory Notice Banner */}
            <div className="rounded-2xl border border-km-orange/20 bg-linear-to-r from-km-orange/10 via-amber-500/5 to-transparent p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-km-orange/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-km-orange text-white shadow-xs">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="font-body text-base font-bold text-km-charcoal sm:text-lg">
                      Republic of the Philippines Statutory Compliance
                    </h2>
                    <p className="text-xs text-km-charcoal/60">
                      Republic Act No. 10173 • Implementing Rules and Regulations (IRR) • NPC Advisory Standards
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-km-orange shadow-2xs border border-km-orange/30">
                  Official Policy
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-km-charcoal/80 sm:text-sm">
                <strong>KM100 Skills and Training Center, Inc.</strong> (&ldquo;KM100&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a recognized technical-vocational and higher technical education institution in Bogo City, Cebu, is committed to safeguarding your privacy rights. As a <strong>Personal Information Controller (PIC)</strong> under Philippine law, we ensure that all personal data entrusted to us through our website, online pre-registration portals, and related educational services are processed lawfully, fairly, and securely.
              </p>
            </div>

            {/* SECTION 1 */}
            <section id="institutional-commitment" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                1. Institutional Commitment &amp; Policy Statement
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <p>
                  KM100 Skills and Training Center, Inc. recognizes the fundamental human right to privacy and communication as enshrined in the 1987 Philippine Constitution and statutorily protected by <strong>Republic Act No. 10173</strong>, otherwise known as the <strong>Data Privacy Act of 2012 (DPA)</strong>, its Implementing Rules and Regulations (IRR), and all applicable circulars, issuances, and advisories published by the <strong>National Privacy Commission (NPC)</strong>.
                </p>
                <p>
                  We ensure that every personal data processing activity carried out through this website adheres to the three foundational principles of data privacy:
                </p>
                <div className="grid gap-3.5 pt-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/50 p-4">
                    <p className="font-body text-xs font-bold uppercase tracking-wider text-km-orange">
                      Transparency
                    </p>
                    <p className="mt-1.5 text-xs text-km-charcoal/70">
                      Data subjects are made aware of the nature, purpose, extent, and duration of processing, as well as their statutory rights.
                    </p>
                  </div>
                  <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/50 p-4">
                    <p className="font-body text-xs font-bold uppercase tracking-wider text-km-orange">
                      Legitimate Purpose
                    </p>
                    <p className="mt-1.5 text-xs text-km-charcoal/70">
                      Processing is strictly bound to education, training, admissions, academic management, and lawful institutional mandates.
                    </p>
                  </div>
                  <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/50 p-4">
                    <p className="font-body text-xs font-bold uppercase tracking-wider text-km-orange">
                      Proportionality
                    </p>
                    <p className="mt-1.5 text-xs text-km-charcoal/70">
                      Data collection is limited exclusively to what is adequate, relevant, and suitable to fulfill our educational purposes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="scope-and-applicability" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                2. Scope and Applicability
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <p>
                  This Privacy Policy applies universally to all visitors, prospective students, applicants, enrolled trainees, alumni, parents, guardians, industry partners, and any individuals (&ldquo;Data Subjects&rdquo;) who access or use:
                </p>
                <ul className="list-disc space-y-1.5 pl-6 text-sm text-km-charcoal/80">
                  <li>The official website of KM100 Skills and Training Center, Inc. and its corresponding web pages;</li>
                  <li>The Online Pre-Registration Form for the 3-Year PQF Level 5 Diploma Programs;</li>
                  <li>General inquiry, contact, and scholarship inquiry submissions;</li>
                  <li>Authorized student and administrative communication channels originating from this platform.</li>
                </ul>
                <p>
                  By navigating this website, submitting an online pre-registration, or transmitting inquiries through our web forms, you signify that you have read, understood, and consented to the data practices described in this document.
                </p>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="data-we-collect" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                3. Personal Data We Collect
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-km-charcoal/80">
                Depending on how you interact with our website, KM100 collects both <em>Personal Information</em> and <em>Sensitive Personal Information</em> as classified by RA 10173:
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/40 p-4 sm:p-5">
                  <h3 className="font-body text-sm font-bold text-km-charcoal">
                    A. Online Pre-Registration &amp; Admissions Application
                  </h3>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    When prospective trainees complete the Pre-Registration Form for Diploma Programs, we collect:
                  </p>
                  <ul className="mt-2.5 grid gap-2 text-xs text-km-charcoal/80 sm:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span><strong>Full Legal Identity:</strong> First Name, Middle Name, Last Name, and Name Suffix (e.g., Jr., III).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span><strong>Civil Status:</strong> Single, Married, Widowed, or Separated.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span><strong>Contact Coordinates:</strong> Valid Mobile Telephone Number and Active Email Address.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span><strong>Philippine Geographic Address:</strong> Cascading standard PSGC location hierarchy (Region, Province, City/Municipality, District, Barangay, Sitio / Street / House No.).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span><strong>Educational History:</strong> Current Enrollment Status, Current School Name, Current Grade/Year Level, Current Program, or Highest Educational Attainment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span><strong>Academic Program Preference:</strong> Preferred 3-Year PQF Level 5 Diploma Program specialization.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/40 p-4 sm:p-5">
                  <h3 className="font-body text-sm font-bold text-km-charcoal">
                    B. General Inquiries &amp; Contact Us Form
                  </h3>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    When contacting our admissions office or administrative staff through our web portal:
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-km-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span>Full Name, Contact Email Address, Mobile Phone Number, Subject of Inquiry, and Body of Message.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/40 p-4 sm:p-5">
                  <h3 className="font-body text-sm font-bold text-km-charcoal">
                    C. Technical, Device, and Browsing Metadata
                  </h3>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    Automatically collected during your visit for network security and site stability:
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-km-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-km-orange">•</span>
                      <span>Internet Protocol (IP) address, browser client user-agent string, access timestamps, referral URLs, and pages visited.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="purpose-of-processing" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                4. Purpose and Use of Personal Information
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-km-charcoal/80">
                KM100 processes collected personal information strictly to fulfill legitimate institutional, academic, and governmental compliance objectives, specifically:
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-km-charcoal/10 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    1. Admissions &amp; Enrollment Evaluation
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/70">
                    Evaluating qualifications, educational attainment, and program fit for applicants applying to our PQF Level 5 Diploma Programs.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    2. Official Applicant Communication
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/70">
                    Transmitting application reference numbers, interview schedules, documentary requirements, and enrollment instructions via SMS, phone, or email.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    3. Scholarship Assessment
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/70">
                    Determining student qualification for TESDA scholarship slots, institutional grants, and financial assistance programs.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    4. Regulatory &amp; Statutory Compliance
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/70">
                    Submitting mandatory enrollment reports and documentation to the Technical Education and Skills Development Authority (TESDA) and other Philippine educational agencies.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    5. Student Support &amp; Inquiries
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/70">
                    Responding directly to inquiries, program clarifications, campus tour bookings, and general concerns submitted through our portal.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    6. Information Security &amp; Fraud Prevention
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-km-charcoal/70">
                    Protecting against bot activity, spam submissions, unauthorized system access, cyber incidents, and ensuring system integrity.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5 */}
            <section id="legal-basis" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                5. Legal Basis for Processing
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <p>
                  Under Section 12 and Section 13 of Republic Act No. 10173, KM100 processes your personal data on one or more of the following lawful criteria:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-sm text-km-charcoal/80">
                  <li>
                    <strong>Explicit Consent:</strong> You have given express consent by actively checking the Data Privacy Agreement and Acknowledgement declaration prior to submitting forms on our website.
                  </li>
                  <li>
                    <strong>Pre-Contractual and Contractual Obligations:</strong> Processing is necessary for the preparation, evaluation, and execution of educational agreements, enrollment terms, and academic services requested by you.
                  </li>
                  <li>
                    <strong>Compliance with Legal and Regulatory Obligations:</strong> Processing is required for compliance with statutory obligations imposed by Philippine law, including mandates issued by TESDA, CHED, DepEd, and the Bureau of Internal Revenue (BIR).
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> Processing is necessary for the legitimate academic and administrative interests of KM100 as an educational institution, provided that such interests are not overridden by your fundamental privacy rights.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 6 */}
            <section id="disclosure-and-sharing" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                6. Data Disclosure and Third-Party Sharing
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 sm:text-sm">
                  <strong>Strict Non-Commercialization Guarantee:</strong> KM100 Skills and Training Center, Inc. does NOT sell, lease, rent, trade, or monetize your personal data to any third-party advertisers, commercial marketers, or non-educational entities under any circumstance.
                </div>
                <p>
                  We disclose personal data only under strict confidentiality and on a need-to-know basis to:
                </p>
                <ol className="list-decimal space-y-2 pl-6 text-sm text-km-charcoal/80">
                  <li>
                    <strong>Authorized School Personnel:</strong> Admissions Officers, Registrars, Guidance Counselors, and Academic Department Heads strictly for admission processing and educational support.
                  </li>
                  <li>
                    <strong>Philippine Government Regulatory Bodies:</strong> Technical Education and Skills Development Authority (TESDA) for official registry of trainees, issuance of National Certificates (NC), training regulations, and scholarship auditing.
                  </li>
                  <li>
                    <strong>Authorized Cloud &amp; Technical Infrastructure Providers:</strong> Secure database hosting platforms, email transport providers (for confirmation messages and notifications), and technical maintenance partners bound by written <em>Data Sharing Agreements (DSA)</em> and stringent non-disclosure obligations.
                  </li>
                  <li>
                    <strong>Law Enforcement and Judicial Authorities:</strong> In exceptional circumstances where disclosure is required by a valid subpoena, court order, or existing Philippine statute.
                  </li>
                </ol>
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="security-measures" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                7. Organizational, Physical, and Technical Security Measures
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-km-charcoal/80">
                In compliance with Section 20 of RA 10173 and NPC Circular 16-01 (Security of Personal Data in Government and Private Agencies), KM100 employs comprehensive safeguards to protect against accidental, unauthorized, or unlawful destruction, loss, alteration, and unauthorized disclosure or access:
              </p>
              <div className="mt-5 space-y-3.5">
                <div className="rounded-xl border border-km-charcoal/10 p-4 sm:p-5">
                  <h3 className="font-body text-sm font-bold text-km-charcoal flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-km-orange" />
                    Organizational Measures
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-km-charcoal/70">
                    Execution of strict confidentiality agreements by all administrative personnel; regular privacy and data protection training for staff; appointment of a designated Data Protection Officer (DPO); and annual reviews of security policies.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4 sm:p-5">
                  <h3 className="font-body text-sm font-bold text-km-charcoal flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-km-orange" />
                    Physical Measures
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-km-charcoal/70">
                    Restricted physical access to office premises, records archives, and server hardware located at our main campus in Bogo City, Cebu; locked storage cabinets for printed application records; and strict visitor control policies.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 p-4 sm:p-5">
                  <h3 className="font-body text-sm font-bold text-km-charcoal flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-km-orange" />
                    Technical Measures
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-km-charcoal/70">
                    End-to-end 256-bit Transport Layer Security (TLS/HTTPS) encryption for all web communications; encrypted database connections; role-based administrative authentication (RBAC); automated query logging; and periodic vulnerability assessments.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 8 */}
            <section id="retention-and-disposal" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                8. Data Retention, Storage, and Disposal
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <p>
                  Personal data collected through this website is stored in secure database facilities. KM100 retains personal information only for as long as is necessary to accomplish the specified purposes:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-sm text-km-charcoal/80">
                  <li>
                    <strong>Pre-Registration Applicants who Enroll:</strong> Data is integrated into their permanent student record and retained in perpetuity or in accordance with the National Archives of the Philippines guidelines and TESDA academic record retention schedules.
                  </li>
                  <li>
                    <strong>Unenrolled or Inactive Applicants:</strong> Application data is securely retained for up to twelve (12) months following the conclusion of the admissions cycle to facilitate deferred enrollment, after which it is slated for secure disposal.
                  </li>
                  <li>
                    <strong>General Web Inquiries:</strong> Inquiries and messages submitted through the Contact Us form are retained for six (6) months after resolution of the query.
                  </li>
                </ul>
                <p>
                  Upon expiration of the retention period, digital records are irreversibly purged, overwritten, or anonymized using secure digital sanitization techniques, ensuring that the personal data cannot be restored or accessed by unauthorized entities.
                </p>
              </div>
            </section>

            {/* SECTION 9 */}
            <section id="data-subject-rights" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                9. Your Rights as a Data Subject under RA 10173
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-km-charcoal/80">
                Under Section 16 of the Philippine Data Privacy Act of 2012, you possess eight (8) statutory rights as a Data Subject. KM100 is committed to upholding each of these rights:
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    1. Right to be Informed
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to know whether your personal data is being processed, the sources of data, the purpose, and recipients.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    2. Right to Access
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to request reasonable access to your personal information held in our records, including copies thereof.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    3. Right to Rectification (Correction)
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to dispute any inaccuracy or error in your personal data and demand its immediate correction.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    4. Right to Erasure or Blocking
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to suspend, withdraw, or order the removal of your personal data upon grounds recognized by law.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    5. Right to Object
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to withhold consent or object to processing where processing is based on consent or legitimate interest.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    6. Right to Data Portability
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to obtain your electronic data in an open, structured, and commonly used format for transfer.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    7. Right to Damages
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to be indemnified for any damages sustained due to inaccurate, incomplete, or unlawful processing.
                  </p>
                </div>
                <div className="rounded-xl border border-km-charcoal/10 bg-km-warm-white/30 p-4">
                  <p className="font-body text-xs font-bold text-km-charcoal">
                    8. Right to File a Complaint
                  </p>
                  <p className="mt-1 text-xs text-km-charcoal/70">
                    You have the right to file an official complaint before the National Privacy Commission (NPC) if your rights are violated.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 10 */}
            <section id="cookies-and-tracking" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                10. Cookies, Web Storage, and Analytics
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <p>
                  This website utilizes essential cookies, local storage, and session storage strictly necessary for the technical functionality and security of the site. These include:
                </p>
                <ul className="list-disc space-y-1.5 pl-6 text-sm text-km-charcoal/80">
                  <li><strong>Security and Session Tokens:</strong> Preventing cross-site request forgery and maintaining secure administrative session states.</li>
                  <li><strong>Form Preferences &amp; Cache:</strong> Enabling fast multi-step address cascading and preventing data loss during form submission.</li>
                </ul>
                <p>
                  We do not employ third-party tracking cookies or behavioral advertising pixels. You may manage or disable cookies through your web browser preferences; however, disabling functional cookies may impair certain features of the pre-registration portal.
                </p>
              </div>
            </section>

            {/* SECTION 11 */}
            <section id="dpo-contact" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                11. Data Protection Officer (DPO) Contact Information
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-km-charcoal/80">
                To exercise any of your statutory rights, submit inquiries, request corrections, or file a privacy concern regarding our processing practices, please reach out to our designated <strong>Data Protection Officer (DPO)</strong>:
              </p>

              <div className="mt-5 rounded-xl border border-km-charcoal/15 bg-linear-to-br from-km-warm-white to-white p-5 sm:p-6">
                <div className="flex items-center gap-3 border-b border-km-charcoal/10 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-km-orange text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-base font-bold text-km-charcoal">
                      The Data Protection Officer
                    </p>
                    <p className="text-xs text-km-charcoal/60">
                      KM100 Skills and Training Center, Inc.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 sm:text-sm">
                  <div>
                    <span className="font-semibold text-km-charcoal">Campus Office Address:</span>
                    <p className="mt-0.5 text-km-charcoal/70 leading-relaxed">
                      {siteConfig.contact.address}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-km-charcoal">Official Email Address:</span>
                    <p className="mt-0.5 text-km-charcoal/70">
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-km-orange hover:underline">
                        {siteConfig.contact.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-km-charcoal">Telephone / Mobile:</span>
                    <p className="mt-0.5 text-km-charcoal/70">
                      <a href={siteConfig.contact.phoneHref} className="text-km-charcoal/80 hover:text-km-orange">
                        {siteConfig.contact.phone}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-km-charcoal">Regulatory Oversight:</span>
                    <p className="mt-0.5 text-km-charcoal/70">
                      National Privacy Commission (NPC) •{" "}
                      <a
                        href="https://privacy.gov.ph"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-km-orange hover:underline"
                      >
                        privacy.gov.ph
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 12 */}
            <section id="policy-updates" className="scroll-mt-28 rounded-2xl border border-km-charcoal/10 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-body text-xl font-bold text-km-charcoal sm:text-2xl">
                12. Amendments and Effectivity
              </h2>
              <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-km-charcoal/80">
                <p>
                  KM100 Skills and Training Center, Inc. reserves the right to amend, update, or revise this Privacy Policy periodically to reflect changes in Philippine statutory legislation, National Privacy Commission issuances, technological safeguards, or internal operational policies.
                </p>
                <p>
                  Any significant changes will be published prominently on this website with a revised &ldquo;Last Updated&rdquo; date. We encourage you to review this page periodically to remain informed about how we continue to safeguard your personal data.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-km-charcoal/10 pt-4 text-xs text-km-charcoal/60">
                  <p>Effective Date: November 24, 2026</p>
                  <Link
                    href="/pre-registration"
                    className="inline-flex items-center gap-1.5 font-semibold text-km-orange hover:underline"
                  >
                    Proceed to Online Pre-Registration
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </Section>
    </>
  );
}
