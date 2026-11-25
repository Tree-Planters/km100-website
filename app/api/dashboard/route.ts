import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { sendApplicationConfirmedEmail } from "@/lib/email";
import type { DashboardSubmission } from "@/lib/dashboard";

const NO_STORE = { "Cache-Control": "private, no-store" };

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
