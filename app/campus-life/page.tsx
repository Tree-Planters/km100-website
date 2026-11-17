import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "Campus Life",
  description:
    "Student activities, practical training, school events and community involvement at KM100 Skills and Training Center, Inc.",
};

export default function CampusLifePage() {
  return (
    <>
      <PageHeader
        title="Campus Life"
        description="Student activities, practical training and school events."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Placeholder label="Student activities and organizations" />
          <Placeholder label="Events, celebrations and community involvement" />
        </div>
      </Section>
    </>
  );
}
