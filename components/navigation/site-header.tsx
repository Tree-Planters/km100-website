"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About KM100" },
  { href: "/programs", label: "Academic Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/campus-life", label: "Campus Life" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const portalUrl = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL;

  return (
    <header className="sticky top-0 z-50 border-b border-km-charcoal/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-bold">
          KM<span className="text-km-orange">100</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-km-charcoal/80 transition-colors hover:text-km-orange"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {portalUrl ? (
            <a
              href={portalUrl}
              className="hidden text-sm font-semibold text-km-charcoal hover:text-km-orange sm:block"
            >
              Student Portal
            </a>
          ) : null}
          <Link
            href="/pre-registration"
            className="rounded-md bg-km-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-km-orange/90"
          >
            Pre-Register
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-km-charcoal/15 lg:hidden"
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
          className="border-t border-km-charcoal/10 bg-white lg:hidden"
        >
          <ul className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-medium text-km-charcoal/80 hover:text-km-orange"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
