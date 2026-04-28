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
  it("computes savings from fewer cigarettes vs baseline using pack pricing", () => {
    expect(
      getMoneySaved({
        baselinePerDay: 20,
        smokedCount: 236,
        daysSinceQuit: 12,
        cigarettePricePerPack: 25,
        cigarettesPerPack: 20,
      }),
    ).toBe(5);
  });
});
