import type { Metadata } from "next";
import { ApplicationsView } from "@/components/dashboard/applications-view";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; status?: string; date?: string }>;
}) {
  const params = await searchParams;

  return (
    <ApplicationsView
      key={`${params.program || "ALL"}-${params.status || "ALL"}-${params.date || "ALL"}`}
      initialProgram={params.program || "ALL"}
      initialStatus={params.status || "ALL"}
      initialDate={params.date || null}
    />
  );
}
