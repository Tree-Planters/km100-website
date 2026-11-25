import type { ProgramSlug } from "@/lib/programs";
import { getProgramBySlug, programs } from "@/lib/programs";
import type { PreRegistrationInput } from "@/lib/validation";

/**
 * Data contract for the TESDA DPA Form 1 PDF (`assets/tesda-dpa-form-1.pdf`).
 *
 * Keys match the boxes the PDF filler (`lib/tesda-pdf.ts`) writes into.
 * Anything missing stays an empty box, exactly like the blank paper form.
 */
export type TesdaFormData = {
  referenceNumber?: string;
  uli?: string;
  entryDate?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  extension?: string;
  street?: string;
  barangay?: string;
  district?: string;
  city?: string;
  province?: string;
  region?: string;
  emailAccount?: string;
  contactNo?: string;
  nationality?: string;
  sex?: string;
  civilStatus?: string;
  employmentStatus?: string;
  employmentType?: string;
  birthMonth?: string;
  birthDay?: string;
  birthYear?: string;
  age?: string;
  birthCity?: string;
  birthProvince?: string;
  birthRegion?: string;
  educationalAttainment?: string;
  parentName?: string;
  parentAddress?: string;
  classification?: string[];
  classificationOthers?: string;
  course?: string;
  scholarship?: string;
  consentAgree?: string;
};

/** A submission row, a draft, or the reactive form state all fit here. */
type TesdaFormSource = Record<string, any>;

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** `mm/dd/yyyy`, matching the paper's Entry Date box. */
export function formatEntryDate(date = new Date()): string {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

/** Whole years between the birth date and `at`, or "" when incomplete. */
export function ageFromBirthDate(
  month: unknown,
  day: unknown,
  year: unknown,
  at = new Date()
): string {
  const m = Number(month);
  const d = Number(day);
  const y = Number(year);

  if (!Number.isFinite(m) || !Number.isFinite(d) || !Number.isFinite(y)) return "";
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return "";

  const birth = new Date(y, m - 1, d);
  if (
    birth.getFullYear() !== y ||
    birth.getMonth() !== m - 1 ||
    birth.getDate() !== d
  ) {
    return "";
  }

  let age = at.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    at.getMonth() < birth.getMonth() ||
    (at.getMonth() === birth.getMonth() && at.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;

  return age >= 0 && age <= 130 ? String(age) : "";
}

function programLabel(value: unknown): string {
  const raw = text(value);
  if (!raw) return "";
  const bySlug = getProgramBySlug(raw as ProgramSlug);
  if (bySlug) return bySlug.name;
  const byName = programs.find((program) => program.name === raw);
  return byName ? byName.name : raw;
}

function classificationList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => text(entry)).filter(Boolean);
  }
  const single = text(value);
  return single ? [single] : [];
}

/**
 * Maps a stored pre-registration (or a live form draft) onto the A4 document.
 * Signature, ID picture, 1x1 picture and thumbmark are deliberately absent.
 */
export function buildTesdaFormData(
  source: TesdaFormSource,
  options: { referenceNumber?: string; entryDate?: string } = {}
): TesdaFormData {
  const createdAt =
    source.createdAt instanceof Date
      ? source.createdAt
      : typeof source.createdAt === "string" && source.createdAt
        ? new Date(source.createdAt)
        : null;

  const entryDate =
    options.entryDate ||
    (createdAt && !Number.isNaN(createdAt.getTime())
      ? formatEntryDate(createdAt)
      : formatEntryDate());

  return {
    referenceNumber: text(options.referenceNumber ?? source.referenceNumber),
    uli: text(source.uli),
    entryDate,
    lastName: text(source.lastName),
    firstName: text(source.firstName),
    middleName: text(source.middleName),
    extension: text(source.extension ?? source.suffix),
    street: text(source.street ?? source.address ?? source.sitio),
    barangay: text(source.barangay),
    district: text(source.district),
    city: text(source.city ?? source.municipality),
    province: text(source.province),
    region: text(source.region),
    emailAccount: text(source.emailAccount ?? source.email),
    contactNo: text(source.contactNo ?? source.mobile),
    nationality: text(source.nationality),
    sex: text(source.sex),
    civilStatus: text(source.civilStatus),
    employmentStatus: text(source.employmentStatus),
    employmentType: text(source.employmentType),
    birthMonth: text(source.birthMonth),
    birthDay: text(source.birthDay),
    birthYear: text(source.birthYear),
    age:
      text(source.age) ||
      ageFromBirthDate(source.birthMonth, source.birthDay, source.birthYear),
    birthCity: text(source.birthCity),
    birthProvince: text(source.birthProvince),
    birthRegion: text(source.birthRegion),
    educationalAttainment: text(
      source.educationalAttainment ?? source.highestAttainment
    ),
    parentName: text(source.parentName),
    parentAddress: text(source.parentAddress),
    classification: classificationList(source.classification),
    classificationOthers: text(source.classificationOthers),
    course: programLabel(source.program),
    scholarship: text(source.scholarshipPackage ?? source.scholarship),
    consentAgree: source.consent === true ? "Agree" : "",
  };
}

/** Filled PDF for a stored submission (served by the applications API). */
export function tesdaPdfPath(referenceNumber: string): string {
  return `/api/applications/${encodeURIComponent(referenceNumber)}/form`;
}

/** The §3.6 answer implies whether the applicant is currently studying. */
export function isCurrentlyEnrolledFromAttainment(attainment: string): "YES" | "NO" {
  return /undergraduate/i.test(attainment) ? "YES" : "NO";
}

/** Payload shape the pre-registration API stores (kept in sync with validation). */
export type StoredPreRegistration = PreRegistrationInput;
