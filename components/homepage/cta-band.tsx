import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand() {
  return (
    <Section className="bg-km-charcoal text-white">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <h2 className="font-heading text-3xl sm:text-4xl">
          Be practical. Get technical.
        </h2>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/pre-registration">Pre-register now</ButtonLink>
          <ButtonLink href="/scholarships" variant="ghost">
            Scholarship opportunities
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
