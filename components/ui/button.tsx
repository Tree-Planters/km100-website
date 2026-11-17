import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-km-orange text-white hover:bg-km-orange/90",
  secondary: "bg-km-charcoal text-white hover:bg-km-charcoal/90",
  outline:
    "border border-km-charcoal/20 text-km-charcoal hover:border-km-orange hover:text-km-orange",
  ghost:
    "border border-white/30 text-white hover:border-km-orange hover:text-km-orange",
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
