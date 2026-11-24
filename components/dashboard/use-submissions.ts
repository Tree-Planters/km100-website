"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { SubmissionStatus } from "@/lib/dashboard";
import {
  applyStatus,
  getServerSnapshot,
  getSnapshot,
  load,
  subscribe,
} from "@/components/dashboard/submission-cache";

/**
 * Single source of dashboard submissions with status updates.
 * All dashboard pages share one cached fetch (stale-while-revalidate).
 */
export function useSubmissions() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  const refetch = useCallback(() => load({ force: true }), []);

  const updateStatus = useCallback(
    async (id: string, newStatus: SubmissionStatus) => {
      setUpdatingId(id);
      try {
        const res = await fetch("/api/dashboard", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus }),
        });
        const data = await res.json().catch(() => null);

        if (res.ok) {
          applyStatus(id, newStatus);
        } else {
          alert(data?.error || "Failed to update status in database.");
        }
      } catch (err) {
        console.error("Failed to update status:", err);
        alert("Error updating status. Please verify database connection.");
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  return {
    submissions: snapshot.submissions,
    loading: snapshot.status === "idle" || snapshot.status === "loading",
    error: snapshot.error,
    updatingId,
    refetch,
    updateStatus,
  };
}
