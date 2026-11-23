"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { programs, getProgramBySlug } from "@/lib/programs";
import { cn } from "@/lib/utils";
import type { DashboardSubmission } from "@/app/api/dashboard/route";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  ENROLLED: {
    label: "Enrolled",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
} as const;

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Selected Submission for Detailed View Modal
  const [activeItem, setActiveItem] = useState<DashboardSubmission | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchSubmissions() {
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
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function updateStatus(
    id: string,
    newStatus: "PENDING" | "CONTACTED" | "ENROLLED" | "ARCHIVED"
  ) {
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
        if (activeItem && activeItem.id === id) {
          setActiveItem((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(data.error || "Failed to update status in database.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status. Please verify database connection.");
    } finally {
      setUpdatingId(null);
    }
  }

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesProgram =
        selectedProgram === "ALL" || item.program === selectedProgram;
      const matchesStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.referenceNumber.toLowerCase().includes(q) ||
        item.firstName.toLowerCase().includes(q) ||
        item.lastName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.mobile.toLowerCase().includes(q) ||
        (item.municipality && item.municipality.toLowerCase().includes(q));

      return matchesProgram && matchesStatus && matchesSearch;
    });
  }, [submissions, selectedProgram, selectedStatus, searchQuery]);

  // Summary counts
  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "PENDING").length,
      contacted: submissions.filter((s) => s.status === "CONTACTED").length,
      enrolled: submissions.filter((s) => s.status === "ENROLLED").length,
    };
  }, [submissions]);

  // Export to CSV
  function exportToCSV() {
    if (submissions.length === 0) return;

    const headers = [
      "Reference Number",
      "Full Name",
      "Program",
      "Status",
      "Email",
      "Contact Number",
      "Civil Status",
      "Region",
      "Province",
      "City/Municipality",
      "District",
      "Barangay",
      "Street/Sitio",
      "Currently Enrolled",
      "School Name",
      "Highest Attainment",
      "Date Submitted",
    ];

    const rows = filteredSubmissions.map((s) => [
      `"${s.referenceNumber}"`,
      `"${s.lastName}, ${s.firstName} ${s.middleName || ""} ${s.suffix || ""}".trim()`,
      `"${getProgramBySlug(s.program)?.name || s.program}"`,
      `"${s.status}"`,
      `"${s.email}"`,
      `"${s.mobile}"`,
      `"${s.civilStatus || ""}"`,
      `"${s.region || ""}"`,
      `"${s.province || ""}"`,
      `"${s.municipality || ""}"`,
      `"${s.district || ""}"`,
      `"${s.barangay || ""}"`,
      `"${s.address || s.sitio || ""}"`,
      `"${s.isCurrentlyEnrolled || ""}"`,
      `"${s.currentSchool || ""}"`,
      `"${s.highestAttainment || ""}"`,
      `"${new Date(s.createdAt).toLocaleString("en-PH")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `KM100_PreRegistrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-km-warm-white/40 pb-16">
      {/* Top Header / Navigation */}
      <header className="border-b border-km-charcoal/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {/* Top Bar: Back to Home Page at the Upper Top Corner */}
          <div className="flex items-center pb-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-km-charcoal/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-km-charcoal shadow-xs transition-all duration-200 hover:-translate-x-0.5 hover:border-km-orange hover:bg-km-orange hover:text-white"
            >
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Title Row with Export CSV on the right */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-3xl font-bold text-km-charcoal sm:text-4xl">
                  Admin Portal
                </h1>
              </div>
              <p className="mt-1 text-xs text-km-charcoal/70">
                Pre-Registration Submissions & Student Inquiries Overview
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                disabled={submissions.length === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-km-charcoal/20 bg-white px-3.5 py-2 text-xs font-semibold text-km-charcoal shadow-xs transition-colors hover:border-km-orange hover:text-km-orange hover:bg-km-warm-white disabled:opacity-50"
              >
                <svg className="h-4 w-4 text-km-charcoal/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchSubmissions}
              className="rounded bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-km-charcoal/10 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-km-charcoal/70">Total Submissions</span>
              <span className="rounded-md bg-km-orange/10 p-2 text-km-orange">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold text-km-charcoal">
                {stats.total}
              </span>
              <span className="ml-2 text-xs text-km-charcoal/60">Students</span>
            </div>
          </div>

          <div className="rounded-xl border border-km-charcoal/10 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-km-charcoal/70">Pending Review</span>
              <span className="rounded-md bg-amber-50 p-2 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold text-amber-600">
                {stats.pending}
              </span>
              <span className="ml-2 text-xs text-km-charcoal/60">awaiting contact</span>
            </div>
          </div>

          <div className="rounded-xl border border-km-charcoal/10 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-km-charcoal/70">Contacted</span>
              <span className="rounded-md bg-blue-50 p-2 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold text-blue-600">
                {stats.contacted}
              </span>
              <span className="ml-2 text-xs text-km-charcoal/60">requirements sent</span>
            </div>
          </div>

          <div className="rounded-xl border border-km-charcoal/10 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-km-charcoal/70">Officially Enrolled</span>
              <span className="rounded-md bg-emerald-50 p-2 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-3">
              <span className="font-heading text-3xl font-bold text-emerald-600">
                {stats.enrolled}
              </span>
              <span className="ml-2 text-xs text-km-charcoal/60">admitted to batch</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 rounded-xl border border-km-charcoal/10 bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative min-w-[280px] flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-km-charcoal/40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, ref #, email, or city..."
                className="w-full rounded-md border border-km-charcoal/20 bg-white py-2 pl-9 pr-3 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange focus:ring-1 focus:ring-km-orange"
              />
            </div>

            {/* Filter by Program */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange"
              >
                <option value="ALL">All Programs ({submissions.length})</option>
                {programs.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-md border border-km-charcoal/20 bg-white px-3 py-2 text-sm text-km-charcoal outline-none transition-colors focus:border-km-orange"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-km-charcoal/10 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-km-charcoal/10 bg-km-warm-white/70 text-km-charcoal/80 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ref Number</th>
                  <th className="py-3.5 px-4">Applicant Name</th>
                  <th className="py-3.5 px-4">Program Applied</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-km-charcoal/10">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-km-charcoal/60">
                      <div className="inline-flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin text-km-orange" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Loading pre-registrations from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-km-charcoal/60">
                      <p className="font-medium text-sm">No pre-registration records found.</p>
                      <p className="mt-1 text-xs text-km-charcoal/40">
                        {submissions.length === 0
                          ? "New student pre-registrations submitted via the website will dynamically appear here."
                          : "Try adjusting your search query or filter options."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((item) => {
                    const statusInfo =
                      STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ||
                      STATUS_CONFIG.PENDING;

                    const progObj = getProgramBySlug(item.program);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-km-warm-white/30 transition-colors"
                      >
                        {/* Reference Number */}
                        <td className="py-3 px-4 font-mono font-semibold text-km-orange">
                          {item.referenceNumber}
                        </td>

                        {/* Applicant Name */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-km-charcoal text-sm">
                            {item.lastName}, {item.firstName} {item.middleName || ""}{" "}
                            {item.suffix || ""}
                          </div>
                           
                        </td>

                        {/* Program */}
                        <td className="py-3 px-4">
                          <span className="inline-block max-w-[220px] truncate font-medium text-km-charcoal" title={progObj?.name || item.program}>
                            {progObj?.name || item.program}
                          </span>

                        </td>

                        {/* Contact & Location */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-km-charcoal">{item.email}</div>
                           
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border",
                              statusInfo.bg
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", statusInfo.dot)} />
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3 px-4 text-km-charcoal/70 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setActiveItem(item)}
                            className="rounded-md border border-km-charcoal/20 bg-white px-3 py-1 font-semibold text-km-charcoal hover:border-km-orange hover:text-km-orange transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="border-t border-km-charcoal/10 bg-km-warm-white/40 px-4 py-3 text-xs text-km-charcoal/60 flex items-center justify-between">
            <span>
              Showing <strong>{filteredSubmissions.length}</strong> of{" "}
              <strong>{submissions.length}</strong> submissions
            </span>
            <span className="text-[11px]">KM100 Skills and Training Center Admissions</span>
          </div>
        </div>
      </main>

      {/* DETAIL MODAL DRAWER */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-km-charcoal/10 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-km-orange">
                  {activeItem.referenceNumber}
                </span>
                <h3 className="font-heading text-xl font-bold text-km-charcoal">
                  {activeItem.lastName}, {activeItem.firstName}{" "}
                  {activeItem.middleName || ""} {activeItem.suffix || ""}
                </h3>
                <p className="text-xs text-km-charcoal/60">
                  Pre-registered on{" "}
                  {new Date(activeItem.createdAt).toLocaleString("en-PH", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="rounded-lg p-1.5 text-km-charcoal/60 hover:bg-gray-100 hover:text-km-charcoal transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-km-warm-white/70 p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-km-charcoal/70">Current Status:</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                    STATUS_CONFIG[activeItem.status as keyof typeof STATUS_CONFIG]?.bg
                  )}
                >
                  {STATUS_CONFIG[activeItem.status as keyof typeof STATUS_CONFIG]?.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(["PENDING", "CONTACTED", "ENROLLED", "ARCHIVED"] as const).map(
                  (st) => (
                    <button
                      key={st}
                      disabled={updatingId === activeItem.id || activeItem.status === st}
                      onClick={() => updateStatus(activeItem.id, st)}
                      className={cn(
                        "rounded px-2.5 py-1 text-[11px] font-semibold transition-colors border",
                        activeItem.status === st
                          ? "bg-km-charcoal text-white border-km-charcoal"
                          : "bg-white text-km-charcoal/80 border-km-charcoal/20 hover:border-km-orange"
                      )}
                    >
                      Mark {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Modal Body Sections */}
            <div className="mt-6 space-y-6 text-sm text-km-charcoal">
              {/* Section I: Personal Info */}
              <div className="rounded-lg border border-km-charcoal/10 p-4">
                <h4 className="font-heading text-sm font-bold text-km-charcoal">
                  I. Personal Information
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-km-charcoal/60">Email:</span>{" "}
                    <a href={`mailto:${activeItem.email}`} className="font-semibold text-km-orange hover:underline">
                      {activeItem.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">Contact Number:</span>{" "}
                    <a href={`tel:${activeItem.mobile}`} className="font-semibold text-km-charcoal">
                      {activeItem.mobile}
                    </a>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">Civil Status:</span>{" "}
                    <span className="font-semibold">{activeItem.civilStatus || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Section II: Complete Address */}
              <div className="rounded-lg border border-km-charcoal/10 p-4">
                <h4 className="font-heading text-sm font-bold text-km-charcoal">
                  II. Complete Address (PSGC)
                </h4>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-km-charcoal/60">Region:</span>{" "}
                    <span className="font-semibold">{activeItem.region || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">Province:</span>{" "}
                    <span className="font-semibold">{activeItem.province || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">City / Municipality:</span>{" "}
                    <span className="font-semibold">{activeItem.municipality || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">District:</span>{" "}
                    <span className="font-semibold">{activeItem.district || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">Barangay:</span>{" "}
                    <span className="font-semibold">{activeItem.barangay || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-km-charcoal/60">Number / Street / Sitio:</span>{" "}
                    <span className="font-semibold">{activeItem.address || activeItem.sitio || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Section III: Educational Information */}
              <div className="rounded-lg border border-km-charcoal/10 p-4">
                <h4 className="font-heading text-sm font-bold text-km-charcoal">
                  III. Educational Background
                </h4>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-km-charcoal/60">Currently Enrolled:</span>{" "}
                    <span className="font-semibold">{activeItem.isCurrentlyEnrolled || "N/A"}</span>
                  </div>
                  {activeItem.isCurrentlyEnrolled === "YES" ? (
                    <>
                      <div>
                        <span className="text-km-charcoal/60">Current School:</span>{" "}
                        <span className="font-semibold">{activeItem.currentSchool || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-km-charcoal/60">Current Grade / Year:</span>{" "}
                        <span className="font-semibold">{activeItem.currentGradeLevel || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-km-charcoal/60">Current Track / Program:</span>{" "}
                        <span className="font-semibold">{activeItem.currentProgram || "N/A"}</span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="text-km-charcoal/60">Highest Attainment:</span>{" "}
                      <span className="font-semibold">{activeItem.highestAttainment || "N/A"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section IV: Program Applied */}
              <div className="rounded-lg border border-km-orange/20 bg-km-warm-white/40 p-4">
                <h4 className="font-heading text-sm font-bold text-km-charcoal">
                  IV. Program Applied
                </h4>
                <div className="mt-2 text-xs">
                  <div className="text-base font-bold text-km-orange">
                    {getProgramBySlug(activeItem.program)?.name || activeItem.program}
                  </div>
                  <div className="mt-1 text-km-charcoal/70">
                    3-Year Diploma Program • PQF Level 5 Qualification
                  </div>
                </div>
              </div>

              {/* Section V: Consent & Acknowledgement */}
              <div className="rounded-lg bg-gray-50 p-3 text-[11px] text-km-charcoal/70">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Student acknowledged that this form serves as pre-registration only.</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Student consented to Republic Act No. 10173 (Data Privacy Act of 2012).</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end border-t border-km-charcoal/10 pt-4">
              <button
                onClick={() => setActiveItem(null)}
                className="rounded-md bg-km-charcoal px-5 py-2 text-xs font-semibold text-white hover:bg-km-charcoal/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
