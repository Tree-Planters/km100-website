/**
 * Inner-page header: full-bleed campus photo with the title set over it.
 * Sits in normal flow, directly below the site navigation.
 */
export function PageHeader({
  title,
  description,
  titleClassName = "font-heading",
}: {
  title: string;
  description?: string;
  /** Overrides the heading font, e.g. "font-body" for a sans-serif title. */
  titleClassName?: string;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-km-charcoal">
      <img
        src="/images/km100-building.png?v=1"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-[1.07] translate-x-[2.5%] object-cover object-[50%_100%]"
      />

      {/* Scrims kept light so the building and banner stay visible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-km-charcoal/80 via-km-charcoal/45 to-km-charcoal/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-km-charcoal/85 via-km-charcoal/20 via-32% to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[20rem] w-full max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:min-h-[26rem] sm:px-6 sm:pb-16 sm:pt-28 lg:min-h-[32rem] lg:pb-20 lg:pt-32">
        

        <h1
          className={`mt-3 max-w-4xl ${titleClassName} text-[2.6rem] leading-[1.02] tracking-tight text-balance text-white sm:text-6xl lg:text-[4rem]`}
        >
          {title}
        </h1>

        {description ? (
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
