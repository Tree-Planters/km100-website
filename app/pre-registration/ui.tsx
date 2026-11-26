"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-[1.05rem] w-[1.05rem] animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function SummaryGroup({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (index: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-km-charcoal/10 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-km-charcoal/10 bg-km-warm-white/60 px-4 py-2.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-km-charcoal/50">
          {title}
        </h4>
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="shrink-0 rounded-full border border-km-charcoal/15 px-2.5 py-1 text-[11px] font-semibold text-km-charcoal/70 transition-colors hover:border-km-orange hover:text-km-orange"
        >
          Edit
        </button>
      </div>
      <dl className="grid gap-3 px-4 py-4 text-xs sm:grid-cols-2">{children}</dl>
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  className,
}: {
  label: string;
  value?: string;
  className?: string;
}) {
  const text = (value ?? "").trim();
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-km-charcoal/55">{label}</dt>
      <dd className="mt-0.5 break-words font-semibold text-km-charcoal">
        {text || "\u2014"}
      </dd>
    </div>
  );
}
