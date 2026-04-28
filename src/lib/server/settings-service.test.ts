import { describe, expect, it } from "vitest";

import { validateQuitDate } from "@/lib/server/settings-service";

describe("validateQuitDate", () => {
  it("rejects a quit date before treatment day 8", () => {
    expect(() =>
      validateQuitDate({
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-04"
      })
    ).toThrow("戒烟日必须在治疗第 8 到 35 天之间");
  });
});
