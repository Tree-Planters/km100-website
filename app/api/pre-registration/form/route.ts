import { NextResponse } from "next/server";
import type { TesdaFormData } from "@/lib/tesda-form";
import { buildTesdaPdf } from "@/lib/tesda-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STRING_KEYS = [
  "entryDate",
  "lastName",
  "firstName",
  "middleName",
  "extension",
  "street",
  "barangay",
  "district",
  "city",
  "province",
  "region",
  "emailAccount",
  "contactNo",
  "nationality",
  "sex",
  "civilStatus",
  "employmentStatus",
  "employmentType",
  "birthMonth",
  "birthDay",
  "birthYear",
  "age",
  "birthCity",
  "birthProvince",
  "birthRegion",
  "educationalAttainment",
  "parentName",
  "parentAddress",
  "classificationOthers",
  "course",
  "scholarship",
  "consentAgree",
] as const;

/** Coerces an untrusted draft payload into the form data used by the PDF. */
function coerce(input: Record<string, unknown>): TesdaFormData {
  const data: Record<string, string | string[]> = {};

  for (const key of STRING_KEYS) {
    const value = input[key];
    if (value === null || value === undefined) continue;
    data[key] = String(value).slice(0, 200);
  }

  const classification = input.classification;
  if (Array.isArray(classification)) {
    data.classification = classification
      .map((entry) => String(entry).slice(0, 200))
      .slice(0, 30);
  } else if (typeof classification === "string" && classification) {
    data.classification = [classification.slice(0, 200)];
  }

  return data as TesdaFormData;
}

/**
 * POST /api/pre-registration/form
 *
 * Builds the filled TESDA DPA Form 1 PDF from the live review-step draft
 * without saving anything.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  try {
    const pdf = await buildTesdaPdf(coerce(body as Record<string, unknown>));

    return new NextResponse(new Uint8Array(pdf) as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="TESDA-DPA-Form-1-preview.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[pre-registration] failed to build preview PDF", error);
    return NextResponse.json(
      { error: "Could not build the Learners Profile Form preview." },
      { status: 500 }
    );
  }
}
