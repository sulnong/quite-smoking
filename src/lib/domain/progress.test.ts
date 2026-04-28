import { describe, expect, it } from "vitest";
import { getDailyReduction, getMoneySaved } from "@/lib/domain/progress";

describe("getDailyReduction", () => {
  it("compares smoked count against baseline", () => {
    expect(getDailyReduction({ baselinePerDay: 20, smokedToday: 8 })).toEqual({
      fewerCigarettes: 12,
      reductionRate: 0.6,
    });
  });
});

describe("getMoneySaved", () => {
  it("uses pack price and cigarettes-per-pack", () => {
    expect(
      getMoneySaved({
        baselinePerDay: 20,
        smokedCount: 236,
        daysSinceQuit: 12,
        cigarettePricePerPack: 25,
        cigarettesPerPack: 20,
      }),
    ).toBe(64);
  });
});

