export const PROGRAM_SLUGS = [
  "computer-engineering-technology",
  "electronics-engineering-technology",
  "electrical-engineering-technology",
  "tourism-technology",
  "hospitality-technology",
] as const;

export type ProgramSlug = (typeof PROGRAM_SLUGS)[number];

export type Program = {
  slug: ProgramSlug;
  name: string;
  shortDescription: string;
};

// Draft website copy — confirm the approved descriptions with KM100.
export const programs: Program[] = [
  {
    slug: "computer-engineering-technology",
    name: "Diploma in Computer Engineering Technology",
    shortDescription: "Computer systems, hardware, and engineering technology.",
  },
  {
    slug: "electronics-engineering-technology",
    name: "Diploma in Electronics Engineering Technology",
    shortDescription: "Electronics, circuits, and technical systems.",
  },
  {
    slug: "electrical-engineering-technology",
    name: "Diploma in Electrical Engineering Technology",
    shortDescription: "Electrical systems and practical technical training.",
  },
  {
    slug: "tourism-technology",
    name: "Diploma in Tourism Technology",
    shortDescription: "Tourism, travel, and service-related learning.",
  },
  {
    slug: "hospitality-technology",
    name: "Diploma in Hospitality Technology",
    shortDescription: "Hospitality operations and practical service training.",
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
