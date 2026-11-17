export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-km-charcoal/10 bg-km-warm-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <h1 className="font-heading text-3xl sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-km-charcoal/70">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
