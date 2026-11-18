import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ProgramsPreview() {
  return (
    <Section id="programs">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-km-orange">
          Academic Programs
        </p>
        <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
          Five programs. Three years.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-km-charcoal/55 sm:text-base">
          Five TESDA-registered, PQF Level 5 diploma tracks — same three-year
          qualification, five different technical directions.
        </p>
      </div>

      <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0">
        {programs.map((program) => (
          <li
            key={program.slug}
            className="w-[76%] shrink-0 snap-start sm:w-[44%] lg:w-auto lg:shrink"
          >
            <Link
              href={`/programs/${program.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-km-charcoal/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(37,37,37,0.5)] hover:ring-km-orange/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[916/1004] w-full overflow-hidden bg-km-charcoal">
                <Image
                  src={`/programs/${program.slug}.jpg`}
                  alt={`${program.name} — 3-Year Diploma Program`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 44vw, 76vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-full bg-white/95 text-km-charcoal opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ArrowUpRight />
                </span>
              </div>

              <div className="flex flex-1 items-center gap-3 border-t border-km-charcoal/10 px-4 py-3.5">
                <Image
                  src="/logo/tesda_logo.svg"
                  alt="TESDA"
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 shrink-0"
                />
                <span aria-hidden="true" className="h-8 w-px bg-km-charcoal/15" />
                <span className="font-brand text-[12px] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-km-charcoal">
                  Registered
                  <br />
                  Program
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 border-t border-km-charcoal/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-km-charcoal/55">
          All five programs are TESDA-registered and PQF Level 5.
        </p>
        <ButtonLink href="/programs" variant="outline" shape="pill">
          View all programs
        </ButtonLink>
      </div>
    </Section>
  );
}
