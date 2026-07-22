const { test, expect } = require("@playwright/test");
const { users, loginByStorage } = require("./helpers");

test("accessibility smoke: keyboard focus, labels, buttons and Escape behavior", async ({ page }) => {
  await loginByStorage(page, users.manager);

  await page.keyboard.press("Tab");
  const activeTag = await page.evaluate(() => document.activeElement?.tagName || "");
  expect(activeTag).toBeTruthy();

  const unnamedButtons = await page.locator("button").evaluateAll((buttons) => buttons.filter((button) => !(button.innerText || button.getAttribute("aria-label") || button.title || "").trim()).length);
  expect(unnamedButtons).toBe(0);

  await page.locator("[data-header-quick-create]").first().click();
  await expect(page.locator("#menuHost .menu-item").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#app")).toBeVisible();

  await page.locator("[data-header-quick-create]").first().click();
  await page.locator("#menuHost .menu-item").filter({ hasText: /Ticket/i }).first().click();
  await expect(page.locator(".modal, .confirm-card").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#dialogHost .modal, #dialogHost .confirm-card")).toHaveCount(0);
});
