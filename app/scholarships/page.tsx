import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "TESDA scholarship opportunities for technical education and skills training at KM100 Skills and Training Center, Inc.",
};

export default function ScholarshipsPage() {
  return (
    <>
      <PageHeader
        title="Scholarships"
        description="Explore opportunities to pursue technical education and skills training. Be a TESDA Scholar!"
      />
      <Section>
        <Placeholder label="Scholarship programs, eligibility, coverage and application procedure (to be confirmed by KM100)" />
      </Section>
    </>
  );
}
