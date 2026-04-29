import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SupportActionsCard } from "@/components/today/support-actions-card";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn()
  })
}));

describe("SupportActionsCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("supports pause and reset after the timer starts", async () => {
    render(<SupportActionsCard />);

    fireEvent.click(screen.getByRole("button", { name: "开始倒计时" }));

    expect(screen.getByRole("button", { name: "暂停" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重置" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("02:57")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "暂停" }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("02:57")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重置" }));

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByRole("button", { name: "开始倒计时" })).toBeInTheDocument();
  });
});
