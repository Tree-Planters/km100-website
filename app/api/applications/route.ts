import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import type { DashboardSubmission } from "@/lib/dashboard";

// Applications are read live; caching is handled on the client.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * GET /api/applications
 *
 * Returns every pre-registration application, newest first.
 * Optional filters: ?status=PENDING|CONTACTED|ENROLLED|ARCHIVED, ?program=<slug>, ?q=<search>
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const programFilter = searchParams.get("program");
  const search = searchParams.get("q")?.toLowerCase();

  try {
    const submissions = await prisma.preRegistration.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        ...(statusFilter && statusFilter !== "ALL"
          ? { status: statusFilter as DashboardSubmission["status"] }
          : {}),
        ...(programFilter && programFilter !== "ALL"
          ? { program: programFilter }
          : {}),
        ...(search
          ? {
              OR: [
                { referenceNumber: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { mobile: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    });

    return NextResponse.json(
      { submissions, total: submissions.length },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[applications-api] Database query error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch pre-registration submissions from database.",
        submissions: [],
        total: 0,
      },
      { status: 500, headers: NO_STORE }
    );
  }
}
