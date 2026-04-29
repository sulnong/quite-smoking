import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QuickEntrySheet } from "@/components/records/quick-entry-sheet";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh
  })
}));

describe("QuickEntrySheet", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ id: "log-1" })
        } as Response)
      )
    );
  });

  it("submits a smoking log with time, state, and urge delay", async () => {
    render(<QuickEntrySheet />);

    fireEvent.change(screen.getByLabelText("抽烟时间"), {
      target: { value: "2026-04-29T16:20" }
    });
    fireEvent.change(screen.getByLabelText("抽烟时的状态"), {
      target: { value: "烦躁" }
    });
    fireEvent.change(screen.getByLabelText("从烟瘾来到点烟，隔了多久（分钟）"), {
      target: { value: "12" }
    });
    fireEvent.change(screen.getByLabelText("一句备注"), {
      target: { value: "开会前忍不住了" }
    });

    fireEvent.click(screen.getByRole("button", { name: "保存记录" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/smoking-logs",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.any(String)
        })
      );
    });

    expect(JSON.parse((vi.mocked(fetch).mock.calls[0] ?? [])[1]?.body as string)).toMatchObject({
      smokedAt: "2026-04-29T16:20",
      count: 1,
      contextTag: "烦躁",
      triggerTag: "12 分钟",
      note: "开会前忍不住了"
    });

    await waitFor(() => {
      expect(refresh).toHaveBeenCalled();
    });
  });
});
