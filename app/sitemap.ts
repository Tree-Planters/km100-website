import type { MetadataRoute } from "next";
import { programs } from "@/lib/programs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const routes = [
  "",
  "/about",
  "/programs",
  "/admissions",
  "/scholarships",
  "/campus-life",
  "/gallery",
  "/pre-registration",
  "/contact",
  "/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified })),
    ...programs.map((program) => ({
      url: `${baseUrl}/programs/${program.slug}`,
      lastModified,
    })),
  ];
}
