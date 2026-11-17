import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-km-warm-white sm:min-h-[640px] lg:min-h-[900px]">
      {/* Full-Width Banner Image */}
      <img
        src="/images/km100_banner.jpg"
        alt="KM100 Skills and Training Center campus and students"
        className="absolute inset-0 h-full w-full object-cover object-center lg:translate-x-[16%] lg:object-right"
      />

      {/* Mobile / tablet: white veil so the stacked text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-km-warm-white/65 sm:bg-km-warm-white/60 lg:hidden"
      />

      {/* All sizes: white filter falling off to the right, heaviest on the left */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-km-warm-white from-5% via-km-warm-white/95 via-40% to-km-warm-white/55 lg:w-[68%] lg:via-km-warm-white lg:via-65% lg:to-transparent"
      />

      {/* Text column shares the header container so everything lines up */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="max-w-xl">
         
          <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
            <span className="block">Build your future.</span>
            <span className="block">Get practical.</span>
            <span className="block">Get technical.</span>
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-km-charcoal/70">
          Explore industry-focused technical education
            and three-year Diploma Programs at PQF Level 5, right here in
            Northern Cebu.
          </p>

          {/* Milestone — editorial rule, no card chrome */}
          <div className="mt-8 max-w-md border-l-2 border-km-orange pl-4 sm:pl-5">
            <p className="text-[15px] leading-relaxed text-km-charcoal/60 sm:text-base">
              <span className="font-semibold text-km-charcoal">
                First Technical-Vocational Institution in Northern Cebu
              </span>{" "}
              to offer 3-Year Diploma Programs at PQF Level 5.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programs">Explore our programs</ButtonLink>
            <ButtonLink href="/pre-registration" variant="secondary">
              Pre-register now
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
