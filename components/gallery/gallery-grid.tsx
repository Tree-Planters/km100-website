"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  galleryCategories,
  galleryPhotos,
  type GalleryCategorySlug,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type Filter = GalleryCategorySlug | "all";

/** Photographs per page. Change this one number to show more or fewer. */
const PAGE_SIZE = 6;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All photographs" },
  ...galleryCategories.map((category) => ({
    value: category.slug as Filter,
    label: category.label,
  })),
];

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      className={className}
    >
      <path d="M9.5 3.5 5 8l4.5 4.5" />
    </svg>
  );
}

export function GalleryGrid() {
  const [active, setActive] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered =
    active === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === active);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const offset = (current - 1) * PAGE_SIZE;
  const paged = filtered.slice(offset, offset + PAGE_SIZE);

  const selectFilter = (next: Filter) => {
    setActive(next);
    setPage(1);
  };

  const photo = openIndex === null ? null : filtered[openIndex];

  const step = useCallback(
    (direction: number) => {
      setOpenIndex((index) =>
        index === null
          ? index
          : (index + direction + filtered.length) % filtered.length,
      );
    },
    [filtered.length],
  );

  const opened = openIndex !== null;

  // Move focus into the viewer the moment it opens.
  useEffect(() => {
    if (!opened) return;
    closeRef.current?.focus();
  }, [opened]);

  // Keyboard control and scroll lock while the viewer is open.
  useEffect(() => {
    if (!opened) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [opened, step]);

  const stepButtonClass =
    "inline-flex items-center gap-2 px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors";

  return (
    <div>
      {/* Filters: a select on phones, an editorial tab row from sm up. */}
      <div className="border-b border-km-charcoal/15">
        <div className="relative sm:hidden">
          <label htmlFor="gallery-filter" className="sr-only">
            Filter photographs
          </label>
          <select
            id="gallery-filter"
            value={active}
            onChange={(event) => selectFilter(event.target.value as Filter)}
            className="w-full appearance-none bg-transparent py-3.5 pr-8 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-km-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-km-orange"
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <Chevron className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 -rotate-90 text-km-charcoal/40" />
        </div>

        <div
          role="tablist"
          aria-label="Filter photographs"
          className="-mb-px hidden flex-wrap items-baseline gap-x-8 sm:flex lg:gap-x-10"
        >
          {filters.map((filter) => {
            const selected = active === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectFilter(filter.value)}
                className={cn(
                  "shrink-0 border-b-2 pb-3 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.17em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-km-orange",
                  selected
                    ? "border-km-orange text-km-charcoal"
                    : "border-transparent text-km-charcoal/40 hover:border-km-charcoal/20 hover:text-km-charcoal/75",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Photographs */}
      <div className="mt-9 columns-1 gap-4 sm:mt-10 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6">
        {paged.map((item, index) => (
          <figure key={item.id} className="mb-4 break-inside-avoid sm:mb-5 lg:mb-6">
            <button
              type="button"
              onClick={() => setOpenIndex(offset + index)}
              aria-label={`View ${item.caption} full screen`}
              className="group block w-full cursor-zoom-in overflow-hidden bg-km-warm-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-km-orange"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
              />
            </button>
            <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-[13px] leading-snug text-km-charcoal/70">
                {item.caption}
              </span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-km-charcoal/30 lining-nums">
                {item.date}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 ? (
        <nav
          aria-label="Gallery pages"
          className="mt-10 flex items-center justify-between gap-3 border-t border-km-charcoal/15 pt-4 sm:mt-12 sm:pt-5"
        >
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
            className={cn(
              stepButtonClass,
              "text-km-charcoal/60 hover:text-km-charcoal disabled:pointer-events-none disabled:text-km-charcoal/20",
            )}
          >
            <Chevron className="h-3.5 w-3.5" />
            Previous
          </button>

          <ul className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => {
              const selected = number === current;
              return (
                <li key={number}>
                  <button
                    type="button"
                    onClick={() => setPage(number)}
                    aria-current={selected ? "page" : undefined}
                    aria-label={`Page ${number}`}
                    className={cn(
                      "h-9 w-9 text-[12px] lining-nums tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-km-orange",
                      selected
                        ? "bg-km-charcoal text-km-warm-white"
                        : "text-km-charcoal/55 hover:bg-km-warm-white hover:text-km-charcoal",
                    )}
                  >
                    {String(number).padStart(2, "0")}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current === pageCount}
            className={cn(
              stepButtonClass,
              "text-km-charcoal/60 hover:text-km-charcoal disabled:pointer-events-none disabled:text-km-charcoal/20",
            )}
          >
            Next
            <Chevron className="h-3.5 w-3.5 rotate-180" />
          </button>
        </nav>
      ) : null}

      {/* Expanded viewer: the page dims behind a centred photograph. */}
      {photo && openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${photo.caption}, photograph ${openIndex + 1} of ${filtered.length}`}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-16 backdrop-blur-[2px] sm:px-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close viewer"
            className="fixed right-3 top-3 inline-flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:right-6 sm:top-6"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
              className="h-4 w-4"
            >
              <path d="M4 4l12 12M16 4 4 16" />
            </svg>
          </button>

          <figure
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="mx-auto block max-h-[60dvh] w-auto max-w-full object-contain sm:max-h-[68dvh]"
            />

            <figcaption className="mt-4 text-center sm:mt-5">
              <p className="mx-auto max-w-xl text-[13.5px] leading-snug text-balance text-white/90">
                {photo.caption}
              </p>
              <p className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/45 lining-nums tabular-nums">
                {photo.date} &middot; {openIndex + 1} / {filtered.length}
              </p>
            </figcaption>

            <div className="mt-5 flex items-center justify-center gap-8 sm:mt-6 sm:gap-12">
              <button
                type="button"
                onClick={() => step(-1)}
                className={cn(stepButtonClass, "text-white/60 hover:text-white")}
              >
                <Chevron className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className={cn(stepButtonClass, "text-white/60 hover:text-white")}
              >
                Next
                <Chevron className="h-3.5 w-3.5 rotate-180" />
              </button>
            </div>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
