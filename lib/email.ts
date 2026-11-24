import nodemailer from "nodemailer";

import { getProgramBySlug } from "@/lib/programs";
import { siteConfig } from "@/lib/site-config";
import type {
  ContactInquiryInput,
  PreRegistrationInput,
} from "@/lib/validation";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure =
  (process.env.SMTP_SECURE ?? "").toLowerCase() === "true" || smtpPort === 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const from =
  process.env.EMAIL_FROM ??
  (smtpUser
    ? `KM100 Website <${smtpUser}>`
    : "KM100 Website <no-reply@localhost>");

const schoolEmail =
  process.env.SCHOOL_NOTIFICATION_EMAIL ??
  "km100skillsandtrainingcenter@gmail.com";

/** True when SMTP_HOST, SMTP_USER and SMTP_PASS are all present. */
export const emailConfigured = Boolean(smtpHost && smtpUser && smtpPass);

type MailTransport = ReturnType<typeof nodemailer.createTransport>;
type MailMessage = Parameters<MailTransport["sendMail"]>[0];

let transport: MailTransport | null = null;

function getTransport(): MailTransport | null {
  if (!emailConfigured) return null;

  transport ??= nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser as string, pass: smtpPass as string },
  });

  return transport;
}

/** Sends one message. Failures are logged, never thrown to the caller. */
async function sendMail(message: MailMessage): Promise<boolean> {
  const mailer = getTransport();

  if (!mailer) {
    console.warn(
      "[email] SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS) — message skipped."
    );
    return false;
  }

  try {
    await mailer.sendMail(message);
    return true;
  } catch (error) {
    console.error("[email] send failed", error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function present(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

type PreRegistrationEmail = PreRegistrationInput & {
  referenceNumber: string;
};

type DetailRow = { label: string; value: string };

function applicantDetails(
  submission: PreRegistrationEmail
): DetailRow[] {
  const fullName =
    [
      present(submission.firstName),
      present(submission.middleName),
      present(submission.lastName),
      present(submission.suffix),
    ]
      .filter(Boolean)
      .join(" ") || "—";

  const address =
    [
      present(submission.address),
      present(submission.sitio),
      present(submission.barangay),
      present(submission.district),
      present(submission.municipality),
      present(submission.province),
      present(submission.region),
    ]
      .filter(Boolean)
      .join(", ") || "—";

  const education =
    submission.isCurrentlyEnrolled === "YES"
      ? [
          present(submission.currentSchool)
            ? `Currently enrolled at ${present(submission.currentSchool)}`
            : "Currently enrolled",
          present(submission.currentGradeLevel),
          present(submission.currentProgram),
        ]
          .filter(Boolean)
          .join(" · ")
      : present(submission.highestAttainment)
        ? `Highest attainment: ${present(submission.highestAttainment)}`
        : "—";

  return [
    { label: "Reference number", value: submission.referenceNumber },
    { label: "Program", value: getProgramBySlug(submission.program)?.name ?? submission.program },
    { label: "Full name", value: fullName },
    { label: "Email address", value: submission.email },
    { label: "Mobile number", value: submission.mobile },
    { label: "Civil status", value: submission.civilStatus },
    { label: "Complete address", value: address },
    { label: "Educational background", value: education },
  ];
}

export async function sendPreRegistrationEmails(
  submission: PreRegistrationEmail
): Promise<boolean> {
  const programName =
    getProgramBySlug(submission.program)?.name ?? submission.program;
  const rows = applicantDetails(submission);
  const { phone, email: contactEmail, address } = siteConfig.contact;

  const text = [
    `Hello ${submission.firstName},`,
    "",
    `Thank you for pre-registering with ${siteConfig.name}. We received your submission and it is now on file.`,
    "",
    "Your reference number",
    submission.referenceNumber,
    "",
    "The details you provided",
    ...rows.map((row) => `${row.label}: ${row.value}`),
    "",
    "Please keep your reference number — quote it whenever you contact our admissions office.",
    "This is pre-registration only, not official enrollment. Our team will reach out to guide you through the next steps.",
    "",
    `If anything above looks wrong, reply to this email or call us at ${phone}.`,
    "",
    siteConfig.name,
    address,
    `${phone} · ${contactEmail}`,
  ].join("\n");

  const tableRows = rows
    .map(
      (row, index) => `
          <tr>
            <td style="padding:8px 0;color:#6b6b6b;vertical-align:top;${
              index === 0 ? "" : "border-top:1px solid #eceae5;"
            }">${escapeHtml(row.label)}</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;${
              index === 0 ? "" : "border-top:1px solid #eceae5;"
            }">${escapeHtml(row.value)}</td>
          </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#252525;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:4px solid #f47721;">
      <div style="padding:32px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f47721;font-weight:600;">KM100 Skills and Training Center, Inc.</p>
        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">We received your pre-registration</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Hello ${escapeHtml(
          submission.firstName
        )},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Thank you for pre-registering for <strong>${escapeHtml(
          programName
        )}</strong>. Your submission is now on file.</p>
        <div style="margin:24px 0;padding:16px 20px;background:#fff6ef;border-radius:10px;border:1px solid #f6d8bf;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a5a2b;">Your reference number</p>
          <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.04em;">${escapeHtml(
            submission.referenceNumber
          )}</p>
        </div>
        <h2 style="margin:0 0 8px;font-size:16px;">The details you provided</h2>
        <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px;">${tableRows}
        </table>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Please keep your reference number — quote it whenever you contact our admissions office.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;"><strong>This is pre-registration only, not official enrollment.</strong> Our team will reach out to guide you through the next steps.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">If anything above looks wrong, reply to this email or call us at <a href="${
          siteConfig.contact.phoneHref
        }" style="color:#252525;">${escapeHtml(phone)}</a>.</p>
      </div>
      <div style="padding:20px 32px;background:#252525;color:#ffffff;font-size:12px;line-height:1.6;">
        <p style="margin:0 0 4px;font-weight:600;">${escapeHtml(siteConfig.name)}</p>
        <p style="margin:0 0 4px;color:#c9c9c9;">${escapeHtml(address)}</p>
        <p style="margin:0;color:#c9c9c9;">${escapeHtml(phone)} · ${escapeHtml(
          contactEmail
        )}</p>
      </div>
    </div>
  </body>
</html>`;

  const results = await Promise.all([
    sendMail({
      from,
      to: submission.email,
      subject: `Your KM100 pre-registration (${submission.referenceNumber})`,
      text,
      html,
    }),
    sendMail({
      from,
      to: schoolEmail,
      subject: `New pre-registration: ${submission.firstName} ${submission.lastName}`,
      text: [
        `Reference: ${submission.referenceNumber}`,
        ...rows.map((row) => `${row.label}: ${row.value}`),
        "",
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
      replyTo: submission.email,
    }),
  ]);

  if (results.some((sent) => !sent)) {
    console.error("[email] one or more pre-registration notifications failed");
  }

  return results[0];
}

export async function sendContactInquiryEmail(submission: ContactInquiryInput) {
  const results = await Promise.all([
    sendMail({
      from,
      to: submission.email,
      subject: "We received your message — KM100 Skills and Training Center",
      text: `Hello ${submission.name},\n\nThank you for reaching out to KM100 Skills and Training Center, Inc. We have received your inquiry regarding "${submission.subject}" and will get back to you as soon as possible.\n\nHere's a copy of your message:\n${submission.message}\n\n— KM100 Team`,
    }),
    sendMail({
      from,
      to: schoolEmail,
      subject: `New contact inquiry: ${submission.subject}`,
      text: `Name: ${submission.name}\nEmail: ${submission.email}\nSubject: ${submission.subject}\n\nMessage:\n${submission.message}`,
    }),
  ]);

  if (results.some((sent) => !sent)) {
    console.error("[email] one or more contact notifications failed");
  }
}

export type ApplicationConfirmedEmail = {
  firstName: string;
  lastName: string;
  email: string;
  referenceNumber: string;
  program: string;
};

/**
 * Sent when an admin moves an application to ENROLLED in the dashboard.
 * Returns whether SMTP accepted the message.
 */
export async function sendApplicationConfirmedEmail(
  applicant: ApplicationConfirmedEmail
): Promise<boolean> {
  const programName =
    getProgramBySlug(applicant.program)?.name ?? applicant.program;
  const fullName = `${applicant.firstName} ${applicant.lastName}`.trim();
  const { phone, email: contactEmail, address } = siteConfig.contact;

  const text = [
    `Hello ${applicant.firstName},`,
    "",
    `Your application to ${siteConfig.name} has been confirmed, and you are now marked as enrolled.`,
    "",
    `Reference number: ${applicant.referenceNumber}`,
    `Applicant: ${fullName}`,
    `Program: ${programName}`,
    "",
    "What happens next",
    `Our admissions office will contact you at this email address or on the mobile number you registered with to walk you through enrollment — the schedule, the documentary requirements and the fees.`,
    "",
    `If anything here looks wrong, reply to this email or call us at ${phone}.`,
    "",
    siteConfig.name,
    address,
    `${phone} · ${contactEmail}`,
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#252525;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:4px solid #f47721;">
      <div style="padding:32px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f47721;font-weight:600;">KM100 Skills and Training Center, Inc.</p>
        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">Your application is confirmed</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Hello ${escapeHtml(
          applicant.firstName
        )},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Your application to KM100 has been confirmed, and you are now marked as <strong>enrolled</strong>.</p>
        <table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#6b6b6b;">Reference number</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;">${escapeHtml(
              applicant.referenceNumber
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b6b6b;border-top:1px solid #eceae5;">Applicant</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;border-top:1px solid #eceae5;">${escapeHtml(
              fullName
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b6b6b;border-top:1px solid #eceae5;">Program</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;border-top:1px solid #eceae5;">${escapeHtml(
              programName
            )}</td>
          </tr>
        </table>
        <h2 style="margin:24px 0 8px;font-size:16px;">What happens next</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Our admissions office will contact you at this email address or on the mobile number you registered with to walk you through enrollment — the schedule, the documentary requirements and the fees.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">If anything here looks wrong, reply to this email or call us at <a href="${
          siteConfig.contact.phoneHref
        }" style="color:#252525;">${escapeHtml(phone)}</a>.</p>
      </div>
      <div style="padding:20px 32px;background:#252525;color:#ffffff;font-size:12px;line-height:1.6;">
        <p style="margin:0 0 4px;font-weight:600;">${escapeHtml(siteConfig.name)}</p>
        <p style="margin:0 0 4px;color:#c9c9c9;">${escapeHtml(address)}</p>
        <p style="margin:0;color:#c9c9c9;">${escapeHtml(phone)} · ${escapeHtml(
          contactEmail
        )}</p>
      </div>
    </div>
  </body>
</html>`;

  return sendMail({
    from,
    to: applicant.email,
    subject: `Your KM100 application is confirmed (${applicant.referenceNumber})`,
    text,
    html,
  });
}
