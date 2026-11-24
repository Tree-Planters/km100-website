import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CampusLifeRow } from "@/components/campus-life/campus-life-row";
import { CountUp } from "@/components/campus-life/count-up";
import { campusLifeFacts, campusLifeSections } from "@/lib/campus-life";

export const metadata: Metadata = {
  title: "Campus Life",
  description:
    "The 28 October 2026 launching of KM100 Skills and Training Center, Inc.: the ribbon, the laboratories, the first NC II graduates and the partners who signed on.",
};

export default function CampusLifePage() {
  const [lead, ...rest] = campusLifeSections;

  return (
    <>
      <PageHeader
        title="Campus Life"
        description="The campus opening on 28 October 2026, in four photographs."
      />

      {/* Masthead: a newspaper nameplate, then the deck. */}
      <Section className="pb-0 pt-10 lg:pt-14">
        <div className="border-t-2 border-km-orange pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-km-charcoal">
            Campus Life
          </p>

          <div className="mt-9 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <h2 className="font-heading text-[1.9rem] leading-[1.09] text-balance sm:text-[2.45rem] lg:col-span-7 lg:text-[2.75rem]">
              A campus opens once. These are the four moments from the{" "}
              <span className="whitespace-nowrap lining-nums">KM100</span>{" "}
              morning it did.
            </h2>
            <p className="text-[15px] leading-[1.75] text-km-charcoal/65 lg:col-span-4 lg:col-start-9 lg:pt-2">
              The ribbon at the entrance, the two laboratory doors, the first
              eleven NC II certificates, and the pledge board our partners
              signed. Every photograph was taken on 28 October 2026.
            </p>
          </div>
        </div>

        {/* By the numbers: a quiet warm panel, no rules at all. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 bg-km-warm-white px-7 py-9 sm:grid-cols-4 sm:gap-x-8 sm:px-9 sm:py-10">
          {campusLifeFacts.map((fact) => (
            <div key={fact.label}>
              <dd className="font-heading text-[2.3rem] leading-none tracking-[-0.01em] lining-nums tabular-nums text-km-charcoal sm:text-[2.8rem]">
                <CountUp value={fact.value} />
              </dd>
              <dt className="mt-2.5 text-[9.5px] font-semibold uppercase leading-[1.5] tracking-[0.18em] text-km-charcoal/45">
                {fact.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* In this issue: a plain contents line, no numbers, no rules. */}
        <nav
          aria-label="Campus life stories"
          className="mt-9 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3"
        >
          <ul className="flex flex-1 flex-wrap items-baseline gap-x-7 gap-y-2">
            <li className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-km-charcoal/40">
              In this issue
            </li>
            {campusLifeSections.map((section) => (
              <li key={section.slug}>
                <a
                  href={`#${section.slug}`}
                  className="text-[13.5px] text-km-charcoal/75 underline-offset-[5px] transition-colors hover:text-km-charcoal hover:underline hover:decoration-km-charcoal/30"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[9.5px] uppercase tracking-[0.2em] text-km-charcoal/30">
            {campusLifeSections.length} stories
          </p>
        </nav>
      </Section>

      {/* Stories: lead piece first, then the stair-stepped entries. */}
      <Section className="pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className="space-y-16 lg:space-y-24">
          <CampusLifeRow section={lead} flipped={false} featured />
          {rest.map((section, index) => (
            <CampusLifeRow
              key={section.slug}
              section={section}
              flipped={index % 2 === 0}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
