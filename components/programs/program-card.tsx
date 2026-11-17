import Link from "next/link";
import type { Program } from "@/lib/programs";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex flex-col rounded-xl border border-km-charcoal/10 bg-white p-6 transition-colors hover:border-km-orange"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-km-orange">
        3-Year Diploma · PQF Level 5
      </span>
      <h3 className="mt-3 font-heading text-xl">{program.name}</h3>
      <p className="mt-2 flex-1 text-sm text-km-charcoal/70">
        {program.shortDescription}
      </p>
      <span className="mt-4 text-sm font-semibold text-km-orange group-hover:underline">
        Learn more →
      </span>
    </Link>
  );
}
