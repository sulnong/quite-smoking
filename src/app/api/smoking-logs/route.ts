import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { safeRevalidatePath } from "@/lib/server/revalidate";

export async function POST(request: Request) {
  const payload = await request.json();

  const log = await db.smokingLog.create({
    data: {
      smokedAt: new Date(payload.smokedAt),
      count: Number(payload.count),
      contextTag: payload.contextTag ? String(payload.contextTag) : null,
      triggerTag: payload.triggerTag ? String(payload.triggerTag) : null,
      note: payload.note ? String(payload.note) : null
    }
  });
  safeRevalidatePath("/");
  safeRevalidatePath("/records");
  safeRevalidatePath("/progress");

  return NextResponse.json({ id: log.id });
}
