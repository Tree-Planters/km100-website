import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { buildTesdaFormData } from "@/lib/tesda-form";
import { buildTesdaPdf } from "@/lib/tesda-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/applications/:referenceNumber/form
 *
 * Returns the applicant's TESDA DPA Form 1 as a filled, flattened PDF
 * (the real template with their answers written into its boxes).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ referenceNumber: string }> }
) {
  const { referenceNumber } = await params;

  const record = await prisma.preRegistration.findUnique({
    where: { referenceNumber },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Pre-registration not found." },
      { status: 404 }
    );
  }

  try {
    const data = buildTesdaFormData(record as unknown as Record<string, any>);
    const pdf = await buildTesdaPdf(data);

    return new NextResponse(new Uint8Array(pdf) as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="TESDA-DPA-Form-1-${referenceNumber}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[applications] failed to build form PDF", error);
    return NextResponse.json(
      { error: "Could not build the Learners Profile Form." },
      { status: 500 }
    );
  }
}
