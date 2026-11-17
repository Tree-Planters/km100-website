import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KM100 Skills and Training Center, Inc. collects, uses and protects personal data submitted through the website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <Section>
        <Placeholder label="Data collection, purpose, retention, and data subject rights (Data Privacy Act of 2012)" />
      </Section>
    </>
  );
}
