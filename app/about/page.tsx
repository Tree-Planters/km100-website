import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import {
  aboutIntro,
  guidingPrinciples,
  institutionalStatement,
  milestone,
  mission,
  philosophyPillars,
  vision,
} from "@/lib/about-content";

export const metadata: Metadata = {
  title: "About KM100",
  description:
    "KM100 Skills and Training Center, Inc. is an institution in Bogo City, Cebu committed to quality technical education, skills training and social service.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About KM100" description={institutionalStatement} />

      {/* Who we are */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
              Who we are
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
              Empowering communities through technical education.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-km-charcoal/70">
              {aboutIntro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 hidden h-32 w-32 rounded-tl-3xl border-t-2 border-l-2 border-km-orange/40 sm:block"
            />
            <img
              src="/images/campus-launch.jpg"
              alt="KM100 faculty and guests at the school's PQF Level 5 Diploma Program launch"
              className="relative aspect-4/3 w-full rounded-2xl object-cover object-center"
            />
          </div>
        </div>
      </Section>

      {/* Educational philosophy */}
      <Section className="bg-km-warm-white">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            Our philosophy
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            Be practical. Get technical.
          </h2>
          <p className="mt-5 leading-relaxed text-km-charcoal/70">
            Our teaching follows a simple idea: that skills should be
            practised, that opportunity should be genuine, and that both should
            lead somewhere brighter.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {philosophyPillars.map((item) => (
            <div key={item.number} className="border-t-2 border-km-orange pt-6">
              <span className="font-heading text-2xl text-km-orange">
                {item.number}
              </span>
              <h3 className="mt-3 font-heading text-xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-km-charcoal/70">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* What guides our teaching */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
              What guides our teaching
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
              The principles behind our work.
            </h2>
            <p className="mt-5 leading-relaxed text-km-charcoal/70">
              These principles follow from our commitment to quality technical
              education, skills training and social service.
            </p>
          </div>

          <dl className="divide-y divide-km-charcoal/10">
            {guidingPrinciples.map((item) => (
              <div key={item.title} className="py-6 first:pt-0 last:pb-0">
                <dt className="font-heading text-lg">{item.title}</dt>
                <dd className="mt-2 leading-relaxed text-km-charcoal/70">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Milestone — as stated in KM100's supplied material */}
      <Section className="bg-km-charcoal text-white">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            Our milestone
          </p>
          <p className="mt-4 font-heading text-2xl leading-snug sm:text-3xl lg:text-4xl">
            {milestone}
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-white/70">
            For learners in Bogo City and the surrounding towns, that means a
            PQF Level 5 diploma they can pursue closer to home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programs" shape="pill">
              Explore our programs
            </ButtonLink>
            <ButtonLink href="/pre-registration" variant="ghost" shape="pill">
              Pre-register now
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Mission and vision — draft statements pending KM100's official adoption */}
      <Section>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            Mission and vision
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            Where we are going.
          </h2>
          <p className="mt-5 leading-relaxed text-km-charcoal/70">
            What we do every day, and what we are working toward.
          </p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-km-charcoal/10 bg-km-warm-white p-8 sm:p-10">
            <h3 className="font-heading text-2xl">Our mission</h3>
            <div aria-hidden="true" className="mt-4 h-0.5 w-12 bg-km-orange" />
            <p className="mt-6 leading-relaxed text-km-charcoal/70">{mission}</p>
          </div>
          <div className="rounded-2xl border border-km-charcoal/10 bg-km-warm-white p-8 sm:p-10">
            <h3 className="font-heading text-2xl">Our vision</h3>
            <div aria-hidden="true" className="mt-4 h-0.5 w-12 bg-km-orange" />
            <p className="mt-6 leading-relaxed text-km-charcoal/70">{vision}</p>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section className="bg-km-warm-white">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl">
              Skills today. A brighter future.
            </h2>
            <p className="mt-2 text-km-charcoal/70">
              Five diploma programs, each completed over three years.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/programs">View diploma programs</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
