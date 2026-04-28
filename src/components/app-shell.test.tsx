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

    expect(screen.getByRole("link", { name: "今日" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "记录" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.getByRole("link", { name: "进展" })).not.toHaveAttribute(
      "aria-current"
    );

    rerender(
      <AppShell pathname="/records">
        <div>child</div>
      </AppShell>
    );

    expect(screen.getByRole("link", { name: "记录" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});
