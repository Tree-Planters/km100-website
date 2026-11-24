"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardSubmission } from "@/app/api/dashboard/route";
import type { SubmissionStatus } from "@/lib/dashboard";

/** Single source of dashboard submissions with status updates. */
export function useSubmissions() {
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch submissions from database.");
      }
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      console.error("Failed to load dashboard submissions:", err);
      setError(err.message || "Failed to connect to the database.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateStatus = useCallback(async (id: string, newStatus: SubmissionStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.submission) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      } else {
        alert(data.error || "Failed to update status in database.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status. Please verify database connection.");
    } finally {
      setUpdatingId(null);
    }
  }, []);

  return {
    submissions,
    loading,
    error,
    updatingId,
    refetch: fetchSubmissions,
    updateStatus,
  };
}
