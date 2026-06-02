import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    headless: true,
    viewport: { width: 390, height: 844 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    baseURL: "http://127.0.0.1:3001",
  },
  webServer: {
    command: "npm run dev -- --port 3001",
    port: 3001,
    reuseExistingServer: true,
  },
};

export default config;
