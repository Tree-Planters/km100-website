import { z } from "zod";
import { PROGRAM_SLUGS } from "@/lib/programs";

export const preRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "Last name is required"),
  suffix: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email address"),
  mobile: z.string().trim().min(7, "Enter a valid mobile number"),
  program: z.enum(PROGRAM_SLUGS, {
    errorMap: () => ({ message: "Select a program" }),
  }),
  consent: z
    .boolean()
    .refine((value) => value, "You must accept the privacy notice"),
});

export type PreRegistrationInput = z.infer<typeof preRegistrationSchema>;
