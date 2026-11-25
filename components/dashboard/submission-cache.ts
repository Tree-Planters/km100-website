"use client";

import type { DashboardSubmission, SubmissionStatus } from "@/lib/dashboard";

const STORAGE_KEY = "km100:dashboard-submissions:v1";

/** Serve cached rows without any request for this long. */
const FRESH_MS = 60_000;

/** Do not restore session data older than this. */
const MAX_HYDRATE_MS = 30 * 60_000;

type CacheStatus = "idle" | "loading" | "ready" | "error";

export type SubmissionsSnapshot = {
  submissions: DashboardSubmission[];
  status: CacheStatus;
  error: string | null;
  fetchedAt: number | null;
};

type StoredCache = {
  submissions: DashboardSubmission[];
  fetchedAt: number;
};

const EMPTY_SNAPSHOT: SubmissionsSnapshot = Object.freeze({
  submissions: [] as DashboardSubmission[],
  status: "idle" as CacheStatus,
  error: null,
  fetchedAt: null,
});

let state: SubmissionsSnapshot = EMPTY_SNAPSHOT;
let hydrated = false;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined" || state.fetchedAt === null) return;

  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        submissions: state.submissions,
        fetchedAt: state.fetchedAt,
      } satisfies StoredCache)
    );
  } catch {
    // Storage full or blocked — the in-memory cache still works.
  }
}

/** Restore the last snapshot so a reload paints real numbers immediately. */
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as StoredCache | null;
    if (
      !parsed ||
      !Array.isArray(parsed.submissions) ||
      typeof parsed.fetchedAt !== "number"
    ) {
      return;
    }

    if (Date.now() - parsed.fetchedAt > MAX_HYDRATE_MS) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    state = {
      submissions: parsed.submissions,
      status: "ready",
      error: null,
      fetchedAt: parsed.fetchedAt,
    };
  } catch {
    // Unreadable or corrupt cache — start clean.
  }
}

function commit(submissions: DashboardSubmission[]) {
  state = {
    submissions,
    status: "ready",
    error: null,
    fetchedAt: Date.now(),
  };
  persist();
  emit();
}

/**
 * Load submissions into the shared cache.
 * Concurrent callers share one request; fresh cache short-circuits entirely.
 */
export function load(options: { force?: boolean } = {}): Promise<void> {
  hydrate();

  if (inFlight) return inFlight;

  const { force = false } = options;

  if (
    !force &&
    state.fetchedAt !== null &&
    Date.now() - state.fetchedAt < FRESH_MS
  ) {
    return Promise.resolve();
  }

  // Only show a spinner when there is nothing to display yet.
  if (state.submissions.length === 0) {
    state = { ...state, status: "loading", error: null };
    emit();
  } else if (force) {
    state = { ...state, error: null };
    emit();
  }

  inFlight = (async () => {
    try {
      const res = await fetch("/api/applications", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Failed to fetch submissions from database."
        );
      }

      const submissions = Array.isArray(data?.submissions)
        ? (data.submissions as DashboardSubmission[])
        : [];

      commit(submissions);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to connect to the database.";

      console.error("Failed to load dashboard submissions:", err);

      // Keep whatever rows are already visible; never blank the tables.
      state = {
        ...state,
        status: state.submissions.length > 0 ? "ready" : "error",
        error: message,
      };
      emit();
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/** Write a status change through to the cache so every page and reload sees it. */
export function applyStatus(id: string, status: SubmissionStatus) {
  let changed = false;

  const submissions = state.submissions.map((submission) => {
    if (submission.id !== id || submission.status === status) return submission;
    changed = true;
    return { ...submission, status, updatedAt: new Date().toISOString() };
  });

  if (!changed) return;

  state = {
    ...state,
    submissions,
    fetchedAt: state.fetchedAt ?? Date.now(),
  };
  persist();
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): SubmissionsSnapshot {
  hydrate();
  return state;
}

export function getServerSnapshot(): SubmissionsSnapshot {
  return EMPTY_SNAPSHOT;
}
