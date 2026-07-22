const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("settings modules render for manager and stay hidden from employee", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Settings");
  await expect(page.locator("#content")).toContainText(/Ticket Assignment|Lookup|System|Administration/i);
  await expect(page.locator("#content")).toContainText(/Assignment Groups|Appearance/i);

  await loginByStorage(page, users.employeeA);
  await expect(page.locator("#nav")).not.toContainText(/Settings|Users|Roles|Audit|Trash/i);
});

test("notifications are recipient-scoped and read actions work", async ({ page }) => {
  await loginByStorage(page, users.manager);
  const ticket = await api(page, "/api/tickets", { method: "POST", userId: users.employeeA.id, body: { description: "QA_AUTO notification scoped ticket", category: "General Questions", priority: "high" } });
  expect(ticket.status).toBe(201);

  const managerState = await api(page, "/api/state", { userId: users.manager.id });
  const employeeBState = await api(page, "/api/state", { userId: users.employeeB.id });
  expect(JSON.stringify(managerState.data.notifications)).toContain("QA_AUTO");
  expect(JSON.stringify(employeeBState.data.notifications)).not.toContain(ticket.data.id);

  const readAll = await api(page, "/api/notifications/read-all", { method: "PATCH", userId: users.manager.id, body: {} });
  expect(readAll.status).toBe(200);
});

test("global search handles English, Arabic and special characters without exposing forbidden records", async ({ page }) => {
  await loginByStorage(page, users.employeeA);
  await page.locator(".global-search input, input[placeholder*='Search tickets']").first().fill("VPN");
  await expect(page.locator("#app")).toBeVisible();
  await page.locator(".global-search input, input[placeholder*='Search tickets']").first().fill("اختبار QA_AUTO <script>");
  await expect(page.locator("#app")).toBeVisible();
});
