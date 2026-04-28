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
});

