import { describe, expect, it } from "vitest";

import { buildFollowupDueAt } from "@/lib/server/followup-service";

describe("buildFollowupDueAt", () => {
  it("sets the followup due time 10 minutes after the craving event", () => {
    expect(buildFollowupDueAt("2026-05-05T10:00:00+08:00")).toBe("2026-05-05T10:10:00.000+08:00");
  });
});
