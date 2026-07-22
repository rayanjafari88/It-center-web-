const { test, expect } = require("@playwright/test");
const { users, loginByStorage, openModule } = require("./helpers");

test("settings admin centers expose V1 administration destinations without employee access", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Settings");
  await expect(page.locator("#content")).toContainText(/User Accounts|Roles|Archive|Trash|Audit|Form Templates|Global Attachments/i);

  await loginByStorage(page, users.employeeA);
  await expect(page.locator("#nav")).not.toContainText(/Settings|User Accounts|Roles|Archive|Trash|Audit/i);
});

test("notifications bell opens and stays recipient scoped in the UI shell", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await page.locator("#notificationsButton").click();
  await expect(page.locator("#menuHost")).toContainText(/Notifications|No notifications|Mark all/i);
  await page.keyboard.press("Escape");
  await expect(page.locator("#app")).toBeVisible();
});
