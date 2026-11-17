import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "About KM100",
  description:
    "Institutional profile, background, mission, vision and educational commitment of KM100 Skills and Training Center, Inc.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About KM100"
        description="An institution committed to provide quality technical education, skills training and social service."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Placeholder label="Institutional background and history" />
          <Placeholder label="Mission, vision and educational philosophy" />
        </div>
      </Section>
    </>
  );
}
