import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type { TesdaFormData } from "@/lib/tesda-form";

/**
 * Fills the real TESDA "DPA Form 1 / MIS 03-01 (ver. 2021)" PDF.
 *
 * The template is a scan with an OCR text layer and no AcroForm fields, so
 * answers are drawn onto the page at the positions of the printed boxes
 * (coordinates measured from the template, in millimetres from the top-left).
 */

const MM = 72 / 25.4;
const TEMPLATE_PATH = path.join(process.cwd(), "assets", "tesda-dpa-form-1-latest.pdf");

type Rect = { x: number; y: number; w: number; h: number };

type TextField = {
  key: keyof TesdaFormData;
  page: 0 | 1;
  rect: Rect;
  align?: "center" | "left";
  valign?: "middle" | "top";
  size?: number;
  /** mm of printed caption at the bottom of the box that must stay free. */
  captionInset?: number;
  maxLines?: number;
  /** keep the value exactly as typed (e.g. an e-mail address) */
  preserveCase?: boolean;
  /** paint white over the printed placeholder before writing */
  clear?: boolean;
};

/** Box positions on page 1 (Learner/Manpower Profile + Personal Information). */
const PAGE_1_FIELDS: TextField[] = [
  { key: "entryDate", page: 0, rect: { x: 164.0, y: 67.82, w: 38.52, h: 6.01 }, size: 9, clear: true },
  { key: "lastName", page: 0, rect: { x: 44.11, y: 83.74, w: 64.69, h: 10.16 } },
  { key: "firstName", page: 0, rect: { x: 111.59, y: 83.57, w: 59.86, h: 10.16 } },
  { key: "middleName", page: 0, rect: { x: 173.31, y: 83.48, w: 30.4, h: 6.01 } },
  { key: "street", page: 0, rect: { x: 44.2, y: 94.23, w: 64.69, h: 17.53 }, align: "left", valign: "top", maxLines: 3, size: 8 },
  { key: "barangay", page: 0, rect: { x: 111.76, y: 93.98, w: 59.77, h: 17.53 }, align: "left", valign: "top", maxLines: 3, size: 8 },
  { key: "district", page: 0, rect: { x: 173.4, y: 93.9, w: 30.4, h: 17.53 }, align: "left", valign: "top", maxLines: 3, size: 8 },
  { key: "city", page: 0, rect: { x: 44.2, y: 116.08, w: 64.69, h: 6.43 } },
  { key: "province", page: 0, rect: { x: 111.76, y: 115.91, w: 59.86, h: 6.43 } },
  { key: "region", page: 0, rect: { x: 173.4, y: 115.82, w: 30.48, h: 6.52 } },
  { key: "emailAccount", page: 0, rect: { x: 44.28, y: 126.49, w: 64.69, h: 6.27 }, size: 8, preserveCase: true },
  { key: "contactNo", page: 0, rect: { x: 111.84, y: 126.32, w: 59.77, h: 10.58 } },
  { key: "nationality", page: 0, rect: { x: 173.48, y: 126.24, w: 30.4, h: 10.67 } },
  { key: "birthMonth", page: 0, rect: { x: 39.79, y: 185.25, w: 42.08, h: 6.69 } },
  { key: "birthDay", page: 0, rect: { x: 87.21, y: 185.17, w: 37.08, h: 6.69 } },
  { key: "birthYear", page: 0, rect: { x: 129.62, y: 185.08, w: 37.08, h: 6.69 } },
  { key: "age", page: 0, rect: { x: 172.04, y: 185.08, w: 31.92, h: 6.69 } },
  { key: "birthCity", page: 0, rect: { x: 39.88, y: 200.74, w: 63.58, h: 6.6 } },
  { key: "birthProvince", page: 0, rect: { x: 107.53, y: 200.66, w: 55.71, h: 6.52 } },
  { key: "birthRegion", page: 0, rect: { x: 166.88, y: 200.66, w: 37.25, h: 6.52 } },
  { key: "parentName", page: 0, rect: { x: 47.5, y: 256.03, w: 64.43, h: 9.82 }, align: "left", maxLines: 2, size: 8 },
  { key: "parentAddress", page: 0, rect: { x: 112.35, y: 255.95, w: 91.95, h: 9.82 }, align: "left", maxLines: 2, size: 7.5 },
];

