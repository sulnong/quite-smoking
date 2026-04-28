import { db } from "@/lib/db";
import { getDefaultQuitDate, getQuitWindow } from "@/lib/domain/stage";
import { settingsSchema } from "@/lib/validation/settings";

export function validateQuitDate(input: {
  treatmentStartDate: string;
  targetQuitDate: string | null;
}) {
  if (!input.targetQuitDate) return;

  const { earliest, latest } = getQuitWindow(input.treatmentStartDate);

  if (input.targetQuitDate < earliest || input.targetQuitDate > latest) {
    throw new Error("戒烟日必须在治疗第 8 到 35 天之间");
  }
}

export async function upsertSettings(payload: unknown) {
  const parsed = settingsSchema.parse(payload);
  const targetQuitDate = parsed.targetQuitDate ?? getDefaultQuitDate(parsed.treatmentStartDate);

  validateQuitDate({
    treatmentStartDate: parsed.treatmentStartDate,
    targetQuitDate
  });

  return db.settings.upsert({
    where: { id: 1 },
    update: {
      treatmentStartDate: new Date(parsed.treatmentStartDate),
      targetQuitDate: new Date(targetQuitDate),
      baselineCigarettesPerDay: parsed.baselineCigarettesPerDay,
      cigarettePricePerPack: parsed.cigarettePricePerPack,
      cigarettesPerPack: parsed.cigarettesPerPack,
      timezone: parsed.timezone,
      medicationName: parsed.medicationName,
      medicationScheduleJson: JSON.stringify(parsed.medicationSchedule)
    },
    create: {
      id: 1,
      treatmentStartDate: new Date(parsed.treatmentStartDate),
      targetQuitDate: new Date(targetQuitDate),
      baselineCigarettesPerDay: parsed.baselineCigarettesPerDay,
      cigarettePricePerPack: parsed.cigarettePricePerPack,
      cigarettesPerPack: parsed.cigarettesPerPack,
      timezone: parsed.timezone,
      medicationName: parsed.medicationName,
      medicationScheduleJson: JSON.stringify(parsed.medicationSchedule)
    }
  });
}
