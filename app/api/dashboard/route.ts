import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { sendApplicationConfirmedEmail } from "@/lib/email";

// The dashboard always reads live records; caching is handled on the client.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

export type DashboardSubmission = {
  id: string;
  referenceNumber: string;
  status: "PENDING" | "CONTACTED" | "ENROLLED" | "ARCHIVED";
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  email: string;
  mobile: string;
  civilStatus?: string | null;
  address?: string | null;
  sitio?: string | null;
  barangay?: string | null;
  district?: string | null;
  municipality?: string | null;
  province?: string | null;
  region?: string | null;
  regionCode?: string | null;
  provinceCode?: string | null;
  cityCode?: string | null;
  barangayCode?: string | null;
  isCurrentlyEnrolled?: string | null;
  currentSchool?: string | null;
  currentGradeLevel?: string | null;
  currentProgram?: string | null;
  highestAttainment?: string | null;
  program: string;
  acknowledgement: boolean;
  consent: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const programFilter = searchParams.get("program");
  const search = searchParams.get("q")?.toLowerCase();

  try {
    const records = await prisma.preRegistration.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        ...(statusFilter && statusFilter !== "ALL"
          ? { status: statusFilter as any }
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
      {
        submissions: records,
        total: records.length,
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[dashboard-api] Database query error:", error);
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

const STATUS_VALUES: DashboardSubmission["status"][] = [
  "PENDING",
  "CONTACTED",
  "ENROLLED",
  "ARCHIVED",
];

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.id || !body.status) {
      return NextResponse.json(
        { error: "Submission ID and new status are required." },
        { status: 400, headers: NO_STORE }
      );
    }

    const { id, status } = body as { id: string; status: string };

    if (!STATUS_VALUES.includes(status as DashboardSubmission["status"])) {
      return NextResponse.json(
        { error: `Unknown status "${status}".` },
        { status: 400, headers: NO_STORE }
      );
    }

    const existing = await prisma.preRegistration.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404, headers: NO_STORE }
      );
    }

    const updated = await prisma.preRegistration.update({
      where: { id },
      data: { status: status as DashboardSubmission["status"] },
    });

    // Confirmation email fires only on the transition into ENROLLED, so
    // re-saving an already-enrolled application does not send it again.
    let confirmationEmailSent: boolean | null = null;
    if (updated.status === "ENROLLED" && existing.status !== "ENROLLED") {
      confirmationEmailSent = await sendApplicationConfirmedEmail({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        referenceNumber: updated.referenceNumber,
        program: updated.program,
      });
    }

    return NextResponse.json(
      { success: true, submission: updated, confirmationEmailSent },
      { headers: NO_STORE }
    );
  } catch (err) {
    console.error("[dashboard-api] Error updating submission status:", err);
    return NextResponse.json(
      { error: "Failed to update submission status in database." },
      { status: 500, headers: NO_STORE }
    );
  }
}
