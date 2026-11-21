import { cn } from "@/lib/utils";

export function Placeholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-32 items-center justify-center rounded-xl border border-dashed border-km-charcoal/20 bg-km-warm-white p-6 text-center text-sm text-km-charcoal/50",
        className,
      )}
    >
      {label}
    </div>
  );
}
