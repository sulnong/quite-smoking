import { describe, expect, it } from "vitest";

import { getMedicationPlanForDate } from "@/lib/domain/medication-plan";

describe("getMedicationPlanForDate", () => {
  it("uses 0.5mg once daily for treatment days 1 to 3", () => {
    expect(
      getMedicationPlanForDate({
        treatmentStartDate: "2026-04-28",
        date: "2026-04-30",
        morningTime: "08:00",
        eveningTime: "20:00"
      })
    ).toMatchObject({
      treatmentDay: 3,
      summary: "0.5mg 每日 1 次",
      slots: [{ label: "早", time: "08:00", doseMg: 0.5 }]
    });
  });

  it("uses 0.5mg twice daily for treatment days 4 to 7", () => {
    expect(
      getMedicationPlanForDate({
        treatmentStartDate: "2026-04-28",
        date: "2026-05-03",
        morningTime: "08:00",
        eveningTime: "20:00"
      })
    ).toMatchObject({
      treatmentDay: 6,
      summary: "0.5mg 每日 2 次",
      slots: [
        { label: "早", time: "08:00", doseMg: 0.5 },
        { label: "晚", time: "20:00", doseMg: 0.5 }
      ]
    });
  });

  it("uses 1mg twice daily from treatment day 8 onward", () => {
    expect(
      getMedicationPlanForDate({
        treatmentStartDate: "2026-04-28",
        date: "2026-05-05",
        morningTime: "08:00",
        eveningTime: "20:00"
      })
    ).toMatchObject({
      treatmentDay: 8,
      summary: "1mg 每日 2 次",
      slots: [
        { label: "早", time: "08:00", doseMg: 1 },
        { label: "晚", time: "20:00", doseMg: 1 }
      ]
    });
  });
});
