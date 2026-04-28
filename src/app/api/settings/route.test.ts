import { describe, expect, it } from "vitest";

import * as route from "@/app/api/settings/route";

describe("POST /api/settings", () => {
  it("stores the single-user settings payload", async () => {
    const request = new Request("http://localhost/api/settings", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        treatmentStartDate: "2026-04-28",
        baselineCigarettesPerDay: 20,
        cigarettePricePerPack: 25,
        cigarettesPerPack: 20,
        timezone: "Asia/Shanghai",
        medicationName: "酒石酸伐尼克兰",
        medicationSchedule: ["08:30", "20:30"]
      })
    });

    const response = await route.POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ id: 1 });
  });
});
