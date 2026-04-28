import { NextResponse } from "next/server";

import { safeRevalidatePath } from "@/lib/server/revalidate";
import { upsertSettings } from "@/lib/server/settings-service";

export async function POST(request: Request) {
  const payload = await request.json();
  const settings = await upsertSettings(payload);
  safeRevalidatePath("/");
  safeRevalidatePath("/records");
  safeRevalidatePath("/progress");

  return NextResponse.json({ id: settings.id });
}
