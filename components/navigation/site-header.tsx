"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnnouncementBar } from "@/components/navigation/announcement-bar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/campus-life", label: "Campus Life" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Point this at the real portal with NEXT_PUBLIC_STUDENT_PORTAL_URL in .env.
  const portalUrl = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL || "#";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // On /dashboard, display only the logo and KM100 Skills and Training Center, Inc. (no announcement bar or nav items)
  if (pathname.startsWith("/dashboard")) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 shadow-[0_1px_0_rgba(37,37,37,0.08)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:h-[72px]">
          <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <img
              src="/logo/km100_logo-transparent.png"
              alt="KM100 Skills and Training Center, Inc. logo"
              className="h-11 w-11 object-contain transition-transform duration-300 hover:scale-105 xl:h-12 xl:w-12"
            />
            <span className="flex flex-col leading-none">
              <span className="font-brand text-[20px] font-extrabold tracking-tight text-km-charcoal sm:text-[24px]">
                <span className="text-km-orange">KM</span>100
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/70">
                Skills and Training Center, Inc.
              </span>
            </span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow-[0_1px_0_rgba(37,37,37,0.08)] backdrop-blur-md">
      <AnnouncementBar />

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:h-[84px] xl:gap-6">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <img
            src="/logo/km100_logo-transparent.png"
            alt="KM100 Skills and Training Center, Inc. logo"
            className="h-11 w-11 object-contain transition-transform duration-300 hover:scale-105 xl:h-12 xl:w-12"
          />
          <span className="flex flex-col leading-none">
            <span className="font-brand text-[20px] font-extrabold tracking-tight text-km-charcoal sm:text-[24px]">
              <span className="text-km-orange">KM</span>100
            </span>
            <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/50 2xl:block">
              Skills and Training Center, Inc.
            </span>
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-1.5 xl:ml-auto xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-2 text-[13.5px] font-medium transition-all duration-200 ease-out",
                isActive(item.href)
                  ? "bg-km-charcoal text-white shadow-sm shadow-km-charcoal/25"
                  : "text-km-charcoal/70 hover:-translate-y-0.5 hover:bg-km-charcoal/5 hover:text-km-charcoal",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <span
            aria-hidden="true"
            className="mx-1 hidden h-6 w-px bg-km-charcoal/10 xl:block"
          />

          <Link
            href={portalUrl}
            className="hidden items-center whitespace-nowrap rounded-full border border-km-charcoal/15 bg-white px-4 py-2 text-[13px] font-semibold text-km-charcoal shadow-[0_1px_2px_rgba(37,37,37,0.06)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-km-charcoal hover:bg-km-charcoal hover:text-white hover:shadow-md hover:shadow-km-charcoal/20 active:translate-y-0 active:scale-[0.98] lg:inline-flex"
          >
            Student Portal
          </Link>

          <Link
            href="/pre-registration"
            className="group relative inline-flex items-center overflow-hidden whitespace-nowrap rounded-full bg-linear-to-r from-km-orange to-[#ff9345] px-3 py-2 text-[11.5px] font-semibold text-white shadow-md shadow-km-orange/25 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-km-orange/40 active:translate-y-0 active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-[13px]"
          >
            <span className="relative z-10">Pre-Register Now</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-km-charcoal/15 text-km-charcoal transition-all duration-200 hover:border-km-orange hover:text-km-orange sm:ml-1 xl:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-km-charcoal/10 bg-white xl:hidden"
        >
          <ul className="mx-auto w-full max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-km-charcoal text-white"
                      : "text-km-charcoal/80 hover:bg-km-charcoal/5 hover:text-km-charcoal",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={portalUrl}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-full border border-km-charcoal/15 bg-white px-4 py-2.5 text-sm font-semibold text-km-charcoal shadow-[0_1px_2px_rgba(37,37,37,0.06)] transition-all duration-200 hover:border-km-charcoal hover:bg-km-charcoal hover:text-white"
              >
                Student Portal
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
