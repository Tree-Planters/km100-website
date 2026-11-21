import { Resend } from "resend";
import type {
  ContactInquiryInput,
  PreRegistrationInput,
} from "@/lib/validation";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const from = process.env.EMAIL_FROM ?? "KM100 Website <onboarding@resend.dev>";
const schoolEmail =
  process.env.SCHOOL_NOTIFICATION_EMAIL ?? "km100skillsandtrainingcenter@gmail.com";

type PreRegistrationEmail = PreRegistrationInput & {
  referenceNumber: string;
};

export async function sendPreRegistrationEmails(
  submission: PreRegistrationEmail,
) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is not set — notifications skipped.");
    return;
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: submission.email,
      subject: `KM100 pre-registration received (${submission.referenceNumber})`,
      text: `Hello ${submission.firstName},\n\nWe received your pre-registration for ${submission.program}.\nYour reference number is ${submission.referenceNumber}.\n\nThis is pre-registration only, not official enrollment.`,
    }),
    resend.emails.send({
      from,
      to: schoolEmail,
      subject: `New pre-registration: ${submission.firstName} ${submission.lastName}`,
      text: `Reference: ${submission.referenceNumber}\nProgram: ${submission.program}\nEmail: ${submission.email}\nMobile: ${submission.mobile}`,
    }),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[email] notification failed", result.reason);
    }
  }
}

export async function sendContactInquiryEmail(submission: ContactInquiryInput) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is not set — contact notification skipped.");
    return;
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: submission.email,
      subject: "We received your message — KM100 Skills and Training Center",
      text: `Hello ${submission.name},\n\nThank you for reaching out to KM100 Skills and Training Center, Inc. We have received your inquiry regarding "${submission.subject}" and will get back to you as soon as possible.\n\nHere's a copy of your message:\n${submission.message}\n\n— KM100 Team`,
    }),
    resend.emails.send({
      from,
      to: schoolEmail,
      subject: `New contact inquiry: ${submission.subject}`,
      text: `Name: ${submission.name}\nEmail: ${submission.email}\nSubject: ${submission.subject}\n\nMessage:\n${submission.message}`,
    }),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[email] contact notification failed", result.reason);
    }
  }
}
