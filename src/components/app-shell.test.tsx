import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  test("renders bottom tabs with expected links", () => {
    render(
      <AppShell pathname="/">
        <div>child</div>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: "今日" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "记录" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "进展" })).toBeInTheDocument();
  });

  test("marks the active tab based on pathname", () => {
    const { rerender } = render(
      <AppShell pathname="/">
        <div>child</div>
      </AppShell>
    );

    const today = screen.getByRole("link", { name: "今日" });
    const records = screen.getByRole("link", { name: "记录" });
    const progress = screen.getByRole("link", { name: "进展" });

    expect(today).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(today).toHaveClass("is-active");
    expect(records).not.toHaveAttribute("aria-current");
    expect(records).not.toHaveClass("is-active");
    expect(progress).not.toHaveAttribute("aria-current");
    expect(progress).not.toHaveClass("is-active");

    rerender(
      <AppShell pathname="/records">
        <div>child</div>
      </AppShell>
    );

    const records2 = screen.getByRole("link", { name: "记录" });
    expect(records2).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(records2).toHaveClass("is-active");
  });
});
