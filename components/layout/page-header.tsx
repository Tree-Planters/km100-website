export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-km-charcoal/10 bg-km-warm-white">
      {/* Campus facade - small screens: full-bleed under a warm veil */}
      <div aria-hidden="true" className="absolute inset-0 sm:hidden">
        <img
          src="/images/km100-facade.webp"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-km-warm-white/75" />
        <div className="absolute inset-0 bg-linear-to-b from-km-warm-white/30 to-km-warm-white/80" />
      </div>

      {/* Campus facade - sm and up: right-hand band, faded into the warm white */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[46%] sm:block"
      >
        <img
          src="/images/km100-facade.webp"
          alt=""
          className="h-full w-full object-cover object-center [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.3)_38%,#000_80%)]"
        />
      </div>

      {/* Blend - opaque warm white behind the copy, clearing toward the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-km-warm-white from-26% via-km-warm-white/82 via-50% to-km-warm-white/0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-km-warm-white/30 via-transparent to-km-warm-white/50"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <h1 className="font-heading text-3xl sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-km-charcoal/70">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
