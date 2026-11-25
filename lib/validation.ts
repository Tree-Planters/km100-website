import { z } from "zod";
import { PROGRAM_SLUGS } from "@/lib/programs";

export const SEX_OPTIONS = ["Male", "Female"] as const;

export const CIVIL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Separated/Divorced/Annulled",
  "Widow/er",
  "Common Law/Live-in",
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  "Wage-Employed",
  "Underemployed",
  "Self-Employed",
  "Unemployed",
] as const;

/** MIS 03-01 §3.3 Employment Type (if wage-employed or underemployed). */
export const EMPLOYMENT_TYPE_OPTIONS = [
  "None",
  "Regular",
  "Casual",
  "Job Order",
  "Probationary",
  "Permanent",
  "Contractual",
  "Temporary",
] as const;

/** MIS 03-01 §3.6, in the same order the paper prints them. */
export const EDUCATIONAL_ATTAINMENT_OPTIONS = [
  "No Grade Completed",
  "Elementary Undergraduate",
  "Elementary Graduate",
  "High School Undergraduate",
  "High School Graduate",
  "Junior High (K-12)",
  "Senior High (K-12)",
  "Post-Secondary Non-Tertiary/Technical Vocational Course Undergraduate",
  "Post-Secondary Non-Tertiary/Technical Vocational Course Graduate",
  "College Undergraduate",
  "College Graduate",
  "Masteral",
  "Doctorate",
] as const;

/** MIS 03-01 §4, in the same order the paper prints them. */
export const CLASSIFICATION_OPTIONS = [
  "4Ps Beneficiary",
  "Displaced Workers",
  "Family Members of AFP and PNP Wounded-in-Action",
  "Industry Workers",
  "Out-of-School-Youth",
  "Rebel Returnees/Decommissioned Combatants",
  "TESDA Alumni",
  "Victim of Natural Disasters and Calamities",
  "Agrarian Reform Beneficiary",
  "Drug Dependents/Surrenderees/Surrenderers",
  "Farmers and Fishermen",
  "Inmates and Detainees",
  "Overseas Filipino Workers (OFW) Dependent",
  "Returning/Repatriated Overseas Filipino Workers (OFW)",
  "TVET Trainers",
  "Wounded-in-Action AFP & PNP Personnel",
  "Balik Probinsya",
  "Family Members of AFP and PNP Killed-in-Action",
  "Indigenous People & Cultural Communities",
  "MILF Beneficiary",
  "RCEF-RESP",
  "Student",
  "Uniformed Personnel",
  "Others",
] as const;

export const SCHOLARSHIP_OPTIONS = ["TWSP", "PESFA", "STEP", "Others"] as const;

/** Legacy option list still used by the older single-page form component. */
export const HIGHEST_ATTAINMENT_OPTIONS = [
  "Elementary",
  "Junior High School",
  "Senior High School",
  "College",
  "Other",
] as const;

export type Sex = (typeof SEX_OPTIONS)[number];
export type CivilStatus = (typeof CIVIL_STATUS_OPTIONS)[number];
export type EmploymentStatus = (typeof EMPLOYMENT_STATUS_OPTIONS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPE_OPTIONS)[number];
export type EducationalAttainment =
  (typeof EDUCATIONAL_ATTAINMENT_OPTIONS)[number];
export type HighestAttainment = (typeof HIGHEST_ATTAINMENT_OPTIONS)[number];

const currentYear = new Date().getFullYear();

