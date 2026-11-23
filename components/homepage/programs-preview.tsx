import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";

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
      className="size-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
    >
      <path d="M4 12h13M12 6l6 6-6 6" />
    </svg>
  );
}

export function ProgramsPreview() {
  return (
    <Section id="programs">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-km-orange">
            Academic Programs
          </p>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
            Seven programs. Three years.
           
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-km-charcoal/55 sm:text-base">
            PQF Level 5 diploma tracks — the same three-year qualification,
            seven different technical directions.
          </p>
        </div>
        <ButtonLink
          href="/programs"
          variant="outline"
          shape="pill"
          className="self-start sm:mb-1 sm:shrink-0"
        >
          View all programs
        </ButtonLink>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {programs.map((program) => (
          <li key={program.slug}>
            <Link
              href={`/programs/${program.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-km-charcoal/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(37,37,37,0.5)] hover:ring-km-orange/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[916/1004] w-full overflow-hidden bg-km-charcoal">
                <Image
                  src={`/programs/${program.slug}.jpg`}
                  alt={`${program.name} — 3-Year Diploma Program`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2.5 bg-km-warm-white/60 px-4 pt-4 pb-4 lg:gap-3 lg:px-5 lg:pt-5 lg:pb-5">
               
                <p className="text-pretty text-[13px] leading-[1.65] text-km-charcoal/70 lg:text-[13.5px]">
                  {program.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t border-km-charcoal/10 px-4 py-3.5 lg:gap-x-3 lg:px-5 lg:py-4">
                <Image
                  src="/logo/tesda_logo.svg"
                  alt="TESDA"
                  width={44}
                  height={44}
                  unoptimized
                  className="h-10 w-10 shrink-0 lg:h-12 lg:w-12"
                />
                <span
                  aria-hidden="true"
                  className="h-[25px] w-px shrink-0 translate-y-[2px] bg-km-charcoal/15 lg:h-[27px] lg:translate-y-[2px]"
                />
                <span className="text-[12px] font-semibold uppercase leading-[1.25] tracking-[0.16em] text-km-charcoal lg:text-[13px]">
                  Registered
                  <br />
                  Program
                </span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-km-orange px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.02em] text-white ring-1 ring-inset ring-white/25 transition-colors duration-300 ease-out group-hover:bg-km-orange/85 lg:gap-1.5 lg:px-4 lg:py-2 lg:text-[12px]">
                  <span>Learn more</span>
                  <ArrowRight />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 border-t border-km-charcoal/10 pt-6 text-sm text-km-charcoal/55">
        TESDA registration is held per program; confirm the current status of
        a program with KM100 before enrolment.
      </p>
    </Section>
  );
}
