import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { sendPreRegistrationEmails } from "@/lib/email";
import { generateReferenceNumber } from "@/lib/utils";
import { validatePreRegistration } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const referenceNumber = searchParams.get("referenceNumber");

  if (!referenceNumber) {
    return NextResponse.json(
      { message: "KM100 Pre-Registration API is operational." },
      { status: 200 },
    );
  }

  const registration = await prisma.preRegistration.findUnique({
    where: { referenceNumber },
    select: {
      referenceNumber: true,
      status: true,
      program: true,
      createdAt: true,
    },
  });

  if (!registration) {
    return NextResponse.json(
      { error: "Pre-registration not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(registration, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = validatePreRegistration(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { email, program } = parsed.data;
  const referenceNumber = generateReferenceNumber();

  try {
    // Duplicate submission detection.
    const existing = await prisma.preRegistration.findFirst({
      where: { email, program },
      select: { referenceNumber: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "A pre-registration with this email already exists for this program.",
          referenceNumber: existing.referenceNumber,
        },
        { status: 409 },
      );
    }

    await prisma.preRegistration.create({
      data: { ...parsed.data, referenceNumber },
    });
  } catch (error) {
    console.error("[pre-registration] failed to store submission", error);
    return NextResponse.json(
      { error: "We could not save your pre-registration. Please try again." },
      { status: 500 },
    );
  }

  // Email is best effort: a delivery failure must not lose the submission.
  await sendPreRegistrationEmails({ ...parsed.data, referenceNumber });

  return NextResponse.json({ referenceNumber }, { status: 201 });
}
