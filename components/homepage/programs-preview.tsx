import { Section } from "@/components/layout/section";
import { ProgramCard } from "@/components/programs/program-card";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/programs";

export function ProgramsPreview() {
  return (
    <Section id="programs">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-3xl sm:text-4xl">
          Five programs. Three years.
        </h2>
        <ButtonLink href="/programs" variant="outline">
          View all programs
        </ButtonLink>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program.slug} program={program} />
        ))}
      </div>
    </Section>
  );
}
