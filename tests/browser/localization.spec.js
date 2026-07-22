const { test, expect } = require("@playwright/test");
const { users, loginByStorage, setLanguage } = require("./helpers");

test("English LTR and Arabic RTL persist across refresh", async ({ page }) => {
  await loginByStorage(page, users.employeeA);
  await setLanguage(page, "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await setLanguage(page, "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
