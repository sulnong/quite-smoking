import { revalidatePath } from "next/cache";

export function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("static generation store missing")) {
      return;
    }

    throw error;
  }
}
