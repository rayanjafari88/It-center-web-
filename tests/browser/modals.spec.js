const { test, expect } = require("@playwright/test");
const { users, loginByStorage } = require("./helpers");

test("Escape closes top overlay and app remains clickable", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await page.locator("[data-header-quick-create]").first().click();
  await expect(page.locator("#menuHost .menu-item").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#app")).toBeVisible();
});
