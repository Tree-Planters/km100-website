import nodemailer from "nodemailer";

import { getProgramBySlug } from "@/lib/programs";
import { siteConfig } from "@/lib/site-config";
import { buildTesdaFormData } from "@/lib/tesda-form";
import { buildTesdaPdf } from "@/lib/tesda-pdf";
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

  const educationalAttainment =
    present(submission.educationalAttainment) ??
    present(submission.highestAttainment) ??
    (submission.isCurrentlyEnrolled === "YES"
      ? present(submission.currentSchool)
        ? `Currently enrolled at ${present(submission.currentSchool)}`
        : "Currently enrolled"
      : undefined);

  const birthdate =
    submission.birthMonth && submission.birthDay && submission.birthYear
      ? `${submission.birthMonth}/${submission.birthDay}/${submission.birthYear}`
      : undefined;

  const birthplace =
    [
      present(submission.birthCity),
      present(submission.birthProvince),
      present(submission.birthRegion),
    ]
      .filter(Boolean)
      .join(", ") || undefined;

  const classification =
    [
      ...(submission.classification || []),
      present(submission.classificationOthers)
        ? `Others: ${present(submission.classificationOthers)}`
        : undefined,
    ]
      .filter(Boolean)
      .join("; ") || undefined;

  const rows: { label: string; value: string | undefined }[] = [
    { label: "Reference number", value: submission.referenceNumber },
    { label: "Program", value: getProgramBySlug(submission.program)?.name ?? submission.program },
    { label: "Full name", value: fullName },
    { label: "Email address", value: submission.email },
    { label: "Mobile number", value: submission.mobile },
    { label: "Sex", value: present(submission.sex) },
    { label: "Civil status", value: submission.civilStatus },
    { label: "Nationality", value: present(submission.nationality) },
    { label: "Birthdate", value: birthdate },
    {
      label: "Age",
      value: submission.age != null ? String(submission.age) : undefined,
    },
    { label: "Birthplace", value: birthplace },
    {
      label: "Employment status",
      value: present(submission.employmentStatus),
    },
    {
      label: "Employment type",
      value: present(submission.employmentType),
    },
    { label: "Complete address", value: address },
    { label: "Educational attainment", value: educationalAttainment },
    { label: "Classification", value: classification },
    { label: "Parent/Guardian", value: present(submission.parentName) },
    {
      label: "Parent/Guardian address",
      value: present(submission.parentAddress),
    },
    {
      label: "Scholarship package",
      value: present(submission.scholarshipPackage),
    },
  ];

  return rows.filter((row): row is DetailRow => Boolean(row.value));
}

