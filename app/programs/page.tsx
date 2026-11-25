import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Academic Programs",
  description: `${programs.length} three-year Diploma Programs at PQF Level 5, offered in Bogo City, Cebu.`,
};

const atAGlance = [
  { value: String(programs.length).padStart(2, "0"), label: "Diploma Programs" },
  { value: "03", label: "Years of study" },
  { value: "PQF 5", label: "Qualification level" },
  { value: "Bogo", label: "City, Cebu" },
];

const steps = [
  {
    number: "01",
    title: "Choose a program",
    body: "Read through the diploma programs and note the direction that fits you best. You can change your choice later during the official admission process.",
  },
  {
    number: "02",
    title: "Submit a pre-registration",
    body: "Complete the online form with your personal, contact and educational details, and select your preferred program.",
  },
  {
    number: "03",
    title: "Wait for the school's response",
    body: "KM100 reviews each submission and contacts applicants with the next steps and any requirements.",
  },
  {
    number: "04",
    title: "Proceed with official admission",
    body: "Pre-registration is not enrollment. Admission is completed through KM100's official process, subject to confirmation.",
  },
];

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
    >
      <path d="M4 12h13M12 6l6 6-6 6" />
    </svg>
  );
}

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        title="Academic Programs"
        description={`${programs.length} three-year Diploma Programs at PQF Level 5, offered in Bogo City, Cebu.`}
      />

      {/* Introduction */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
              Diploma programs
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
              Seven programs. Three years. A future full of possibilities.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-km-charcoal/70">
              <p>
                Each KM100 Diploma Program runs for three years and is offered at
                PQF Level 5 — the diploma level of the Philippine Qualifications
                Framework.
              </p>
              <p>
                The programs cover different technical directions, from computer
                and electronics systems to tourism, hospitality and the kitchen,
                so that learners in Northern Cebu can choose the field they
                intend to work in.
              </p>
            </div>
          </div>

          <img
            src="/images/programs-graduates.jpg"
            alt="KM100 learners holding their certificates beneath the PQF Level 5 Diploma Program banner"
            className="aspect-4/3 w-full rounded-2xl object-cover object-center"
          />
        </div>
      </Section>

      {/* The programs */}
      <Section className="bg-km-warm-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
              Explore the programs
            </p>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
              Choose your direction.
            </h2>
          </div>
          <p className="text-sm text-km-charcoal/60 sm:text-right">
            All seven are 3-Year Diploma Programs
            <br className="hidden sm:block" /> at PQF Level 5.
          </p>
        </div>

        <ol className="mt-10 border-t border-km-charcoal/10">
          {programs.map((program, index) => (
            <li key={program.slug} className="border-b border-km-charcoal/10">
              <Link
                href={`/programs/${program.slug}`}
                className="group grid gap-5 py-8 transition-colors hover:bg-white/60 md:grid-cols-[11rem_1fr_auto] md:items-center md:gap-8 md:rounded-xl md:px-4"
              >
                <img
                  src={program.image}
                  alt=""
                  className="aspect-[23/10] w-full rounded-lg object-cover object-[50%_79%] md:w-44"
                />

                <div>
                  <span className="font-heading text-sm text-km-orange/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-heading text-xl leading-snug sm:text-2xl">
                    {program.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-km-charcoal/70">
                    {program.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-4 md:justify-end">
                  <span className="rounded-full border border-km-charcoal/15 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-km-charcoal/60 uppercase">
                    3-Year Diploma · PQF 5
                  </span>
                  <span className="text-km-orange">
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* At a glance */}
      <Section>
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {atAGlance.map((item) => (
            <div key={item.label} className="text-center">
              <dt className="font-heading text-3xl text-km-orange sm:text-4xl">
                {item.value}
              </dt>
              <dd className="mt-1 text-sm text-km-charcoal/60">{item.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 border-t border-km-charcoal/10 pt-8">
          <p className="max-w-3xl text-sm leading-relaxed text-km-charcoal/60">
            Detailed subject lists, practical training areas and admission
            requirements for each program are being finalized with KM100 and will
            be published here once confirmed.
          </p>
        </div>
      </Section>

      {/* Photo band */}
      <Section className="bg-km-charcoal">
        <figure>
          <img
            src="/images/programs-certificates.jpg"
            alt="KM100 learners receiving their certificates at a school awarding ceremony"
            className="aspect-16/9 w-full rounded-2xl object-cover object-center"
          />
          <figcaption className="mt-4 text-sm text-white/50">
            Learners receiving their certificates at a KM100 awarding ceremony.
          </figcaption>
        </figure>
      </Section>

      {/* How to begin */}
      <Section>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            How to begin
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            From interest to admission.
          </h2>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="border-t-2 border-km-orange pt-5">
              <span className="font-heading text-xl text-km-orange">
                {step.number}
              </span>
              <h3 className="mt-2 font-heading text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-km-charcoal/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/pre-registration" shape="pill">
            Pre-register now
          </ButtonLink>
          <ButtonLink href="/admissions" variant="outline" shape="pill">
            Admission information
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
