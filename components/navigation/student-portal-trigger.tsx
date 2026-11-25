"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Every "Student Portal" entry point opens the same Coming soon notice while
 * the portal is not live yet, instead of navigating somewhere empty.
 *
 * The dialog is portalled to <body> because its triggers sit inside the sticky
 * header, whose backdrop-filter would otherwise become the containing block
 * for position: fixed and clip the overlay to the header.
 */
export function StudentPortalTrigger({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-coming-soon-title"
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-km-charcoal/65 p-4 backdrop-blur-md"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-[28px] bg-linear-to-br from-km-orange/70 via-km-orange/20 to-transparent p-px shadow-[0_40px_120px_-40px_rgba(20,20,20,0.75)]"
      >
        <div className="relative overflow-hidden rounded-[27px] bg-white px-6 pb-7 pt-10 text-center sm:px-8 sm:pb-8">
          {/* Ambient glow + top wash */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-km-orange/25 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-km-orange/[0.08] to-transparent"
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 z-10 rounded-full p-2 text-km-charcoal/40 transition-colors hover:bg-km-charcoal/5 hover:text-km-charcoal"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Icon tile with halo rings */}
          <div className="relative mx-auto h-[76px] w-[76px]">
            <span
              aria-hidden="true"
              className="absolute -inset-3 rounded-[30px] border border-km-orange/15"
            />
            <span
              aria-hidden="true"
              className="absolute -inset-3 animate-pulse rounded-[30px] bg-km-orange/[0.06]"
            />
            <span className="relative flex h-full w-full items-center justify-center rounded-3xl bg-linear-to-br from-km-orange to-[#ff9345] text-white shadow-[0_20px_44px_-18px_rgba(234,88,12,0.95)]">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M12 6v6l3.5 2M12 3.75a8.25 8.25 0 1 1 0 16.5 8.25 8.25 0 0 1 0-16.5Z"
                />
              </svg>
            </span>
          </div>

          <h2
            id="portal-coming-soon-title"
            className="relative mt-6 font-heading text-[27px] font-extrabold leading-tight tracking-tight text-km-charcoal sm:text-[32px]"
          >
            Cooking{" "}
            <span className="bg-linear-to-r from-km-orange to-[#ff9345] bg-clip-text text-transparent">
              Something
            </span>
          </h2>

          <p className="relative mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-km-charcoal/45">
            Coming Soon
          </p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="group relative mt-7 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-km-orange to-[#ff9345] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-16px_rgba(234,88,12,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(234,88,12,0.95)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-km-orange/40 focus-visible:ring-offset-2"
          >
            <span className="relative z-10">Got it</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onClick?.();
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(dialog, document.body)
        : null}
    </>
  );
}
