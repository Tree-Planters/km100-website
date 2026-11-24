import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "TESDA scholarship slots at KM100 Skills and Training Center. Slots are opened in batches, with the courses and start date announced as each batch is confirmed.",
};

const steps = [
  {
    number: "01",
    title: "A batch is announced",
    body: "KM100 posts the courses on offer, the number of slots and the start date. Announcements appear on the school's Facebook page.",
  },
  {
    number: "02",
    title: "You apply at the campus",
    body: "Applications are taken in person at KM Building, Jamoral Ville, Purok 13, Barangay Cogon, Bogo City. Call ahead to ask what to bring.",
  },
  {
    number: "03",
    title: "The school confirms your slot",
    body: "Applying is not the same as being accepted. Slots are limited and allocated by KM100, and training follows the batch schedule.",
  },
];

const questions = [
  "Is a new batch being planned, and when?",
  "Which short courses will it cover?",
  "What documents do I need to submit?",
  "What does the scholarship cover — training, assessment, allowance?",
];

export default function ScholarshipsPage() {
  return (
    <>
      <PageHeader
        title="Scholarships"
        description="Explore opportunities to pursue technical education and skills training — and find out how KM100 awards its scholar slots."
      />

      {/* Intro */}
      <Section>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            TESDA scholarships
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            Scholarship slots open in batches.
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-km-charcoal/70">
            <p>
              KM100 opens slots for scholar applicants in its TESDA-registered
              short courses. Each batch is announced with the courses on offer,
              the number of slots and the date training starts, and it closes
              once those slots are taken.
            </p>
            <p>
              Because availability changes with every batch, there is no
              application form on this page. Applications are taken at the
              campus, and KM100 is the only one who can confirm what is open.
            </p>
          </div>
        </div>
      </Section>

      {/* Current availability */}
      <Section className="bg-km-warm-white">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            Availability
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            What is open right now.
          </h2>

          <div className="mt-8 border-l-2 border-km-orange bg-white p-7 sm:p-8">
            <p className="font-heading text-2xl">To be announced.</p>
            <p className="mt-3 text-sm leading-relaxed text-km-charcoal/60">
              The courses, number of slots and start date will be published here
              and on the school's Facebook page once a new batch is confirmed.
            </p>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            From announcement to first day.
          </h2>
        </div>

        <ol className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="border-t-2 border-km-orange pt-5">
              <span className="font-heading text-lg text-km-orange">
                {step.number}
              </span>
              <h3 className="mt-2 font-heading text-lg leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-km-charcoal/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Questions to ask */}
      <Section className="bg-km-charcoal">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
              Before you ask
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-snug text-white sm:text-4xl">
              Four things to ask.
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              Requirements, coverage and schedules are set per batch, so the
              answers change from one intake to the next.
            </p>
          </div>

          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-6 shrink-0 bg-km-orange"
                />
                <span className="text-lg text-white/85">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Closing CTA */}
      <Section>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl leading-snug sm:text-3xl">
              Ask about the next batch.
            </h2>
            <p className="mt-3 leading-relaxed text-km-charcoal/70">
              Call KM100 at {siteConfig.contact.phone}, or visit the campus on
              KM Building, Jamoral Ville, Purok 13, Barangay Cogon, Bogo City. Scholarship intakes are
              announced on the school's Facebook page as well.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact" shape="pill">
              Contact KM100
            </ButtonLink>
            <a
              href={siteConfig.contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-km-charcoal/20 px-6 py-3 text-sm font-semibold text-km-charcoal transition-colors hover:border-km-orange hover:text-km-orange"
            >
              Facebook updates
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
