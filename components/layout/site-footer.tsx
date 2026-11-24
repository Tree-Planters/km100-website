"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { programs } from "@/lib/programs";
import { siteConfig } from "@/lib/site-config";

const quickLinks = [
  { href: "/about", label: "About KM100" },
  { href: "/admissions", label: "Admissions" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/campus-life", label: "Campus Life" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const portalUrl = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL;
  const year = new Date().getFullYear();

  // The dashboard has its own full-height shell, so the marketing footer is hidden.
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-km-charcoal text-sm text-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src="/logo/km100_logo-transparent.png"
              alt="KM100 Skills and Training Center, Inc. logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="font-brand text-lg font-extrabold tracking-tight text-white">
                <span className="text-km-orange">KM</span>100
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Skills and Training Center, Inc.
              </p>
            </div>
          </div>
          <p className="mt-3 leading-relaxed">
            KM100 Skills and Training Center, Inc. — committed to quality
            technical education, skills training and social service.
          </p>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-km-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-white">Diploma Programs</p>
          <ul className="mt-3 space-y-2">
            {programs.map((program) => (
              <li key={program.slug}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="hover:text-km-orange"
                >
                  {program.name.replace("Diploma in ", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 break-words">
            <li>{siteConfig.contact.address}</li>
            <li>0967 093 5811</li>
            <li>km100skillsandtrainingcenter@gmail.com</li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=100090317439588"
                className="hover:text-km-orange"
              >
                Facebook
              </a>
            </li>
            {portalUrl ? (
              <li>
                <a href={portalUrl} className="hover:text-km-orange">
                  Student Portal
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs">
        © {year} KM100 Skills and Training Center, Inc. ·{" "}
        <Link href="/privacy-policy" className="hover:text-km-orange">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
