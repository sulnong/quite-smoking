import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { safeRevalidatePath } from "@/lib/server/revalidate";
import { upsertSettings, validateQuitDate } from "@/lib/server/settings-service";

export async function PATCH(request: Request) {
  const payload = await request.json();
  const settings = await db.settings.findUniqueOrThrow({ where: { id: 1 } });

  validateQuitDate({
    treatmentStartDate: settings.treatmentStartDate.toISOString().slice(0, 10),
    targetQuitDate: payload.targetQuitDate ? String(payload.targetQuitDate) : null
  });

  await upsertSettings({
    treatmentStartDate: settings.treatmentStartDate.toISOString().slice(0, 10),
    targetQuitDate: payload.targetQuitDate ? String(payload.targetQuitDate) : null,
    baselineCigarettesPerDay: settings.baselineCigarettesPerDay,
    cigarettePricePerPack: Number(settings.cigarettePricePerPack),
    cigarettesPerPack: settings.cigarettesPerPack,
    timezone: settings.timezone,
    medicationName: settings.medicationName,
    medicationSchedule: JSON.parse(settings.medicationScheduleJson) as string[]
  });
  safeRevalidatePath("/");
  safeRevalidatePath("/progress");

  return NextResponse.json({ ok: true });
}
