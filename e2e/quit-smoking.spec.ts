import { expect, test } from "@playwright/test";

test("renders the app shell tabs", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "今日" })).toBeVisible();
  await expect(page.getByRole("link", { name: "记录" })).toBeVisible();
  await expect(page.getByRole("link", { name: "进展" })).toBeVisible();
});

