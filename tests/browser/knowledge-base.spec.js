const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("knowledge draft privacy, publish, employee open, Arabic and English content", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Knowledge");
  const article = await api(page, "/api/knowledge_base", { method: "POST", userId: users.manager.id, body: { title: "QA_AUTO Browser Article", category: "QA", body: "English content. محتوى عربي. ".repeat(40), tags: ["qa", "browser"], published: false, status: "Draft", ownerUserId: users.manager.id } });
  expect(article.status).toBe(201);
  expect((await api(page, `/api/knowledge_base/${article.data.id}`, { userId: users.employeeA.id })).status).toBe(403);
  expect((await api(page, `/api/knowledge_base/${article.data.id}`, { method: "PATCH", userId: users.manager.id, body: { published: true, status: "Published" } })).status).toBe(200);
  expect((await api(page, `/api/knowledge_base/${article.data.id}`, { userId: users.employeeA.id })).status).toBe(200);
});
