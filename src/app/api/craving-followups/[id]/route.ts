import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { safeRevalidatePath } from "@/lib/server/revalidate";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json();

  const updated = await db.cravingFollowup.update({
    where: { id },
    data: {
      followupCompletedAt: new Date(),
      outcome: payload.outcome ? String(payload.outcome) : null,
      note: payload.note ? String(payload.note) : null
    }
  });
  safeRevalidatePath("/");
  safeRevalidatePath("/records");

  return NextResponse.json({ id: updated.id });
}
