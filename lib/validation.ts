import { z } from "zod";
import { PROGRAM_SLUGS } from "@/lib/programs";

export const CIVIL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Widowed",
  "Separated",
] as const;

export type CivilStatus = (typeof CIVIL_STATUS_OPTIONS)[number];

export const HIGHEST_ATTAINMENT_OPTIONS = [
  "Elementary",
  "Junior High School",
  "Senior High School",
  "College",
  "Other",
] as const;

export type HighestAttainment = (typeof HIGHEST_ATTAINMENT_OPTIONS)[number];

export const preRegistrationSchema = z
  .object({
    // I. Personal Information
    lastName: z.string().trim().min(1, "Last name is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    middleName: z.string().trim().optional(),
    suffix: z.string().trim().optional(),
    mobile: z.string().trim().min(7, "Contact number is required"),
    email: z.string().trim().email("Enter a valid email address"),
    civilStatus: z.enum(CIVIL_STATUS_OPTIONS, {
      errorMap: () => ({ message: "Select your civil status" }),
    }),

    // Complete Address
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

    // II. Educational Information
    isCurrentlyEnrolled: z.enum(["YES", "NO"], {
      errorMap: () => ({ message: "Please select YES or NO" }),
    }),
    currentSchool: z.string().trim().optional(),
    currentGradeLevel: z.string().trim().optional(),
    currentProgram: z.string().trim().optional(),
    highestAttainment: z.string().trim().optional(),

    // III. Program Interest
    program: z.enum(PROGRAM_SLUGS, {
      errorMap: () => ({ message: "Select a program" }),
    }),

    // IV. Acknowledgement
    acknowledgement: z
      .boolean()
      .refine((value) => value, "You must acknowledge this notice"),

    // V. Data Privacy Agreement
    consent: z
      .boolean()
      .refine((value) => value, "You must agree to the data privacy agreement"),
  })
  .superRefine((data, ctx) => {
    if (data.isCurrentlyEnrolled === "YES") {
      if (!data.currentSchool || data.currentSchool.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["currentSchool"],
          message: "Name of school is required when currently enrolled",
        });
      }
    } else if (data.isCurrentlyEnrolled === "NO") {
      if (!data.highestAttainment || data.highestAttainment.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highestAttainment"],
          message: "Highest educational attainment is required",
        });
      }
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
