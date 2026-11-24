"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 6a2 2 0 012-2h3v6H4V6zm0 6h5v8H4v-8zm8 8V12h4a2 2 0 012 2v6h-6zm0-8V4h4a2 2 0 012 2v6h-6z"
      />
    ),
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 17v-6m4 6V7m4 10v-4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    ),
  },
];

function Brand() {
  return (
    <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_-16px_rgba(37,37,37,0.45)]">
        <img
          src="/logo/km100_logo-transparent.png"
          alt="KM100 Skills and Training Center, Inc. logo"
          className="h-full w-full object-contain"
        />
      </span>
      <span className="min-w-0 leading-none">
        <span className="block font-brand text-[22px] font-extrabold tracking-tight text-km-charcoal">
          <span className="text-km-orange">KM</span>100
        </span>
        <span className="mt-1.5 block truncate text-[9px] font-semibold uppercase tracking-[0.17em] text-km-charcoal/45">
          Skills and Training Center, Inc.
        </span>
      </span>
    </Link>
  );
}

function BackToHome({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 font-semibold text-km-charcoal/65 backdrop-blur-md transition-all hover:border-km-orange/40 hover:bg-white/80 hover:text-km-orange",
        compact ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-[11.5px]"
      )}
    >
      <svg
        className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to home
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-white/60 bg-white/65 px-4 backdrop-blur-2xl lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-xl border border-white/80 bg-white/60 p-2 text-km-charcoal/70 backdrop-blur-md transition-colors hover:border-km-orange/50 hover:text-km-orange"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-km-charcoal/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-white/60 bg-white/55 backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-white/60 px-4 pb-5 pt-5">
          <div className="flex items-center justify-between gap-2">
            <BackToHome />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-km-charcoal/45 transition-colors hover:bg-white/70 hover:text-km-charcoal lg:hidden"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-5 px-1">
            <Brand />
          </div>
        </div>

        <div className="px-3 pt-5">
          <p className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/35">
            Admissions Portal
          </p>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-km-orange to-km-orange/85 text-white shadow-[0_10px_28px_-14px_rgba(244,119,33,0.85)]"
                      : "text-km-charcoal/70 hover:bg-white/70 hover:text-km-charcoal"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      active
                        ? "border-white/30 bg-white/15 text-white"
                        : "border-white/80 bg-white/60 text-km-charcoal/60 group-hover:text-km-orange"
                    )}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </span>
                  <span className="block text-[13px] font-semibold leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-5 pb-6 pt-6">
          <div className="rounded-2xl border border-white/70 bg-white/45 p-3.5 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-km-orange">
              Live records
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-km-charcoal/60">
              Every pre-registration submitted on the website lands here.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
