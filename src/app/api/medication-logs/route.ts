import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { safeRevalidatePath } from "@/lib/server/revalidate";

export async function POST(request: Request) {
  const payload = await request.json();

  const log = await db.medicationLog.create({
    data: {
      scheduledForDate: new Date(payload.scheduledForDate),
      scheduledSlot: String(payload.scheduledSlot),
      doseMg: payload.doseMg ? Number(payload.doseMg) : null,
      takenAt: new Date(payload.takenAt),
      status: "taken",
      note: payload.note ? String(payload.note) : null
    }
  });
  safeRevalidatePath("/");
  safeRevalidatePath("/records");

  return NextResponse.json({ id: log.id });
}
