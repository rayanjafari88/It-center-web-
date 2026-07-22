const path = require("path");
const { defineConfig, devices } = require("@playwright/test");

const PORT = Number(process.env.PLAYWRIGHT_PORT || 4321);
const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === "1";

module.exports = defineConfig({
  testDir: "./tests/browser",
  timeout: 45_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "qa/reports/playwright-results.json" }],
    ["html", { outputFolder: "qa/reports/playwright-html", open: "never" }]
  ],
  outputDir: "qa/reports/playwright-artifacts",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000
  },
  webServer: useExternalServer ? undefined : {
    command: `node server.js`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 20_000,
    env: { PORT: String(PORT) }
  },
  globalSetup: require.resolve("./qa/scripts/playwright-global-setup.js"),
  globalTeardown: require.resolve("./qa/scripts/playwright-global-teardown.js"),
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }
  ]
});
