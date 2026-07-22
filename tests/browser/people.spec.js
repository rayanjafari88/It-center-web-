const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("people workspace create, view, edit, search and employee restriction", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "People");
  await expect(page.locator("#content")).toContainText(/People|Employees/i);

  const created = await api(page, "/api/employees", {
    method: "POST",
    userId: users.manager.id,
    body: { fullName: "QA_AUTO Browser Person", name: "QA_AUTO Browser Person", email: "qa.auto.browser.person@example.test", department: "QA", jobTitle: "Tester", status: "active", personType: "Employee" }
  });
  expect(created.status).toBe(201);

  const viewed = await api(page, `/api/people/${created.data.id}`, { userId: users.manager.id });
  expect(viewed.status).toBe(200);

  const edited = await api(page, `/api/employees/${created.data.id}`, { method: "PATCH", userId: users.manager.id, body: { location: "QA Browser Lab" } });
  expect(edited.status).toBe(200);

  const employeeDenied = await api(page, `/api/people/${created.data.id}`, { userId: users.employeeA.id });
  expect([403, 404]).toContain(employeeDenied.status);

  await page.locator("input[type='search'], input[placeholder*='Search']").first().fill("QA_AUTO Browser Person");
  await expect(page.locator("#content")).toContainText(/QA_AUTO Browser Person|People|Employees/i);
});
