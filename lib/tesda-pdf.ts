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
const TEMPLATE_PATH = path.join(process.cwd(), "assets", "tesda-dpa-form-1-template.pdf");

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
  {
    key: "entryDate",
    page: 0,
    rect: { x: 159.6, y: 75.6, w: 38.6, h: 6.2 },
    size: 9,
    clear: true,
  },
  { key: "lastName", page: 0, rect: { x: 39.6, y: 91.3, w: 64.9, h: 6.3 }, captionInset: 2.4 },
  { key: "firstName", page: 0, rect: { x: 107.2, y: 91.3, w: 60.1, h: 6.1 }, captionInset: 2.4 },
  { key: "middleName", page: 0, rect: { x: 168.9, y: 91.2, w: 30.6, h: 6.2 }, captionInset: 2.4 },
  {
    key: "street",
    page: 0,
    rect: { x: 39.6, y: 101.9, w: 65.0, h: 17.8 },
    align: "left",
    valign: "top",
    captionInset: 2.8,
    maxLines: 3,
    size: 8,
  },
  {
    key: "barangay",
    page: 0,
    rect: { x: 107.2, y: 101.7, w: 60.1, h: 17.7 },
    align: "left",
    valign: "top",
    captionInset: 2.8,
    maxLines: 3,
    size: 8,
  },
  {
    key: "district",
    page: 0,
    rect: { x: 168.9, y: 101.7, w: 30.6, h: 17.7 },
    align: "left",
    valign: "top",
    captionInset: 2.8,
    maxLines: 3,
    size: 8,
  },
  { key: "city", page: 0, rect: { x: 39.8, y: 123.7, w: 64.9, h: 6.7 }, captionInset: 2.3 },
  { key: "province", page: 0, rect: { x: 107.3, y: 123.6, w: 60.1, h: 6.7 }, captionInset: 2.3 },
  { key: "region", page: 0, rect: { x: 169.0, y: 123.6, w: 30.6, h: 6.6 }, captionInset: 2.3 },
  {
    key: "emailAccount",
    page: 0,
    rect: { x: 39.8, y: 134.1, w: 64.9, h: 6.5 },
    captionInset: 2.3,
    size: 8,
    // E-mail addresses are case sensitive, so they are not block-lettered.
    preserveCase: true,
  },
  { key: "contactNo", page: 0, rect: { x: 107.3, y: 134.1, w: 60.1, h: 6.3 }, captionInset: 2.3 },
  { key: "nationality", page: 0, rect: { x: 169.0, y: 134.0, w: 30.6, h: 6.5 }, captionInset: 2.3 },
  { key: "birthMonth", page: 0, rect: { x: 35.3, y: 192.9, w: 42.2, h: 7.0 }, captionInset: 2.4 },
  { key: "birthDay", page: 0, rect: { x: 82.8, y: 192.9, w: 37.2, h: 6.9 }, captionInset: 2.4 },
  { key: "birthYear", page: 0, rect: { x: 125.2, y: 192.9, w: 37.2, h: 6.7 }, captionInset: 2.4 },
  { key: "age", page: 0, rect: { x: 167.6, y: 192.8, w: 32.1, h: 6.9 }, captionInset: 2.4 },
  { key: "birthCity", page: 0, rect: { x: 35.4, y: 208.5, w: 63.8, h: 6.7 }, captionInset: 2.4 },
  {
    key: "birthProvince",
    page: 0,
    rect: { x: 103.1, y: 208.4, w: 55.9, h: 6.7 },
    captionInset: 2.4,
  },
  { key: "birthRegion", page: 0, rect: { x: 162.4, y: 208.4, w: 37.5, h: 6.7 }, captionInset: 2.4 },
  {
    key: "parentName",
    page: 0,
    rect: { x: 43.1, y: 263.8, w: 64.6, h: 10.0 },
    align: "left",
    captionInset: 2.6,
    maxLines: 2,
    size: 8,
  },
  {
    key: "parentAddress",
    page: 0,
    rect: { x: 108.0, y: 263.8, w: 92.1, h: 9.9 },
    align: "left",
    captionInset: 2.6,
    maxLines: 2,
    size: 7.5,
  },
];

