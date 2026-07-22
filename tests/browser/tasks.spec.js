const { test, expect } = require("@playwright/test");
const { users, loginByStorage, api, openModule } = require("./helpers");

test("personal task status flow and privacy", async ({ page }) => {
  await loginByStorage(page, users.employeeA);
  await openModule(page, "My Tasks");

  const task = await api(page, "/api/tasks", { method: "POST", userId: users.employeeA.id, body: { title: "QA_AUTO Personal browser task", category: "Personal", priority: "Medium", dueDate: "2026-08-10", recurrence: "One time" } });
  expect(task.status).toBe(201);
  expect(task.data.scope).toBe("personal");

  expect((await api(page, `/api/tasks/${task.data.id}`, { method: "PATCH", userId: users.employeeA.id, body: { status: "in_progress" } })).status).toBe(200);
  expect((await api(page, `/api/tasks/${task.data.id}`, { method: "PATCH", userId: users.employeeA.id, body: { status: "completed" } })).status).toBe(200);
  expect((await api(page, `/api/tasks/${task.data.id}`, { userId: users.staff.id })).status).toBe(403);
  expect((await api(page, `/api/tasks/${task.data.id}`, { userId: users.manager.id })).status).toBe(403);
  expect((await api(page, `/api/tasks/${task.data.id}`, { userId: users.admin.id })).status).toBe(403);
  expect((await api(page, `/api/tasks/${task.data.id}`, { userId: users.employeeB.id })).status).toBe(403);

  const cancelled = await api(page, "/api/tasks", { method: "POST", userId: users.employeeA.id, body: { title: "QA_AUTO Cancelled browser task", category: "Personal", priority: "Low" } });
  expect(cancelled.status).toBe(201);
  expect((await api(page, `/api/tasks/${cancelled.data.id}`, { method: "PATCH", userId: users.employeeA.id, body: { status: "cancelled" } })).status).toBe(200);
});

test("work task creation and assignment", async ({ page }) => {
  await loginByStorage(page, users.manager);
  await openModule(page, "Tasks");
  const work = await api(page, "/api/tasks", { method: "POST", userId: users.manager.id, body: { title: "QA_AUTO Work browser task", ownerId: users.manager.id, assignedToId: users.staff.id, category: "Work", priority: "High", dueDate: "2026-08-12", recurrence: "One time" } });
  expect(work.status).toBe(201);
  expect(work.data.assignedToId).toBe(users.staff.id);
});
