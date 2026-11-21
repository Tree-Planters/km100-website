"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** The figure to settle on. */
  value: number;
  className?: string;
};

const DURATION_MS = 1300;

function format(value: number) {
  return value.toLocaleString("en-US");
}

/**
 * Counts a figure up from zero the first time it scrolls into view.
 * No animation library: one requestAnimationFrame loop, and nothing at all
 * for visitors who ask for reduced motion (they just see the final number).
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let startedAt = 0;
    let observer: IntersectionObserver | undefined;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      setDisplay(0);
      frame = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          observer = undefined;
          start();
        },
        { threshold: 0.5 },
      );
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
