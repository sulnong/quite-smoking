import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { buildFollowupDueAt } from "@/lib/server/followup-service";
import { safeRevalidatePath } from "@/lib/server/revalidate";

export async function POST(request: Request) {
  const payload = await request.json();

  const entry = await db.recordEntry.create({
    data: {
      occurredAt: new Date(payload.occurredAt),
      kind: String(payload.kind),
      severity: payload.severity ? Number(payload.severity) : null,
      triggerTag: payload.triggerTag ? String(payload.triggerTag) : null,
      actionTag: payload.actionTag ? String(payload.actionTag) : null,
      resolved: typeof payload.resolved === "boolean" ? payload.resolved : null,
      note: payload.note ? String(payload.note) : null
    }
  });

  if (entry.kind === "craving") {
    await db.cravingFollowup.create({
      data: {
        cravingRecordId: entry.id,
        followupDueAt: new Date(buildFollowupDueAt(String(payload.occurredAt)))
      }
    });
  }
  safeRevalidatePath("/");
  safeRevalidatePath("/records");
  safeRevalidatePath("/progress");

  return NextResponse.json({ id: entry.id });
}
