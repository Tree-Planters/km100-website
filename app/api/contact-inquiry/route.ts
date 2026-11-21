import { NextResponse } from "next/server";
import { sendContactInquiryEmail } from "@/lib/email";
import { contactInquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactInquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Email is best effort: a delivery failure must not lose the submission.
  await sendContactInquiryEmail(parsed.data);

  return NextResponse.json({ ok: true }, { status: 200 });
}
