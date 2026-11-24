import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import {
  aboutIntro,
  institutionalStatement,
  philosophyPillars,
} from "@/lib/about-content";

// Homepage Section 05 — About KM100. Uses the same copy as /about.
export function AboutPreview() {
  return (
    <Section className="bg-km-warm-white">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-14">
        <div>
          <img
            src="/gallery/ceremony-ribbon-cutting-02.jpg"
            alt="KM100 Skills and Training Center campus"
            className="h-auto w-full rounded-2xl object-center"
          />
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-km-orange uppercase">
            About KM100
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-snug sm:text-4xl">
            Empowering communities through technical education.
          </h2>

          <p className="mt-6 border-l-2 border-km-orange pl-4 leading-relaxed text-km-charcoal/80 sm:pl-5">
            {institutionalStatement}
          </p>

          <p className="mt-6 leading-relaxed text-km-charcoal/70">
            {aboutIntro[1]}
          </p>

          <ul className="mt-8 space-y-3">
            {philosophyPillars.map((pillar) => (
              <li key={pillar.number} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-km-orange"
                />
                <span className="font-semibold text-km-charcoal">
                  {pillar.title}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ButtonLink href="/about" variant="outline" shape="pill">
              Learn more about KM100
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
