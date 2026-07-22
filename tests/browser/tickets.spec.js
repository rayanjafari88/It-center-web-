const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("tickets workspace opens and supports status, comments, attachment, internal note privacy", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Tickets");

  const ticket = await api(page, "/api/tickets", { method: "POST", userId: users.employeeA.id, body: { description: "QA_AUTO Browser ticket", category: "Hardware & Devices / Laptop", priority: "high" } });
  expect(ticket.status).toBe(201);

  expect((await api(page, `/api/tickets/${ticket.data.id}`, { userId: users.manager.id })).status).toBe(200);
  expect((await api(page, `/api/tickets/${ticket.data.id}`, { userId: users.staff.id })).status).toBe(200);
  expect((await api(page, `/api/tickets/${ticket.data.id}`, { userId: users.employeeB.id })).status).toBe(403);

  expect((await api(page, `/api/tickets/${ticket.data.id}`, { method: "PATCH", userId: users.manager.id, body: { assignedToId: users.staff.id, priority: "medium" } })).status).toBe(200);
  expect((await api(page, `/api/tickets/${ticket.data.id}`, { method: "PATCH", userId: users.manager.id, body: { status: "in_progress" } })).status).toBe(200);
  expect((await api(page, "/api/comments", { method: "POST", userId: users.manager.id, body: { entityType: "ticket", entityId: ticket.data.id, body: "QA_AUTO IT public reply" } })).status).toBe(201);
  expect((await api(page, "/api/comments", { method: "POST", userId: users.manager.id, body: { entityType: "ticket", entityId: ticket.data.id, body: "QA_AUTO IT internal note", internal: true } })).status).toBe(201);
  expect((await api(page, "/api/attachments", { method: "POST", userId: users.manager.id, body: { entityType: "ticket", entityId: ticket.data.id, filename: "QA_AUTO_ticket.txt", mimeType: "text/plain", size: 2, content: "qa" } })).status).toBe(201);

  const employeeState = await api(page, "/api/state", { userId: users.employeeA.id });
  expect(JSON.stringify(employeeState.data.comments)).not.toContain("QA_AUTO IT internal note");
});
