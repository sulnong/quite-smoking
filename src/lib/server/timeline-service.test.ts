import { describe, expect, it } from "vitest";

import { mergeTimelineItems } from "@/lib/server/timeline-service";

describe("mergeTimelineItems", () => {
  it("sorts smoking logs and record entries in reverse chronological order", () => {
    const items = mergeTimelineItems({
      smokingLogs: [{ id: "s1", smokedAt: new Date("2026-05-04T12:00:00+08:00"), count: 1 }],
      recordEntries: [
        { id: "r1", occurredAt: new Date("2026-05-04T14:00:00+08:00"), kind: "mood", note: "烦躁" }
      ]
    });

    expect(items.map((item) => item.id)).toEqual(["r1", "s1"]);
  });
});
