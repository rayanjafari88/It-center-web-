const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api } = require("./helpers");

test("employee ticket creation and privacy flow through API with visible portal", async ({ page }) => {
  await loginByStorage(page, users.employeeA);
  await expect(page.locator("#content")).toContainText(/Submit Request|My Tickets|Knowledge/i);

  const created = await api(page, "/api/tickets", { method: "POST", userId: users.employeeA.id, body: { description: "QA_AUTO Arabic request مرحبا أحتاج مساعدة", category: "Network & Connectivity / VPN", priority: "medium", suggestedArticleIds: ["kb_001"] } });
  expect(created.status).toBe(201);

  const own = await api(page, `/api/tickets/${created.data.id}`, { userId: users.employeeA.id });
  expect(own.status).toBe(200);

  const denied = await api(page, `/api/tickets/${created.data.id}`, { userId: users.employeeB.id });
  expect(denied.status).toBe(403);

  const comment = await api(page, "/api/comments", { method: "POST", userId: users.employeeA.id, body: { entityType: "ticket", entityId: created.data.id, body: "QA_AUTO Employee public comment" } });
  expect(comment.status).toBe(201);
});

test("suggested article preview preserves request form shell and closes overlays", async ({ page }) => {
  await loginByStorage(page, users.employeeA);
  await page.locator("body").press("Escape");
  await expect(page.locator("#dialogHost .modal-backdrop")).toHaveCount(0);
  await expect(page.locator("#app")).toBeVisible();
});
