"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  "All Photos",
  "Campus and Facilities",
  "Classrooms and Laboratories",
  "Student Activities",
  "Events and Celebrations",
  "Practical Training",
  "School Community",
] as const;

type Category = (typeof categories)[number];
type PhotoCategory = Exclude<Category, "All Photos">;

// Replace with real images from /public/gallery and a lightbox implementation.
const photos: Array<{ id: number; category: PhotoCategory; alt: string }> = [
  { id: 1, category: "Campus and Facilities", alt: "Campus exterior" },
  { id: 2, category: "Classrooms and Laboratories", alt: "Computer laboratory" },
  { id: 3, category: "Practical Training", alt: "Practical training session" },
  { id: 4, category: "Student Activities", alt: "Student activity" },
  { id: 5, category: "Events and Celebrations", alt: "School event" },
  { id: 6, category: "School Community", alt: "School community" },
];

export function GalleryGrid() {
  const [active, setActive] = useState<Category>("All Photos");
  const visible =
    active === "All Photos"
      ? photos
      : photos.filter((photo) => photo.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active === category
                ? "border-km-orange bg-km-orange text-white"
                : "border-km-charcoal/20 text-km-charcoal/70 hover:border-km-orange hover:text-km-orange",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((photo) => (
          <div
            key={photo.id}
            className="flex aspect-4/3 items-center justify-center rounded-xl border border-dashed border-km-charcoal/20 bg-km-warm-white text-xs text-km-charcoal/50"
          >
            {photo.alt}
          </div>
        ))}
      </div>
    </div>
  );
}