/** Box positions on page 2 (course, scholarship, "Others" line). */
const PAGE_2_FIELDS: TextField[] = [
  { key: "course", page: 1, rect: { x: 12.0, y: 111.25, w: 192.0, h: 7.54 }, align: "left", valign: "middle", size: 10, maxLines: 1 },
  { key: "scholarship", page: 1, rect: { x: 12.0, y: 124.54, w: 192.0, h: 7.7 }, align: "left", valign: "middle", size: 9.5, maxLines: 1 },
  { key: "classificationOthers", page: 1, rect: { x: 157.5, y: 61.3, w: 38.0, h: 3.9 }, align: "left", valign: "middle", size: 7, maxLines: 1 },
];

const TEXT_FIELDS = [...PAGE_1_FIELDS, ...PAGE_2_FIELDS];

type Tick = { page: 0 | 1; key: keyof TesdaFormData; value: string; cx: number; cy: number };

/** Checkbox centres, measured from the template. §5/§6 stay blank by design. */
const TICKS: Tick[] = [
  { page: 0, key: "sex", value: "Male", cx: 17.65, cy: 157.72 },
  { page: 0, key: "sex", value: "Female", cx: 17.7, cy: 161.85 },
  { page: 0, key: "civilStatus", value: "Single", cx: 50.63, cy: 157.67 },
  { page: 0, key: "civilStatus", value: "Married", cx: 50.67, cy: 161.8 },
  { page: 0, key: "civilStatus", value: "Separated/Divorced/Annulled", cx: 50.67, cy: 165.92 },
  { page: 0, key: "civilStatus", value: "Widow/er", cx: 50.72, cy: 169.98 },
  { page: 0, key: "civilStatus", value: "Common Law/Live-in", cx: 50.72, cy: 174.1 },
  { page: 0, key: "employmentStatus", value: "Wage-Employed", cx: 100.25, cy: 161.67 },
  { page: 0, key: "employmentStatus", value: "Underemployed", cx: 100.25, cy: 165.85 },
  { page: 0, key: "employmentStatus", value: "Self-Employed", cx: 100.25, cy: 178.1 },
  { page: 0, key: "employmentStatus", value: "Unemployed", cx: 100.25, cy: 181.79 },
  { page: 0, key: "employmentType", value: "None", cx: 145.03, cy: 161.6 },
  { page: 0, key: "employmentType", value: "Regular", cx: 169.93, cy: 161.6 },
  { page: 0, key: "employmentType", value: "Casual", cx: 145.03, cy: 165.8 },
  { page: 0, key: "employmentType", value: "Job Order", cx: 169.93, cy: 165.8 },
  { page: 0, key: "employmentType", value: "Probationary", cx: 145.03, cy: 169.85 },
  { page: 0, key: "employmentType", value: "Permanent", cx: 169.93, cy: 169.85 },
  { page: 0, key: "employmentType", value: "Contractual", cx: 145.03, cy: 173.98 },
  { page: 0, key: "employmentType", value: "Temporary", cx: 169.93, cy: 173.98 },
  { page: 0, key: "educationalAttainment", value: "No Grade Completed", cx: 15.32, cy: 222.53 },
  { page: 0, key: "educationalAttainment", value: "Elementary Undergraduate", cx: 15.32, cy: 229.39 },
  { page: 0, key: "educationalAttainment", value: "Elementary Graduate", cx: 15.32, cy: 234.66 },
  { page: 0, key: "educationalAttainment", value: "High School Undergraduate", cx: 15.41, cy: 241.57 },
  { page: 0, key: "educationalAttainment", value: "High School Graduate", cx: 15.41, cy: 248.49 },
  { page: 0, key: "educationalAttainment", value: "Junior High (K-12)", cx: 67.78, cy: 222.41 },
  { page: 0, key: "educationalAttainment", value: "Senior High (K-12)", cx: 67.78, cy: 229.27 },
  { page: 0, key: "educationalAttainment", value: "Post-Secondary Non-Tertiary/Technical Vocational Course Undergraduate", cx: 67.78, cy: 234.52 },
  { page: 0, key: "educationalAttainment", value: "Post-Secondary Non-Tertiary/Technical Vocational Course Graduate", cx: 67.78, cy: 241.45 },
  { page: 0, key: "educationalAttainment", value: "College Undergraduate", cx: 145.16, cy: 222.34 },
  { page: 0, key: "educationalAttainment", value: "College Graduate", cx: 145.2, cy: 229.2 },
  { page: 0, key: "educationalAttainment", value: "Masteral", cx: 145.16, cy: 234.52 },
  { page: 0, key: "educationalAttainment", value: "Doctorate", cx: 145.2, cy: 241.45 },
  { page: 1, key: "classification", value: "4Ps Beneficiary", cx: 14.52, cy: 17.35 },
  { page: 1, key: "classification", value: "Displaced Workers", cx: 14.52, cy: 24.17 },
  { page: 1, key: "classification", value: "Family Members of AFP and PNP Wounded-in-Action", cx: 14.52, cy: 30.34 },
  { page: 1, key: "classification", value: "Industry Workers", cx: 14.52, cy: 38.06 },
  { page: 1, key: "classification", value: "Out-of-School-Youth", cx: 14.52, cy: 44.3 },
  { page: 1, key: "classification", value: "Rebel Returnees/Decommissioned Combatants", cx: 14.52, cy: 50.17 },
  { page: 1, key: "classification", value: "TESDA Alumni", cx: 14.52, cy: 58.19 },
  { page: 1, key: "classification", value: "Victim of Natural Disasters and Calamities", cx: 14.52, cy: 65.06 },
  { page: 1, key: "classification", value: "Agrarian Reform Beneficiary", cx: 77.13, cy: 17.28 },
  { page: 1, key: "classification", value: "Drug Dependents/Surrenderees/Surrenderers", cx: 77.13, cy: 22.45 },
  { page: 1, key: "classification", value: "Farmers and Fishermen", cx: 77.13, cy: 31.92 },
  { page: 1, key: "classification", value: "Inmates and Detainees", cx: 77.13, cy: 37.99 },
  { page: 1, key: "classification", value: "Overseas Filipino Workers (OFW) Dependent", cx: 77.13, cy: 42.6 },
  { page: 1, key: "classification", value: "Returning/Repatriated Overseas Filipino Workers (OFW)", cx: 77.13, cy: 50.1 },
  { page: 1, key: "classification", value: "TVET Trainers", cx: 77.13, cy: 58.19 },
  { page: 1, key: "classification", value: "Wounded-in-Action AFP & PNP Personnel", cx: 77.13, cy: 65.01 },
  { page: 1, key: "classification", value: "Balik Probinsya", cx: 141.86, cy: 17.35 },
  { page: 1, key: "classification", value: "Family Members of AFP and PNP Killed-in-Action", cx: 141.86, cy: 22.45 },
  { page: 1, key: "classification", value: "Indigenous People & Cultural Communities", cx: 141.86, cy: 31.92 },
  { page: 1, key: "classification", value: "MILF Beneficiary", cx: 141.86, cy: 37.99 },
  { page: 1, key: "classification", value: "RCEF-RESP", cx: 141.86, cy: 44.23 },
  { page: 1, key: "classification", value: "Student", cx: 141.86, cy: 51.75 },
  { page: 1, key: "classification", value: "Uniformed Personnel", cx: 141.86, cy: 58.19 },
  { page: 1, key: "classification", value: "Others", cx: 141.86, cy: 63.36 },
  { page: 1, key: "consentAgree", value: "Agree", cx: 74.8, cy: 158.67 },
  { page: 1, key: "consentAgree", value: "Disagree", cx: 112.71, cy: 158.67 },
];

