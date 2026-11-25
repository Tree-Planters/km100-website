import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { sendPreRegistrationEmails } from "@/lib/email";
import {
  ageFromBirthDate,
  isCurrentlyEnrolledFromAttainment,
} from "@/lib/tesda-form";
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
    // Duplicate submission detection — one pre-registration per email address.
    const existing = await prisma.preRegistration.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { referenceNumber: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "This email address is already pre-registered.",
          referenceNumber: existing.referenceNumber,
        },
        { status: 409 },
      );
    }

    const computedAge = Number(
      ageFromBirthDate(
        parsed.data.birthMonth,
        parsed.data.birthDay,
        parsed.data.birthYear
      )
    );
    const age =
      parsed.data.age ??
      (Number.isFinite(computedAge) && computedAge > 0 ? computedAge : null);

    await prisma.preRegistration.create({
      data: {
        ...parsed.data,
        age,
        isCurrentlyEnrolled:
          parsed.data.isCurrentlyEnrolled ??
          isCurrentlyEnrolledFromAttainment(parsed.data.educationalAttainment),
        highestAttainment:
          parsed.data.highestAttainment ??
          parsed.data.educationalAttainment,
        referenceNumber,
      },
    });
  } catch (error) {
    console.error("[pre-registration] failed to store submission", error);
    return NextResponse.json(
      { error: "We could not save your pre-registration. Please try again." },
      { status: 500 },
    );
  }

  // Email is best effort: a delivery failure must not lose the submission.
  const confirmationEmailSent = await sendPreRegistrationEmails({
    ...parsed.data,
    referenceNumber,
  });

  return NextResponse.json(
    { referenceNumber, confirmationEmailSent },
    { status: 201 },
  );
}
