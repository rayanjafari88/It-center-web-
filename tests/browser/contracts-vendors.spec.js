const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("vendors and contracts create, relate, edit, archive and restore", async ({ page }) => {
  await loginByStorage(page, users.manager);

  await openModule(page, "Vendors");
  const vendor = await api(page, "/api/vendors", {
    method: "POST",
    userId: users.manager.id,
    body: { name: "QA_AUTO Browser Vendor", category: "Support", status: "active", criticality: "Medium", primaryContact: "QA Contact", email: "qa.auto.vendor@example.test" }
  });
  expect(vendor.status).toBe(201);
  expect((await api(page, `/api/vendors/${vendor.data.id}`, { userId: users.manager.id })).status).toBe(200);
  expect((await api(page, `/api/vendors/${vendor.data.id}`, { method: "PATCH", userId: users.manager.id, body: { rating: 4 } })).status).toBe(200);

  await openModule(page, "Contracts");
  const contract = await api(page, "/api/contracts", {
    method: "POST",
    userId: users.manager.id,
    body: { name: "QA_AUTO Browser Contract", vendorId: vendor.data.id, status: "active", startDate: "2026-01-01", endDate: "2026-12-31", renewalDate: "2026-11-30", ownerId: users.manager.id, annualCost: 1000, currency: "USD" }
  });
  expect(contract.status).toBe(201);
  expect((await api(page, `/api/contracts/${contract.data.id}`, { userId: users.manager.id })).status).toBe(200);
  expect((await api(page, `/api/contracts/${contract.data.id}`, { method: "PATCH", userId: users.manager.id, body: { annualCost: 1250 } })).status).toBe(200);

  expect((await api(page, `/api/contracts/${contract.data.id}/archive`, { method: "PATCH", userId: users.manager.id, body: {} })).status).toBe(200);
  expect((await api(page, `/api/contracts/${contract.data.id}/restore`, { method: "PATCH", userId: users.manager.id, body: {} })).status).toBe(200);
  expect((await api(page, `/api/vendors/${vendor.data.id}/archive`, { method: "PATCH", userId: users.manager.id, body: {} })).status).toBe(200);
  expect((await api(page, `/api/vendors/${vendor.data.id}/restore`, { method: "PATCH", userId: users.manager.id, body: {} })).status).toBe(200);

  const employeeVendor = await api(page, `/api/vendors/${vendor.data.id}`, { userId: users.employeeA.id });
  expect([403, 404]).toContain(employeeVendor.status);
});
