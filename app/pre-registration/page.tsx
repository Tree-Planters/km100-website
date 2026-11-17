import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { PreRegistrationForm } from "@/components/forms/pre-registration-form";

export const metadata: Metadata = {
  title: "Pre-Registration",
  description:
    "Submit your pre-registration for the 3-year PQF Level 5 Diploma Programs at KM100 Skills and Training Center, Inc.",
};

export default function PreRegistrationPage() {
  return (
    <>
      <PageHeader
        title="Pre-Registration"
        description="This is pre-registration only — not official admission or enrollment."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <PreRegistrationForm />
        </div>
      </Section>
    </>
  );
}
