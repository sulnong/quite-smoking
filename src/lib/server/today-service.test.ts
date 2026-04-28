import { describe, expect, it } from "vitest";

import { buildPrepStageSummary } from "@/lib/server/today-service";

describe("buildPrepStageSummary", () => {
  it("summarizes today's smoked count against baseline", () => {
    expect(
      buildPrepStageSummary({
        baselinePerDay: 20,
        smokedToday: 8,
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-10",
        now: new Date("2026-05-04T08:00:00+08:00")
      })
    ).toMatchObject({
      stage: "prep",
      smokedToday: 8,
      fewerCigarettes: 12,
      daysUntilQuit: 6
    });
  });
});
