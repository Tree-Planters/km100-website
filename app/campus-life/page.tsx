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
          className="mt-9 border-t border-km-charcoal/10 pt-5"
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-km-charcoal/40">
              In this issue
            </p>
            <p className="text-[9.5px] uppercase tracking-[0.2em] text-km-charcoal/30">
              {campusLifeSections.length} stories
            </p>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
            {campusLifeSections.map((section) => (
              <li key={section.slug} className="min-w-0">
                <a
                  href={`#${section.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-km-charcoal/12 bg-white px-4 py-3 text-[14px] font-medium text-km-charcoal/80 shadow-[0_1px_2px_rgba(37,37,37,0.04)] transition-all duration-200 outline-none hover:border-km-orange/45 hover:bg-km-orange/5 hover:text-km-orange hover:shadow-[0_6px_18px_-12px_rgba(37,37,37,0.5)] focus-visible:border-km-orange/60 focus-visible:ring-2 focus-visible:ring-km-orange/30 active:bg-km-orange/10 sm:inline-flex sm:justify-center sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-1.5 sm:text-[13px] sm:shadow-none"
                >
                  <span className="truncate">{section.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-km-charcoal/35 transition-transform duration-300 ease-out group-hover:translate-y-0.5 group-hover:text-km-orange sm:size-3"
                  >
                    <path d="M12 5v13M6 12l6 6 6-6" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
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
