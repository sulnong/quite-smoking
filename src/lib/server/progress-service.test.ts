import { describe, expect, it } from "vitest";

import { getPrepTrend } from "@/lib/server/progress-service";

describe("getPrepTrend", () => {
  it("builds a 7-day smoking trend from the daily totals", () => {
    expect(
      getPrepTrend({
        baselinePerDay: 20,
        dailyCounts: [
          { day: "2026-05-01", count: 15 },
          { day: "2026-05-02", count: 12 }
        ]
      })
    ).toEqual([
      { day: "2026-05-01", count: 15, fewerThanBaseline: 5 },
      { day: "2026-05-02", count: 12, fewerThanBaseline: 8 }
    ]);
  });
});