export const preRegistrationSchema = z
  .object({
    // §2.1 Name
    lastName: z.string().trim().min(1, "Last name is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    middleName: z.string().trim().optional(),
    suffix: z.string().trim().optional(),

    // §2.2 Complete permanent mailing address + contact details
    mobile: z.string().trim().min(7, "Contact number is required"),
    email: z.string().trim().email("Enter a valid email address"),
    nationality: z.string().trim().min(1, "Nationality is required"),

    address: z.string().trim().min(1, "Street / house number is required"),
    sitio: z.string().trim().optional(),
    barangay: z.string().trim().min(1, "Barangay is required"),
    barangayCode: z.string().trim().optional(),
    district: z.string().trim().min(1, "District is required"),
    municipality: z.string().trim().min(1, "City / Municipality is required"),
    cityCode: z.string().trim().optional(),
    province: z.string().trim().min(1, "Province is required"),
    provinceCode: z.string().trim().optional(),
    region: z.string().trim().min(1, "Region is required"),
    regionCode: z.string().trim().optional(),

    // §3.1 - §3.3
    sex: z.enum(SEX_OPTIONS, {
      errorMap: () => ({ message: "Select your sex" }),
    }),
    civilStatus: z.enum(CIVIL_STATUS_OPTIONS, {
      errorMap: () => ({ message: "Select your civil status" }),
    }),
    employmentStatus: z.enum(EMPLOYMENT_STATUS_OPTIONS, {
      errorMap: () => ({ message: "Select your employment status" }),
    }),
    employmentType: z.enum(EMPLOYMENT_TYPE_OPTIONS).optional(),

    // §3.4 Birthdate
    birthMonth: z
      .number()
      .int()
      .min(1, "Select the month of birth")
      .max(12, "Select the month of birth"),
    birthDay: z
      .number()
      .int()
      .min(1, "Select the day of birth")
      .max(31, "Select the day of birth"),
    birthYear: z
      .number()
      .int()
      .min(1900, "Select the year of birth")
      .max(currentYear, "Year of birth is in the future"),
    age: z.number().int().min(0).max(130).optional(),

    // §3.5 Birthplace
    birthCity: z.string().trim().min(1, "Birth city / municipality is required"),
    birthProvince: z.string().trim().min(1, "Birth province is required"),
    birthRegion: z.string().trim().min(1, "Birth region is required"),

    // §3.6 Educational attainment before the training
    educationalAttainment: z.enum(EDUCATIONAL_ATTAINMENT_OPTIONS, {
      errorMap: () => ({ message: "Select your educational attainment" }),
    }),

    // §3.7 Parent / guardian
    parentName: z.string().trim().min(1, "Parent / guardian name is required"),
    parentAddress: z
      .string()
      .trim()
      .min(1, "Parent / guardian address is required"),

    // §4 Classification
    classification: z
      .array(z.enum(CLASSIFICATION_OPTIONS))
      .min(1, "Select at least one classification"),
    classificationOthers: z.string().trim().optional(),

    // §7 Name of course / qualification
    program: z.enum(PROGRAM_SLUGS, {
      errorMap: () => ({ message: "Select a program" }),
    }),

    // §8 Scholarship package
    scholarshipPackage: z.string().trim().optional(),

    // Derived from §3.6 so existing dashboard/email/export code keeps working.
    isCurrentlyEnrolled: z.enum(["YES", "NO"]).optional(),
    currentSchool: z.string().trim().optional(),
    currentGradeLevel: z.string().trim().optional(),
    currentProgram: z.string().trim().optional(),
    highestAttainment: z.string().trim().optional(),

    // KM100 pre-registration acknowledgement
    acknowledgement: z
      .boolean()
      .refine((value) => value, "You must acknowledge this notice"),

    // §9 Privacy disclaimer
    consent: z
      .boolean()
      .refine((value) => value, "You must agree to the data privacy agreement"),
  })
  .superRefine((data, ctx) => {
    if (
      (data.employmentStatus === "Wage-Employed" ||
        data.employmentStatus === "Underemployed") &&
      !data.employmentType
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["employmentType"],
        message: "Select your employment type",
      });
    }

    if (
      data.classification.includes("Others") &&
      (!data.classificationOthers || data.classificationOthers.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["classificationOthers"],
        message: "Please specify the other classification",
      });
    }
  });

export type PreRegistrationInput = z.infer<typeof preRegistrationSchema>;

export function validatePreRegistration(data: unknown) {
  return preRegistrationSchema.safeParse(data);
}

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
