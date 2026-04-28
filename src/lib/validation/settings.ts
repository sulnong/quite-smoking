import { z } from "zod";

export const settingsSchema = z.object({
  treatmentStartDate: z.string().date(),
  targetQuitDate: z.string().date().nullable().optional(),
  baselineCigarettesPerDay: z.number().int().min(1).max(200),
  cigarettePricePerPack: z.number().positive(),
  cigarettesPerPack: z.number().int().min(1).max(100),
  timezone: z.string().min(1),
  medicationName: z.string().min(1),
  medicationSchedule: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1)
});
