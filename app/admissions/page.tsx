import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission information, pre-registration guidance and next steps for KM100 Skills and Training Center, Inc.",
};

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        title="Admissions"
        description="Admission information and pre-registration guidance."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          <Placeholder label="Admission requirements" />
          <Placeholder label="Pre-registration steps" />
          <Placeholder label="Next steps after pre-registration" />
        </div>
      </Section>
    </>
  );
}
