import { describe, expect, it } from "vitest";
import { getCurrentStage, getQuitWindow } from "@/lib/domain/stage";

describe("getCurrentStage", () => {
  it("returns prep before the target quit date", () => {
    expect(
      getCurrentStage({
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-10",
        now: new Date("2026-05-04T08:00:00+08:00"),
      }),
    ).toBe("prep");
  });

  it("returns quit on and after the target quit date", () => {
    expect(
      getCurrentStage({
        treatmentStartDate: "2026-04-28",
        targetQuitDate: "2026-05-05",
        now: new Date("2026-05-05T09:00:00+08:00"),
      }),
    ).toBe("quit");
  });
});

describe("getQuitWindow", () => {
  it('returns { earliest: "2026-05-05", latest: "2026-06-01" } for 2026-04-28', () => {
    expect(getQuitWindow("2026-04-28")).toEqual({
      earliest: "2026-05-05",
      latest: "2026-06-01",
    });
  });
});

