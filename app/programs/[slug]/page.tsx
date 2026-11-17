import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
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

  return (
    <>
      <PageHeader
        title={program.name}
        description="3-Year Diploma · PQF Level 5"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Placeholder label="Program overview and what students can learn" />
            <Placeholder label="Practical training areas and career pathways" />
            <Placeholder label="Admission requirements and FAQ" />
          </div>
          <aside className="h-fit rounded-xl bg-km-warm-white p-6">
            <p className="text-sm font-semibold">Quick facts</p>
            <dl className="mt-4 space-y-3 text-sm text-km-charcoal/70">
              <div>
                <dt className="font-semibold text-km-charcoal">Duration</dt>
                <dd>3 years</dd>
              </div>
              <div>
                <dt className="font-semibold text-km-charcoal">Qualification</dt>
                <dd>PQF Level 5 Diploma</dd>
              </div>
            </dl>
            <ButtonLink href="/pre-registration" className="mt-6 w-full">
              Pre-register
            </ButtonLink>
          </aside>
        </div>
      </Section>
    </>
  );
}
