import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: {
    default:
      "KM100 Skills and Training Center, Inc. | Diploma Programs in Bogo City, Cebu",
    template: "%s | KM100 Skills and Training Center, Inc.",
  },
  description:
    "Discover KM100 Skills and Training Center, Inc. in Bogo City, Cebu. Explore five 3-year PQF Level 5 Diploma Programs and pre-register today.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-body text-km-charcoal">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
