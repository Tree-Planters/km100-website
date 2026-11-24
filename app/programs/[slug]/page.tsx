import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { getProgramBySlug, programs } from "@/lib/programs";

type ProgramPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) return { title: "Program not found" };

  return { title: program.name, description: program.shortDescription };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) notFound();

  const otherPrograms = programs.filter((item) => item.slug !== program.slug);

  return (
    <>
      <PageHeader
        title={program.name}
        description="3-Year Diploma Program · PQF Level 5 · Bogo City, Cebu"
      />

      {/* Overview */}
      <Section>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-km-charcoal/50 transition-colors hover:text-km-orange"
        >
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
            <path d="M20 12H7M12 18l-6-6 6-6" />
          </svg>
          All programs
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 className="font-heading text-2xl leading-snug sm:text-3xl">
              {program.tagline ?? program.shortDescription}
            </h2>
            {program.overview && program.overview.length > 0 ? (
              <div className="mt-6 space-y-4 leading-relaxed text-km-charcoal/70">
                {program.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <img
              src={program.image}
              alt={program.imageAlt}
              className="w-full rounded-2xl border border-km-charcoal/10"
            />

            <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-km-charcoal/10 pt-6 text-sm">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.12em] text-km-charcoal/50 uppercase">
                  Duration
                </dt>
                <dd className="mt-1 font-heading text-lg">3 years</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.12em] text-km-charcoal/50 uppercase">
                  Qualification
                </dt>
                <dd className="mt-1 font-heading text-lg">PQF Level 5</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] font-semibold tracking-[0.12em] text-km-charcoal/50 uppercase">
                  Where
                </dt>
                <dd className="mt-1 text-km-charcoal/70">Bogo City, Cebu</dd>
              </div>
            </dl>

            <ButtonLink
              href="/pre-registration"
              shape="pill"
              className="mt-6 w-full"
            >
              Pre-register for this program
            </ButtonLink>
          </aside>
        </div>
      </Section>

      {/* What the field covers */}
      {program.scope && program.scope.length > 0 ? (
      <Section className="bg-km-warm-white">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            The field
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            What this direction covers.
          </h2>
          <p className="mt-4 leading-relaxed text-km-charcoal/70">
            {program.shortName} rests on a handful of areas of practice. These
            describe the field itself rather than a module list for the KM100
            program — the school's subject list is still being finalized.
          </p>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {program.scope.map((item, index) => (
            <div key={item.title} className="border-t-2 border-km-orange pt-5">
              <span className="font-heading text-lg text-km-orange">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-heading text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-km-charcoal/70">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>
      ) : null}

      {/* Where it can lead */}
      {program.careers && program.careers.length > 0 ? (
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
              After the diploma
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
              Where this work leads.
            </h2>
          </div>

          <div>
            <ul className="space-y-4">
              {program.careers.map((career) => (
                <li key={career} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-6 shrink-0 bg-km-orange"
                  />
                  <span className="text-lg text-km-charcoal/80">{career}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-km-charcoal/10 pt-6 text-sm leading-relaxed text-km-charcoal/50">
              These are the directions the field commonly leads to. KM100 does
              not guarantee employment, and where a professional licence is
              required for a role, it is obtained separately.
            </p>
          </div>
        </div>
      </Section>
      ) : null}

      {/* CTA */}
      <Section className="bg-km-charcoal">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl leading-snug text-white sm:text-3xl">
              Interested in {program.shortName}?
            </h2>
            <p className="mt-3 leading-relaxed text-white/60">
              Pre-registration takes a few minutes. Our subject lists and
              admission requirements for this program are still being finalized
              with KM100 — send an enquiry and we will walk you through what is
              confirmed so far.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/pre-registration" shape="pill">
              Pre-register
            </ButtonLink>
            <ButtonLink
              href="/admissions"
              variant="ghost"
              shape="pill"
              className="bg-transparent"
            >
              Admission info
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Other programs */}
      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-2xl sm:text-3xl">Other programs</h2>
          <Link
            href="/programs"
            className="text-sm font-semibold text-km-orange hover:underline"
          >
            View all programs
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {otherPrograms.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/programs/${item.slug}`}
                className="group flex h-full flex-col gap-3 rounded-xl border border-km-charcoal/10 p-5 transition-colors hover:border-km-orange/50 hover:bg-km-warm-white"
              >
                <img
                  src={item.image}
                  alt=""
                  className="aspect-[23/10] w-full rounded-lg object-cover object-[50%_79%]"
                />
                <span className="font-heading text-base leading-snug">
                  {item.shortName}
                </span>
                <span className="mt-auto text-xs font-semibold tracking-[0.12em] text-km-charcoal/40 uppercase">
                  3-Year Diploma
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
