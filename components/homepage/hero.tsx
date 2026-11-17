import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <Section className="bg-km-warm-white">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-km-orange">
            KM100 Skills and Training Center, Inc.
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl">
            Build your future. Get practical. Get technical.
          </h1>
          <p className="mt-5 max-w-xl text-km-charcoal/70">
            Five 3-year Diploma Programs at PQF Level 5, right here in Northern
            Cebu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programs">Explore our programs</ButtonLink>
            <ButtonLink href="/pre-registration" variant="outline">
              Pre-register now
            </ButtonLink>
          </div>
        </div>
        <div
          aria-hidden
          className="aspect-4/3 rounded-2xl bg-km-charcoal/10"
        />
      </div>
    </Section>
  );
}
