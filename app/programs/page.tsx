import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ProgramCard } from "@/components/programs/program-card";
import { programs } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Academic Programs",
  description:
    "Five 3-year PQF Level 5 Diploma Programs in Computer, Electronics and Electrical Engineering Technology, Tourism Technology and Hospitality Technology.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        title="Academic Programs"
        description="Five 3-year Diploma Programs at PQF Level 5."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </Section>
    </>
  );
}
