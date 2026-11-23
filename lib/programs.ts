export const PROGRAM_SLUGS = [
  "hospitality-technology",
  "tourism-technology",
  "computer-engineering-technology",
  "electrical-engineering-technology",
  "electronics-engineering-technology",
  "restaurant-operations-technology",
  "culinary-arts-technology",
] as const;

export type ProgramSlug = (typeof PROGRAM_SLUGS)[number];

export type Program = {
  slug: ProgramSlug;
  name: string;
  shortDescription: string;
};

export const programs: Program[] = [
  {
    slug: "hospitality-technology",
    name: "Diploma in Hospitality Technology",
    shortDescription: "Hospitality operations, lodging management, and customer service.",
  },
  {
    slug: "tourism-technology",
    name: "Diploma in Tourism Technology",
    shortDescription: "Tourism operations, travel management, and tour leadership.",
  },
  {
    slug: "computer-engineering-technology",
    name: "Diploma in Computer Engineering Technology",
    shortDescription: "Computer systems, networking, hardware, and engineering technology.",
  },
  {
    slug: "electrical-engineering-technology",
    name: "Diploma in Electrical Engineering Technology",
    shortDescription: "Electrical systems, power installations, and practical technical training.",
  },
  {
    slug: "electronics-engineering-technology",
    name: "Diploma in Electronics Engineering Technology",
    shortDescription: "Electronics, circuits, automation, and technical systems.",
  },
  {
    slug: "restaurant-operations-technology",
    name: "Diploma in Restaurant Operations Technology",
    shortDescription: "Food and beverage management, dining service, and restaurant operations.",
  },
  {
    slug: "culinary-arts-technology",
    name: "Diploma in Culinary Arts Technology",
    shortDescription: "Culinary techniques, commercial kitchen operations, and gastronomy.",
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
