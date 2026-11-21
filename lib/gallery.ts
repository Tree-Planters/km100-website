/**
 * Gallery content.
 *
 * Everything on /gallery is driven by this file: the tab bar reads
 * `galleryCategories`, and the grid reads `galleryPhotos`.
 *
 * To add a real photo:
 *   1. Drop the file into public/images/gallery/
 *   2. Copy an entry in `galleryPhotos` and change `src`, `alt`, `caption`,
 *      `category` and `date`
 *
 * `category` must match a `slug` from `galleryCategories`. Delete a photo by
 * deleting its entry; the page count and pagination update themselves.
 *
 * NOTE: the images below are mock photographs for layout review. Swap them
 * for real campus photos before publishing.
 */

export type GalleryCategory = {
  /** Used by photos and by the tab bar; keep it lowercase and short. */
  slug: string;
  /** Tab label. */
  label: string;
};

export const galleryCategories = [
  { slug: "campus", label: "Campus & facilities" },
  { slug: "classrooms", label: "Classrooms & laboratories" },
  { slug: "training", label: "Practical training" },
  { slug: "activities", label: "Student activities" },
  { slug: "events", label: "Events & celebrations" },
  { slug: "community", label: "School community" },
] as const satisfies readonly GalleryCategory[];

export type GalleryCategorySlug = (typeof galleryCategories)[number]["slug"];

export type GalleryPhoto = {
  id: string;
  /** Path under /public. */
  src: string;
  /** Describes the photo for screen readers and broken-image cases. */
  alt: string;
  /** Shown under the photo. */
  caption: string;
  category: GalleryCategorySlug;
  /** Shown on the right of the caption, e.g. "March 2026". */
  date: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "campus-exterior",
    src: "/images/gallery/campus-exterior.jpg",
    alt: "The KM100 training center facade and covered walkway in late afternoon light",
    caption: "The main building, late afternoon.",
    category: "campus",
    date: "March 2026",
  },
  {
    id: "courtyard",
    src: "/images/gallery/courtyard.jpg",
    alt: "Covered walkway and planted courtyard between class blocks",
    caption: "Courtyard between the class blocks.",
    category: "campus",
    date: "March 2026",
  },
  {
    id: "classroom",
    src: "/images/gallery/classroom.jpg",
    alt: "An empty classroom with wooden armchairs and open louvered windows",
    caption: "General education room, second floor.",
    category: "classrooms",
    date: "February 2026",
  },
  {
    id: "computer-lab",
    src: "/images/gallery/computer-lab.jpg",
    alt: "Students working at desktop computers in the computer laboratory",
    caption: "Computer laboratory, afternoon session.",
    category: "classrooms",
    date: "February 2026",
  },
  {
    id: "electronics-lab",
    src: "/images/gallery/electronics-lab.jpg",
    alt: "An instructor checking a student's circuit board at an electronics workbench",
    caption: "Electronics bench, instructor check.",
    category: "classrooms",
    date: "January 2026",
  },
  {
    id: "culinary-training",
    src: "/images/gallery/culinary-training.jpg",
    alt: "Culinary students in white uniforms plating food at a stainless steel counter",
    caption: "Plating service, training kitchen.",
    category: "training",
    date: "January 2026",
  },
  {
    id: "organization-fair",
    src: "/images/gallery/organization-fair.jpg",
    alt: "Students browsing organization booths in the courtyard during the club fair",
    caption: "Organization fair, main courtyard.",
    category: "activities",
    date: "August 2025",
  },
  {
    id: "intramurals",
    src: "/images/gallery/intramurals.jpg",
    alt: "An intramural basketball game on the outdoor school court",
    caption: "Intramurals, championship game.",
    category: "activities",
    date: "September 2025",
  },
  {
    id: "foundation-day",
    src: "/images/gallery/foundation-day.jpg",
    alt: "Students performing on the outdoor stage during the foundation day programme",
    caption: "Foundation Day programme.",
    category: "events",
    date: "February 2026",
  },
  {
    id: "community-clinic",
    src: "/images/gallery/community-clinic.jpg",
    alt: "Students repairing appliances at a community skills clinic under a canopy",
    caption: "Skills clinic, Barangay Cogon.",
    category: "community",
    date: "November 2025",
  },
];