export async function sendPreRegistrationEmails(
  submission: PreRegistrationEmail
): Promise<boolean> {
  const programName =
    getProgramBySlug(submission.program)?.name ?? submission.program;
  const rows = applicantDetails(submission);
  const { phone, email: contactEmail, address } = siteConfig.contact;

  const formFileName = `KM100-Pre-Registration-${submission.referenceNumber}.pdf`;
  let formAttachment: { filename: string; content: Buffer } | null = null;

  try {
    const pdf = await buildTesdaPdf(
      buildTesdaFormData(submission, {
        referenceNumber: submission.referenceNumber,
      })
    );
    formAttachment = { filename: formFileName, content: Buffer.from(pdf) };
  } catch (error) {
    console.error("[email] could not build the pre-registration form PDF", error);
  }

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
    formAttachment
      ? `Your Pre-Registration Form is attached to this email as ${formFileName}. Print it on A4 back to back, attach your 1x1 picture and sign it.`
      : "You can download your Pre-Registration Form from the confirmation page.",
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
                <td width="42%" style="width:42%;padding:8px 10px 8px 0;color:#6b6b6b;vertical-align:top;word-break:break-word;overflow-wrap:anywhere;font-size:13px;line-height:1.45;${
                  index === 0 ? "" : "border-top:1px solid #eceae5;"
                }">${escapeHtml(row.label)}</td>
                <td style="padding:8px 0;text-align:right;font-weight:600;word-break:break-word;overflow-wrap:anywhere;font-size:13px;line-height:1.45;${
                  index === 0 ? "" : "border-top:1px solid #eceae5;"
                }">${escapeHtml(row.value)}</td>
              </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>We received your pre-registration</title>
    <style>
      @media only screen and (max-width: 600px) {
        .km-pad { padding: 22px 18px !important; }
        .km-h1 { font-size: 20px !important; }
        .km-ref { font-size: 17px !important; letter-spacing: 0.02em !important; }
        .km-foot { padding: 18px !important; }
        .km-copy { font-size: 14px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#252525;-webkit-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#f5f3ef;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;border-collapse:collapse;background:#ffffff;border-radius:12px;border-top:4px solid #f47721;">
            <tr>
              <td class="km-pad" style="padding:30px 28px;">
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#f47721;font-weight:600;line-height:1.5;">KM100 Skills and Training Center, Inc.</p>
                <h1 class="km-h1" style="margin:0 0 18px;font-size:23px;line-height:1.3;">We received your pre-registration</h1>
                <p class="km-copy" style="margin:0 0 14px;font-size:15px;line-height:1.6;">Hello ${escapeHtml(
                  submission.firstName
                )},</p>
                <p class="km-copy" style="margin:0 0 14px;font-size:15px;line-height:1.6;">Thank you for pre-registering for <strong>${escapeHtml(
                  programName
                )}</strong>. Your submission is now on file.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:20px 0;background:#fff6ef;border:1px solid #f6d8bf;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a5a2b;line-height:1.5;">Your reference number</p>
                      <p class="km-ref" style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.03em;line-height:1.3;word-break:break-word;">${escapeHtml(
                        submission.referenceNumber
                      )}</p>
                    </td>
                  </tr>
                </table>
                ${formAttachment
                  ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:0 0 20px;background:#f6faf7;border:1px solid #cfe6d7;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#2f6b46;line-height:1.5;">Your form is attached</p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#252525;"><strong style="word-break:break-word;">${escapeHtml(
                        formFileName
                      )}</strong> is attached to this email. Print it on A4 <strong>back to back</strong> — both pages on one sheet — then attach your 1×1 picture and sign it.</p>
                    </td>
                  </tr>
                </table>`
                  : ""}
                <h2 style="margin:0 0 6px;font-size:15px;">The details you provided</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;margin:0 0 20px;font-size:13px;">${tableRows}
                </table>
                <p class="km-copy" style="margin:0 0 14px;font-size:15px;line-height:1.6;">Please keep your reference number — quote it whenever you contact our admissions office.</p>
                <p class="km-copy" style="margin:0 0 14px;font-size:15px;line-height:1.6;"><strong>This is pre-registration only, not official enrollment.</strong> Our team will reach out to guide you through the next steps.</p>
                <p class="km-copy" style="margin:0;font-size:15px;line-height:1.6;">If anything above looks wrong, reply to this email or call us at <a href="${
                  siteConfig.contact.phoneHref
                }" style="color:#252525;">${escapeHtml(phone)}</a>.</p>
              </td>
            </tr>
            <tr>
              <td class="km-foot" style="padding:18px 28px;background:#252525;color:#ffffff;font-size:12px;line-height:1.6;">
                <p style="margin:0 0 4px;font-weight:600;">${escapeHtml(siteConfig.name)}</p>
                <p style="margin:0 0 4px;color:#c9c9c9;">${escapeHtml(address)}</p>
                <p style="margin:0;color:#c9c9c9;">${escapeHtml(phone)} · ${escapeHtml(
                  contactEmail
                )}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const results = await Promise.all([
    sendMail({
      from,
      to: submission.email,
      subject: `Your KM100 pre-registration (${submission.referenceNumber})`,
      text,
      html,
      ...(formAttachment ? { attachments: [formAttachment] } : {}),
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
