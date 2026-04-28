import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:3100"
    ,
    browserName: "chromium",
    launchOptions: {
      executablePath: "/usr/bin/google-chrome"
    }
  },
  webServer: {
    command: "next dev -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: true,
    timeout: 120_000
  }
});