function normalize(value: unknown): string {
  return String(value == null ? "" : value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function same(actual: unknown, expected: string): boolean {
  const a = normalize(actual);
  const b = normalize(expected);
  if (!a || !b) return false;
  if (a === b) return true;
  return a.length >= 6 && b.length >= 6 && (a.indexOf(b) === 0 || b.indexOf(a) === 0);
}

function isChecked(value: unknown, expected: string): boolean {
  if (Array.isArray(value)) return value.some((entry) => same(entry, expected));
  if (typeof value === "boolean") return value && same("Agree", expected);
  return same(value, expected);
}

function textOf(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value).trim();
}

function wrapLines(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length > maxLines) return lines;
  }
  if (current) lines.push(current);
  return lines;
}

function drawField(page: PDFPage, font: PDFFont, field: TextField, value: string) {
  if (!value) return;

  // Filled-in forms are written in block letters, like the printed sample.
  if (!field.preserveCase) value = value.toUpperCase();

  const padX = 1.2 * MM;
  const padY = 0.7 * MM;
  const captionInset = (field.captionInset ?? 0) * MM;
  const boxX = field.rect.x * MM;
  const boxW = field.rect.w * MM;
  const boxTop = page.getHeight() - field.rect.y * MM;
  const usableH = field.rect.h * MM - captionInset - padY * 2;
  const usableW = boxW - padX * 2;
  if (usableH <= 0 || usableW <= 0) return;

  if (field.clear) {
    page.drawRectangle({
      x: boxX + 0.5 * MM,
      y: boxTop - field.rect.h * MM + 0.5 * MM,
      width: boxW - 1 * MM,
      height: field.rect.h * MM - 1 * MM,
      color: rgb(1, 1, 1),
    });
  }

  const maxLines = field.maxLines ?? 1;
  const startSize = field.size ?? 8.5;
  let size = startSize;
  let lines: string[] = [];

  for (; size >= 5; size -= 0.25) {
    lines = wrapLines(value, font, size, usableW, maxLines);
    if (
      lines.length <= maxLines &&
      lines.every((line) => font.widthOfTextAtSize(line, size) <= usableW)
    ) {
      break;
    }
  }

  size = Math.max(size, 5);
  lines = wrapLines(value, font, size, usableW, maxLines).slice(0, maxLines);

  const lineHeight = size * 1.16;
  const blockHeight = lines.length * lineHeight;
  let firstBaseline: number;

  if ((field.valign ?? "middle") === "top") {
    firstBaseline = boxTop - padY - size * 0.9;
  } else {
    firstBaseline =
      boxTop - padY - Math.max(0, (usableH - blockHeight) / 2) - size * 0.85;
  }

  lines.forEach((line, index) => {
    const width = font.widthOfTextAtSize(line, size);
    const x =
      (field.align ?? "center") === "left"
        ? boxX + padX
        : boxX + (boxW - width) / 2;

    page.drawText(line, {
      x,
      y: firstBaseline - index * lineHeight,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function drawTick(page: PDFPage, tick: Tick) {
  const x = tick.cx * MM;
  const y = page.getHeight() - tick.cy * MM;
  const thickness = 1.05;
  const half = 0.82 * MM;
  // The printed square sits a hair right of the measured anchor.
  const cx = x + 0.05 * MM;
  const cy = y - 0.05 * MM;

  // An X inside the box, the way these forms are actually answered by hand.
  page.drawLine({
    start: { x: cx - half, y: cy - half },
    end: { x: cx + half, y: cy + half },
    thickness,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: cx - half, y: cy + half },
    end: { x: cx + half, y: cy - half },
    thickness,
    color: rgb(0, 0, 0),
  });
}

/**
 * Prints the region as its Roman numeral ("Region VII (Central Visayas)" -> "VII"),
 * which is all the paper's narrow region box has room for. NCR/CAR keep their
 * usual initials because they have no Roman numeral.
 */
export function regionRoman(value: string): string {
  const raw = value.trim();
  if (!raw) return "";

  const prefixed = raw.match(/^region\s+([IVXLC]+(?:-[A-Z])?)\b/i);
  if (prefixed) return prefixed[1].toUpperCase();

  if (/^[IVXLC]+(?:-[A-Z])?$/i.test(raw)) return raw.toUpperCase();

  const familiar: [RegExp, string][] = [
    [/national capital region/i, "NCR"],
    [/cordillera administrative region/i, "CAR"],
    [/negros island region/i, "NIR"],
    [/mimaropa/i, "MIMAROPA"],
  ];
  for (const [pattern, label] of familiar) {
    if (pattern.test(raw)) return label;
  }

  const acronym = raw.match(/\(([A-Z]{2,})\)/);
  if (acronym) return acronym[1];

  return raw.replace(/\s+region$/i, "").trim();
}

/** Returns the filled, flattened PDF for one applicant. */
export async function buildTesdaPdf(data: TesdaFormData): Promise<Uint8Array> {
  const template = await readFile(TEMPLATE_PATH);
  const doc = await PDFDocument.load(template, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  const pages = doc.getPages();
  if (pages.length < 2) throw new Error("Template is missing its second page");

  for (const field of TEXT_FIELDS) {
    let value = textOf(data[field.key]);
    if (!value) continue;
    // §2.2 and §3.5 region boxes print the Roman numeral only.
    if (field.key === "region" || field.key === "birthRegion") {
      value = regionRoman(value);
    }
    drawField(pages[field.page], font, field, value);
  }

  for (const tick of TICKS) {
    if (isChecked(data[tick.key], tick.value)) drawTick(pages[tick.page], tick);
  }

  return doc.save();
}

export { TEMPLATE_PATH };
