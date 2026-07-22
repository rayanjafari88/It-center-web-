const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("document create, permitted access, archive and restore", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Documents");
  const doc = await api(page, "/api/documents", { method: "POST", userId: users.manager.id, body: { title: "QA_AUTO Browser Document", description: "QA browser document", category: "Policy", status: "Published", visibility: "employees", linkedType: "company" } });
  expect(doc.status).toBe(201);
  expect((await api(page, `/api/documents/${doc.data.id}`, { userId: users.employeeA.id })).status).toBe(200);
  expect((await api(page, `/api/documents/${doc.data.id}/archive`, { method: "PATCH", userId: users.manager.id, body: {} })).status).toBe(200);
  expect((await api(page, `/api/documents/${doc.data.id}/restore`, { method: "PATCH", userId: users.manager.id, body: {} })).status).toBe(200);
});
