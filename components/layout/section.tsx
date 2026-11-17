import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("px-4 py-16 sm:px-6 lg:py-24", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}
