import { defineConfig } from "@playwright/test";

/**
 * Builder smoke tests (M9.3). The webServer boots a throwaway dev instance
 * on :3100 — running this starts a dev server, so it needs the same user
 * approval as `yarn dev` (repo AGENTS.md). `yarn test:e2e` to run.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  webServer: {
    command: "yarn dev --port 3100",
    url: "http://localhost:3100/admin",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: {
    baseURL: "http://localhost:3100",
  },
});
