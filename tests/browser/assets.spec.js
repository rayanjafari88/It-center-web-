const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("asset create, edit, assign, employee visibility, duplicate serial", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Assets");

  const asset = await api(page, "/api/assets", { method: "POST", userId: users.manager.id, body: { assetName: "QA_AUTO Browser Asset", name: "QA_AUTO Browser Asset", category: "Laptop", serialNumber: "QA_AUTO_BROWSER_SERIAL", location: "QA Lab", status: "available" } });
  expect(asset.status).toBe(201);

  expect((await api(page, `/api/assets/${asset.data.id}`, { method: "PATCH", userId: users.manager.id, body: { location: "QA Lab Updated" } })).status).toBe(200);
  expect((await api(page, "/api/assets", { method: "POST", userId: users.manager.id, body: { assetName: "QA_AUTO Duplicate", name: "QA_AUTO Duplicate", category: "Laptop", serialNumber: "QA_AUTO_BROWSER_SERIAL" } })).status).toBe(409);
  expect((await api(page, "/api/transfers", { method: "POST", userId: users.manager.id, body: { assetId: asset.data.id, movementType: "assign", toEmployeeId: "QA_AUTO_emp_a", assignmentDate: "2026-08-01", notes: "QA_AUTO assign asset" } })).status).toBe(201);

  const employeeState = await api(page, "/api/state", { userId: users.employeeA.id });
  expect(JSON.stringify(employeeState.data.assets)).toContain(asset.data.id);
});
