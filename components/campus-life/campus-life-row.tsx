import type { CampusLifeSection } from "@/lib/campus-life";
import { cn } from "@/lib/utils";

export function CampusLifeRow({
  section,
  flipped,
  featured = false,
}: {
  section: CampusLifeSection;
  flipped: boolean;
  /** The lead story: larger image and headline. */
  featured?: boolean;
}) {
  return (
    <article
      id={section.slug}
      className="scroll-mt-28"
    >
      <div
        className={cn(
          "grid gap-7 lg:items-center lg:gap-14",
          featured
            ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
            : "lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]",
        )}
      >
        <figure className={cn(flipped ? "lg:order-2" : "lg:order-1")}>
          <div className="overflow-hidden bg-km-charcoal/[0.04]">
            <img
              src={section.image}
              alt={section.imageAlt}
              loading={featured ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "w-full object-cover",
                featured ? "aspect-[5/4]" : "aspect-[4/3]",
              )}
            />
          </div>
          <figcaption className="mt-3 flex items-start gap-3 text-[10.5px] uppercase tracking-[0.14em] text-km-charcoal/40">
            <span
              aria-hidden
              className="mt-[0.55em] h-px w-5 shrink-0 bg-km-orange"
            />
            <span className="leading-relaxed">{section.caption}</span>
          </figcaption>
        </figure>

        {/* Copy sits in its own column beside the image, not underneath it. */}
        <div
          className={cn(flipped ? "lg:order-1" : "lg:order-2")}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-km-charcoal/45">
            {section.label}
          </p>

          <h3
            className={cn(
              "mt-4 font-heading leading-[1.1] text-balance",
              featured
                ? "text-[1.85rem] sm:text-[2.3rem] lg:text-[2.6rem]"
                : "text-[1.6rem] sm:text-[1.9rem]",
            )}
          >
            {section.title}
          </h3>

          <div className="mt-5 space-y-3.5 text-[15px] leading-[1.75] text-km-charcoal/65">
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? "text-km-charcoal/75" : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-km-charcoal/40">
              The details
            </p>
            {/* Each value runs on from its own label — no columns, no empty middle. */}
            <dl className="mt-2.5 space-y-1.5 text-[12.5px]">
              {section.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-wrap items-baseline gap-x-[3px] gap-y-0"
                >
                  <dt className="text-[11px] uppercase leading-[1.5] tracking-[0.1em] text-km-charcoal/45">
                    {fact.label}
                  </dt>
                  <dd className="font-medium tabular-nums lining-nums text-km-charcoal">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
