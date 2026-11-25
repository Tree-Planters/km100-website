import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * GET /api/pre-registration/check-email?email=...
 *
 * Cross-checks whether an email address already has a pre-registration, so the
 * form can flag a duplicate on step 1 instead of only when the form is sent.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { exists: false, referenceNumber: null, program: null },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const existing = await prisma.preRegistration.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { referenceNumber: true, program: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        exists: Boolean(existing),
        referenceNumber: existing?.referenceNumber ?? null,
        program: existing?.program ?? null,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[pre-registration] email check failed", error);
    return NextResponse.json(
      { error: "Could not check this email right now." },
      { status: 500 }
    );
  }
}