/** Box positions on page 2 (course, scholarship, "Others" line). */
const PAGE_2_FIELDS: TextField[] = [
  {
    key: "course",
    page: 1,
    rect: { x: 8.0, y: 123.2, w: 192.4, h: 7.6 },
    align: "left",
    valign: "middle",
    size: 10,
    maxLines: 1,
  },
  {
    key: "scholarship",
    page: 1,
    rect: { x: 8.0, y: 137.2, w: 192.4, h: 8.4 },
    align: "left",
    valign: "middle",
    size: 9.5,
    maxLines: 1,
  },
  {
    key: "classificationOthers",
    page: 1,
    rect: { x: 176.5, y: 73.4, w: 22.5, h: 3.4 },
    align: "left",
    valign: "middle",
    size: 7,
    maxLines: 1,
  },
];

const TEXT_FIELDS = [...PAGE_1_FIELDS, ...PAGE_2_FIELDS];

type Tick = { page: 0 | 1; key: keyof TesdaFormData; value: string; cx: number; cy: number };

/** Checkbox centres, measured from the template. §5/§6 stay blank by design. */
const TICKS: Tick[] = [
  // 3.1 Sex
  { page: 0, key: "sex", value: "Male", cx: 13.1, cy: 165.1 },
  { page: 0, key: "sex", value: "Female", cx: 13.1, cy: 169.3 },
  // 3.2 Civil status
  { page: 0, key: "civilStatus", value: "Single", cx: 46.1, cy: 165.1 },
  { page: 0, key: "civilStatus", value: "Married", cx: 46.1, cy: 169.3 },
  {
    page: 0,
    key: "civilStatus",
    value: "Separated/Divorced/Annulled",
    cx: 46.1,
    cy: 173.4,
  },
  { page: 0, key: "civilStatus", value: "Widow/er", cx: 46.1, cy: 177.5 },
  { page: 0, key: "civilStatus", value: "Common Law/Live-in", cx: 46.1, cy: 181.5 },
  // 3.3 Employment status
  {
    page: 0,
    key: "employmentStatus",
    value: "Wage-Employed",
    cx: 95.4,
    cy: 168.9,
  },
  {
    page: 0,
    key: "employmentStatus",
    value: "Underemployed",
    cx: 95.4,
    cy: 173.1,
  },
  {
    page: 0,
    key: "employmentStatus",
    value: "Self-Employed",
    cx: 95.4,
    cy: 185.4,
  },
  { page: 0, key: "employmentStatus", value: "Unemployed", cx: 95.4, cy: 189.5 },
  // 3.3 Employment type
  { page: 0, key: "employmentType", value: "None", cx: 140.6, cy: 169.0 },
  { page: 0, key: "employmentType", value: "Regular", cx: 165.5, cy: 169.0 },
  { page: 0, key: "employmentType", value: "Casual", cx: 140.6, cy: 173.2 },
  { page: 0, key: "employmentType", value: "Job Order", cx: 165.5, cy: 173.2 },
  { page: 0, key: "employmentType", value: "Probationary", cx: 140.6, cy: 177.3 },
  { page: 0, key: "employmentType", value: "Permanent", cx: 165.5, cy: 177.3 },
  { page: 0, key: "employmentType", value: "Contractual", cx: 140.6, cy: 181.4 },
  { page: 0, key: "employmentType", value: "Temporary", cx: 165.5, cy: 181.4 },
  // 3.6 Educational attainment
  {
    page: 0,
    key: "educationalAttainment",
    value: "No Grade Completed",
    cx: 10.8,
    cy: 229.9,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "Elementary Undergraduate",
    cx: 10.8,
    cy: 236.9,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "Elementary Graduate",
    cx: 10.9,
    cy: 242.1,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "High School Undergraduate",
    cx: 10.9,
    cy: 249.0,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "High School Graduate",
    cx: 10.9,
    cy: 255.9,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "Junior High (K-12)",
    cx: 63.2,
    cy: 229.9,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "Senior High (K-12)",
    cx: 63.2,
    cy: 236.8,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "Post-Secondary Non-Tertiary/Technical Vocational Course Undergraduate",
    cx: 63.2,
    cy: 242.0,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "Post-Secondary Non-Tertiary/Technical Vocational Course Graduate",
    cx: 63.2,
    cy: 248.9,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "College Undergraduate",
    cx: 140.7,
    cy: 229.7,
  },
  {
    page: 0,
    key: "educationalAttainment",
    value: "College Graduate",
    cx: 140.7,
    cy: 236.7,
  },
  { page: 0, key: "educationalAttainment", value: "Masteral", cx: 140.7, cy: 241.9 },
  { page: 0, key: "educationalAttainment", value: "Doctorate", cx: 140.7, cy: 248.9 },

  // §4 Classification
  { page: 1, key: "classification", value: "4Ps Beneficiary", cx: 10.4, cy: 28.8 },
  { page: 1, key: "classification", value: "Displaced Workers", cx: 10.4, cy: 35.7 },
  {
    page: 1,
    key: "classification",
    value: "Family Members of AFP and PNP Wounded-in-Action",
    cx: 10.4,
    cy: 42.0,
  },
  { page: 1, key: "classification", value: "Industry Workers", cx: 10.4, cy: 49.7 },
  {
    page: 1,
    key: "classification",
    value: "Out-of-School-Youth",
    cx: 10.4,
    cy: 55.9,
  },
  {
    page: 1,
    key: "classification",
    value: "Rebel Returnees/Decommissioned Combatants",
    cx: 10.4,
    cy: 61.8,
  },
  { page: 1, key: "classification", value: "TESDA Alumni", cx: 10.5, cy: 70.0 },
  {
    page: 1,
    key: "classification",
    value: "Victim of Natural Disasters and Calamities",
    cx: 10.5,
    cy: 76.8,
  },
  {
    page: 1,
    key: "classification",
    value: "Agrarian Reform Beneficiary",
    cx: 73.0,
    cy: 28.8,
  },
  {
    page: 1,
    key: "classification",
    value: "Drug Dependents/Surrenderees/Surrenderers",
    cx: 73.0,
    cy: 34.0,
  },
  { page: 1, key: "classification", value: "Farmers and Fishermen", cx: 73.4, cy: 43.6 },
  { page: 1, key: "classification", value: "Inmates and Detainees", cx: 73.4, cy: 49.7 },
  {
    page: 1,
    key: "classification",
    value: "Overseas Filipino Workers (OFW) Dependent",
    cx: 73.4,
    cy: 54.2,
  },
  {
    page: 1,
    key: "classification",
    value: "Returning/Repatriated Overseas Filipino Workers (OFW)",
    cx: 73.4,
    cy: 61.8,
  },
  { page: 1, key: "classification", value: "TVET Trainers", cx: 73.4, cy: 69.9 },
  {
    page: 1,
    key: "classification",
    value: "Wounded-in-Action AFP & PNP Personnel",
    cx: 73.5,
    cy: 76.8,
  },
  { page: 1, key: "classification", value: "Balik Probinsya", cx: 138.4, cy: 28.8 },
  {
    page: 1,
    key: "classification",
    value: "Family Members of AFP and PNP Killed-in-Action",
    cx: 138.4,
    cy: 34.0,
  },
  {
    page: 1,
    key: "classification",
    value: "Indigenous People & Cultural Communities",
    cx: 138.4,
    cy: 43.6,
  },
  { page: 1, key: "classification", value: "MILF Beneficiary", cx: 138.5, cy: 49.7 },
  { page: 1, key: "classification", value: "RCEF-RESP", cx: 138.5, cy: 55.9 },
  { page: 1, key: "classification", value: "Student", cx: 138.5, cy: 63.5 },
  { page: 1, key: "classification", value: "Uniformed Personnel", cx: 138.6, cy: 69.9 },
  { page: 1, key: "classification", value: "Others", cx: 138.6, cy: 75.2 },

  // §9 Privacy consent
  { page: 1, key: "consentAgree", value: "Agree", cx: 71.0, cy: 171.2 },
  { page: 1, key: "consentAgree", value: "Disagree", cx: 113.8, cy: 171.2 },
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
