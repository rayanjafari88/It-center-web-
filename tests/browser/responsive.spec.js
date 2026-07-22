const { test, expect } = require("@playwright/test");
const { users, loginByStorage, ensureNoHorizontalOverflow } = require("./helpers");

const viewports = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844]
];

for (const [width, height] of viewports) {
  test(`responsive smoke ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await loginByStorage(page, users.employeeA);
    await ensureNoHorizontalOverflow(page);
    await expect(page.locator("#content")).toBeVisible();
  });
}
