import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GLASS_CARD } from "@/lib/dashboard";

export const STAT_TONES = {
  orange: {
    glow: "bg-km-orange/15",
    tile: "border-km-orange/25 bg-gradient-to-br from-km-orange/20 to-km-orange/5 text-km-orange",
    bar: "bg-gradient-to-r from-km-orange to-amber-400",
    dot: "bg-km-orange/60",
    hover: "hover:border-km-orange/40",
  },
  amber: {
    glow: "bg-amber-300/25",
    tile: "border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600",
    bar: "bg-gradient-to-r from-amber-400 to-amber-300",
    dot: "bg-amber-400",
    hover: "hover:border-amber-300",
  },
  blue: {
    glow: "bg-blue-300/25",
    tile: "border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600",
    bar: "bg-gradient-to-r from-blue-500 to-blue-400",
    dot: "bg-blue-400",
    hover: "hover:border-blue-300",
  },
  emerald: {
    glow: "bg-emerald-300/25",
    tile: "border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600",
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    dot: "bg-emerald-400",
    hover: "hover:border-emerald-300",
  },
  neutral: {
    glow: "bg-km-charcoal/10",
    tile: "border-km-charcoal/15 bg-gradient-to-br from-km-charcoal/10 to-km-charcoal/[0.03] text-km-charcoal/60",
    bar: "bg-gradient-to-r from-km-charcoal/50 to-km-charcoal/30",
    dot: "bg-km-charcoal/30",
    hover: "hover:border-km-charcoal/25",
  },
} as const;

export function StatCard({
  tone,
  label,
  value,
  unit,
  note,
  share,
  icon,
  href,
  loading = false,
}: {
  tone: keyof typeof STAT_TONES;
  label: string;
  value: number;
  unit: string;
  note?: string;
  share: number;
  icon: ReactNode;
  href?: string;
  loading?: boolean;
}) {
  const palette = STAT_TONES[tone];

  const content = (
    <>
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125",
          palette.glow
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="block truncate text-[10.5px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/45">
            {label}
          </span>
          <div className="mt-3 flex items-end gap-1.5">
            {loading ? (
              <span className="h-10 w-16 animate-pulse rounded-lg bg-km-charcoal/10 inline-block mb-1" />
            ) : (
              <span className="font-body text-[2.9rem] font-bold leading-none tracking-tight text-km-charcoal tabular-nums">
                {value}
              </span>
            )}
            <span className="pb-1 text-[11px] font-medium text-km-charcoal/45">{unit}</span>
          </div>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
            palette.tile
          )}
        >
          {icon}
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-km-charcoal/[0.06]">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", palette.bar)}
            style={{ width: `${share}%` }}
          />
        </div>
        <span className="text-[10.5px] font-semibold tabular-nums text-km-charcoal/40">
          {share}%
        </span>
      </div>

      <div className={cn("relative mt-3 flex items-center gap-2", note ? "justify-between" : "justify-end")}>
        {note && (
          <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-km-charcoal/45">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", palette.dot)} />
            <span className="truncate">{note}</span>
          </p>
        )}
        {href && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[10.5px] font-semibold text-km-charcoal/60 transition-colors group-hover:bg-km-orange/10 group-hover:text-km-orange">
            View
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  const className = cn(
    "group relative block overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5",
    GLASS_CARD,
    palette.hover
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
