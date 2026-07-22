const { test, expect } = require("@playwright/test");
const { users, login, loginByStorage } = require("./helpers");

test("successful login, invalid login, refresh persistence, logout", async ({ page }) => {
  await page.goto("/");
  await page.locator("#loginForm input[name='email']").fill(users.manager.username);
  await page.locator("#loginForm input[name='password']").fill("wrong-password");
  await page.locator("#loginForm button[type='submit']").click();
  await expect(page.locator("#login")).toBeVisible();

  await login(page, users.manager);
  await expect(page.locator("#userName")).toContainText(/QA_AUTO Manager|Manager/i);
  await page.reload();
  await expect(page.locator("#app")).toBeVisible();

  await page.locator("#profileButton").click();
  await page.getByText("Logout", { exact: true }).click();
  await expect(page.locator("#login")).toBeVisible();
});

test("unauthorized employee admin page redirects or hides admin modules", async ({ page }) => {
  await loginByStorage(page, users.employeeA);
  await expect(page.locator("#nav")).not.toContainText("Settings");
  await expect(page.locator("#nav")).not.toContainText("User Accounts");
  await expect(page.locator("#nav")).not.toContainText("Audit Feed");
});
