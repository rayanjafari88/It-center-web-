const childProcess = require("child_process");
const fs = require("fs");
const {
  ROOT,
  DATA_FILE,
  PREFIX,
  seedQaRecords,
  cleanupQaRecords,
  startServer,
  waitForServer,
  stopServer,
  makeContext,
  assert,
  assertStatus,
  includesQaPrefix,
  writeReportFiles,
  qaIds
} = require("./qa-lib");

const selectedSuite = valueFor("--suite") || "all";
const PORT = Number(process.env.QA_PORT || 4317);
const BASE_URL = `http://127.0.0.1:${PORT}`;

function valueFor(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : "";
}

function test(id, suite, module, role, severity, fn, details = {}) {
  return { id, suite, module, role, severity, fn, ...details };
}

async function run() {
  const results = [];
  let server;
  let cleanupResult = { remaining: true };
  const originalDbText = fs.readFileSync(DATA_FILE, "utf8");
  const gitBranch = safeCommand("git", ["branch", "--show-current"]).trim() || "unknown";
  const gitCommit = safeCommand("git", ["rev-parse", "--short", "HEAD"]).trim() || "unknown";

  try {
    seedQaRecords();
    server = startServer(PORT);
    await waitForServer(BASE_URL);
    const ctx = makeContext(BASE_URL);
    const tests = allTests().filter((item) => selectedSuite === "all" || item.suite === selectedSuite);
    for (const item of tests) {
      try {
        await item.fn(ctx);
        results.push({ ...withoutFn(item), status: "passed", message: "Executed" });
      } catch (error) {
        const blocked = item.suite === "browser" && item.id.toLowerCase().includes("manual");
        results.push({ ...withoutFn(item), status: blocked ? "blocked" : "failed", message: error.message, evidence: error.stack });
      }
    }
  } catch (error) {
    results.push({ id: "QA-RUNNER-BOOT", suite: "regression", module: "QA Harness", role: "All", severity: "Blocker", status: "failed", message: error.message, evidence: error.stack });
  } finally {
    if (server) stopServer(server.proc);
    cleanupResult = cleanupQaRecords();
    fs.writeFileSync(DATA_FILE, originalDbText);
    cleanupResult.remaining = fs.readFileSync(DATA_FILE, "utf8").includes(PREFIX);
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    gitBranch,
    gitCommit,
    environment: `Node ${process.version} on ${process.platform}`,
    serverUrl: BASE_URL,
    browserStatus: selectedSuite === "browser" || selectedSuite === "all" ? "Manual checklist generated; automated browser tool not invoked by this Node runner." : "Not requested in this run.",
    cleanupRemaining: cleanupResult.remaining
  };
  const report = writeReportFiles(results, meta);
  console.log(`QA suite: ${selectedSuite}`);
  console.log(`Server URL: ${BASE_URL}`);
  console.log(`Total: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`Blocked: ${report.summary.blocked}`);
  console.log(`Recommendation: ${report.summary.recommendation}`);
  console.log(`Cleanup: ${cleanupResult.remaining ? "FAILED" : "PASSED"}`);
  if (report.summary.failed > 0 || cleanupResult.remaining) process.exitCode = 1;
}

function withoutFn(item) {
  const copy = { ...item };
  delete copy.fn;
  return copy;
}

function safeCommand(cmd, args) {
  try {
    return childProcess.execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch (_) {
    return "";
  }
}

function allTests() {
  return [
    ...apiTests(),
    ...authTests(),
    ...securityTests(),
    ...regressionTests(),
    ...browserTests()
  ];
}

function apiTests() {
  return [
    test("API-AUTH-001", "api", "Authentication", "All", "Critical", async (ctx) => {
      const ok = await ctx.api({ method: "POST", path: "/api/login", body: { username: "qa_auto_manager", password: ctx.password } });
      assertStatus(ok, 200, "QA manager login succeeds");
      const bad = await ctx.api({ method: "POST", path: "/api/login", body: { username: "qa_auto_manager", password: "wrong" } });
      assertStatus(bad, 401, "Invalid login is rejected");
    }),
    test("API-STATE-001", "api", "State", "All", "Critical", async (ctx) => {
      for (const userId of Object.values(qaIds).filter((id) => id.includes("_user_"))) {
        const res = await ctx.api({ path: "/api/state", userId });
        assertStatus(res, 200, `State loads for ${userId}`);
        assert(res.data.meta && Array.isArray(res.data.tickets) && Array.isArray(res.data.tasks), `State payload has core collections for ${userId}`);
      }
    }),
    test("API-USERS-001", "api", "User Accounts", "System Admin", "High", async (ctx) => {
      const created = await ctx.asAdmin({ method: "POST", path: "/api/users", body: { name: `${PREFIX} Created User`, username: "qa_auto_created_user", email: "qa.auto.created.user@example.test", password: "QA_AUTO_created123!", roleId: "role_employee", status: "active", accountType: "Temporary" } });
      assertStatus(created, 201, "Admin can create user");
      const patched = await ctx.asAdmin({ method: "PATCH", path: `/api/users/${created.data.id}`, body: { status: "disabled" } });
      assertStatus(patched, 200, "Admin can update user");
    }),
    test("API-EMPLOYEES-001", "api", "People", "IT Manager", "High", async (ctx) => {
      const created = await ctx.asManager({ method: "POST", path: "/api/employees", body: { fullName: `${PREFIX} Person`, name: `${PREFIX} Person`, employeeNo: `QA-${Date.now()}`, email: "qa.auto.person@example.test", department: "QA", jobTitle: "Tester", status: "active", personType: "Employee" } });
      assertStatus(created, 201, "Manager can create employee");
      const patched = await ctx.asManager({ method: "PATCH", path: `/api/employees/${created.data.id}`, body: { location: "QA Lab Updated" } });
      assertStatus(patched, 200, "Manager can edit employee");
    }),
    test("API-CRUD-001", "api", "Core Modules", "IT Manager", "High", async (ctx) => {
      const vendor = await ctx.asManager({ method: "POST", path: "/api/vendors", body: { name: `${PREFIX} Vendor`, category: "Support", status: "active", criticality: "Medium", primaryContact: "QA Contact", email: "qa.vendor@example.test" } });
      assertStatus(vendor, 201, "Create vendor");
      const contract = await ctx.asManager({ method: "POST", path: "/api/contracts", body: { name: `${PREFIX} Contract`, vendorId: vendor.data.id, status: "active", startDate: "2026-01-01", endDate: "2026-12-31", renewalDate: "2026-11-30", ownerId: qaIds.managerUser, annualCost: 1200, currency: "USD" } });
      assertStatus(contract, 201, "Create contract");
      const asset = await ctx.asManager({ method: "POST", path: "/api/assets", body: { assetName: `${PREFIX} Laptop`, name: `${PREFIX} Laptop`, category: "Laptop", serialNumber: `${PREFIX}SERIAL001`, location: "QA Lab", status: "available" } });
      assertStatus(asset, 201, "Create asset");
      const document = await ctx.asManager({ method: "POST", path: "/api/documents", body: { title: `${PREFIX} Document`, description: "QA document", category: "Policy", status: "Published", visibility: "employees", linkedType: "company" } });
      assertStatus(document, 201, "Create document");
      const kb = await ctx.asManager({ method: "POST", path: "/api/knowledge_base", body: { title: `${PREFIX} Article`, category: "QA", body: "QA article body", tags: ["qa"], published: true, status: "Published", ownerUserId: qaIds.managerUser } });
      assertStatus(kb, 201, "Create knowledge article");
      const template = await ctx.asManager({ method: "POST", path: "/api/form_templates", body: { title: `${PREFIX} Template`, name: `${PREFIX} Template`, category: "QA", status: "Published", fields: [] } });
      assertStatus(template, 201, "Create form template");
    }),
    test("API-LOOKUP-001", "api", "Lookup Management", "IT Manager", "Medium", async (ctx) => {
      const created = await ctx.asManager({ method: "POST", path: "/api/lookup_items", body: { type: `${PREFIX}type`, code: `${PREFIX}code`, nameEn: `${PREFIX} Lookup`, nameAr: "اختبار آلي", active: true, sortOrder: 999 } });
      assertStatus(created, 201, "Create lookup item");
      const patched = await ctx.asManager({ method: "PATCH", path: `/api/lookup_items/${created.data.id}`, body: { active: false } });
      assertStatus(patched, 200, "Edit lookup item");
    }),
    test("API-USERS-ROLES-002", "api", "Users/Roles", "System Admin", "High", async (ctx) => {
      const created = await ctx.asAdmin({ method: "POST", path: "/api/users", body: { name: `${PREFIX} Managed Account`, username: "qa_auto_managed_account", email: "qa.auto.managed.account@example.test", password: "QA_AUTO_initial123!", roleId: "role_staff", status: "active", accountType: "Temporary" } });
      assertStatus(created, 201, "Admin creates managed account");
      assert(!created.data.password, "Created user response does not expose password");
      assertStatus(await ctx.asAdmin({ method: "PATCH", path: `/api/users/${created.data.id}/reset-password`, body: { password: "QA_AUTO_reset123!" } }), 200, "Admin resets password");
      assertStatus(await ctx.asAdmin({ method: "PATCH", path: `/api/users/${created.data.id}/disable`, body: { reason: `${PREFIX} disable` } }), 200, "Admin disables account");
      assertStatus(await ctx.asAdmin({ method: "PATCH", path: `/api/users/${created.data.id}/unlock`, body: {} }), 200, "Admin unlocks account");
      assertStatus(await ctx.asAdmin({ method: "PATCH", path: `/api/users/${created.data.id}/change-role`, body: { roleId: "role_employee" } }), 200, "Admin changes role");
      assertStatus(await ctx.asEmployeeA({ path: "/api/users" }), 403, "Employee cannot list user accounts");
      assertStatus(await ctx.asEmployeeA({ path: "/api/roles" }), 403, "Employee cannot list roles");
    }),
    test("API-ASSIGNMENT-GROUPS-001", "api", "Assignment Groups", "IT Manager/System Admin", "High", async (ctx) => {
      assertStatus(await ctx.asEmployeeA({ path: "/api/assignment_groups" }), 403, "Employee cannot see assignment groups");
      const created = await ctx.asManager({ method: "POST", path: "/api/assignment_groups", body: { name: `${PREFIX} Infrastructure Group`, description: "QA routing group", groupType: "Infrastructure", leadUserId: qaIds.managerUser, memberUserIds: [qaIds.staffUser], active: true, canReceiveTickets: true, assignmentMethod: "Least Open Tickets" } });
      assertStatus(created, 201, "Manager creates assignment group");
      assert(created.data.memberUserIds.includes(qaIds.staffUser), "Group includes staff member");
      assertStatus(await ctx.asStaff({ path: "/api/assignment_groups" }), 200, "IT Staff can view own groups");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/assignment_groups/${created.data.id}`, body: { name: `${PREFIX} Infrastructure Group Updated`, groupType: "Infrastructure", leadUserId: qaIds.managerUser, memberUserIds: [qaIds.staffUser], assignmentMethod: "Manual Queue", active: true, canReceiveTickets: true } }), 200, "Manager updates assignment group");
    }),
    test("API-FORM-TEMPLATES-001", "api", "Form Templates", "IT Manager", "Medium", async (ctx) => {
      const created = await ctx.asManager({ method: "POST", path: "/api/form_templates", body: { title: `${PREFIX} Browser Template`, name: `${PREFIX} Browser Template`, category: "QA", status: "Draft", fields: [{ label: "Requester", type: "text" }] } });
      assertStatus(created, 201, "Manager creates form template");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/form_templates/${created.data.id}`, body: { status: "Published" } }), 200, "Manager edits form template");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/form_templates/${created.data.id}/archive`, body: {} }), 200, "Manager archives form template");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/form_templates/${created.data.id}/restore`, body: {} }), 200, "Manager restores form template");
      assertStatus(await ctx.asEmployeeA({ path: `/api/form_templates/${created.data.id}` }), 403, "Employee cannot access form template directly");
    }),
    test("API-PREFERENCES-001", "api", "Preferences", "All", "Medium", async (ctx) => {
      assertStatus(await ctx.asEmployeeA({ method: "PATCH", path: "/api/preferences/notifications", body: { tickets: false, tasks: true, assets: false, contracts: false, vendors: false } }), 200, "Employee updates notification preferences");
      assertStatus(await ctx.asEmployeeA({ method: "PATCH", path: "/api/preferences/notifications", body: { tickets: "yes" } }), 400, "Invalid notification preference payload rejected");
    }),
    test("API-TRANSFERS-001", "api", "Transfers", "IT Manager", "High", async (ctx) => {
      const asset = await ctx.asManager({ method: "POST", path: "/api/assets", body: { assetName: `${PREFIX} Transfer Asset`, name: `${PREFIX} Transfer Asset`, category: "Laptop", serialNumber: `${PREFIX}TRANSFER001`, status: "available" } });
      assertStatus(asset, 201, "Create asset for transfer");
      const assign = await ctx.asManager({ method: "POST", path: "/api/transfers", body: { assetId: asset.data.id, movementType: "assign", toEmployeeId: qaIds.employeeA, assignmentDate: "2026-08-01", notes: `${PREFIX} assignment` } });
      assertStatus(assign, 201, "Manager creates transfer");
      const updatedAsset = await ctx.asManager({ path: `/api/assets/${asset.data.id}` });
      assertStatus(updatedAsset, 200, "Manager opens transferred asset");
      assert(updatedAsset.data.currentOwnerId === qaIds.employeeA || updatedAsset.data.currentHolderId === qaIds.employeeA, "Transfer updates asset holder");
      assertStatus(await ctx.asEmployeeB({ path: `/api/transfers/${assign.data.id}` }), 403, "Unrelated employee cannot open transfer");
    })
  ];
}

function securityTests() {
  return [
    test("SEC-EMPLOYEE-ISOLATION-001", "security", "Tickets", "Employee", "Critical", async (ctx) => {
      const ticketB = await ctx.asEmployeeB({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} Employee B private ticket`, category: "General Questions", priority: "medium", status: "open" } });
      assertStatus(ticketB, 201, "Employee B creates own ticket");
      const denied = await ctx.asEmployeeA({ path: `/api/tickets/${ticketB.data.id}` });
      assertStatus(denied, 403, "Employee A cannot open Employee B ticket");
      const stateA = await ctx.asEmployeeA({ path: "/api/state" });
      assert(!includesQaPrefix(stateA.data.tickets), "Employee A state does not include Employee B QA ticket");
    }),
    test("SEC-ASSET-ISOLATION-001", "security", "Assets", "Employee", "Critical", async (ctx) => {
      const asset = await ctx.asManager({ method: "POST", path: "/api/assets", body: { assetName: `${PREFIX} Employee B Phone`, name: `${PREFIX} Employee B Phone`, category: "Mobile", serialNumber: `${PREFIX}ASSETB001`, status: "assigned", currentOwnerId: qaIds.employeeB } });
      assertStatus(asset, 201, "Manager creates Employee B asset");
      const denied = await ctx.asEmployeeA({ path: `/api/assets/${asset.data.id}` });
      assertStatus(denied, 403, "Employee A cannot open Employee B asset");
    }),
    test("SEC-PERSONAL-TASK-001", "security", "Tasks", "Employee/IT", "Critical", async (ctx) => {
      const task = await ctx.asEmployeeB({ method: "POST", path: "/api/tasks", body: { title: `${PREFIX} Employee B Personal Task`, category: "Personal", priority: "Low", dueDate: "2026-08-01", recurrence: "One time" } });
      assertStatus(task, 201, "Employee B creates personal task");
      for (const userId of [qaIds.managerUser, qaIds.staffUser, qaIds.adminUser]) {
        const denied = await ctx.api({ path: `/api/tasks/${task.data.id}`, userId });
        assertStatus(denied, 403, `${userId} cannot access employee personal task`);
      }
      const owner = await ctx.asEmployeeB({ path: `/api/tasks/${task.data.id}` });
      assertStatus(owner, 200, "Owning employee can access personal task");
    }),
    test("SEC-TASK-FIELDS-001", "security", "Tasks", "Employee", "High", async (ctx) => {
      const task = await ctx.asEmployeeA({ method: "POST", path: "/api/tasks", body: { title: `${PREFIX} Protected Field Task`, category: "Personal", priority: "Low" } });
      assertStatus(task, 201, "Employee creates task");
      const denied = await ctx.asEmployeeA({ method: "PATCH", path: `/api/tasks/${task.data.id}`, body: { archivedAt: "2026-01-01T00:00:00.000Z" } });
      assertStatus(denied, 403, "Employee cannot patch protected task fields");
    }),
    test("SEC-AUDIT-001", "security", "Audit Feed", "Employee", "Critical", async (ctx) => {
      const denied = await ctx.asEmployeeA({ path: "/api/audit_logs" });
      assertStatus(denied, 403, "Employee cannot access audit logs");
    }),
    test("SEC-KB-DOC-READONLY-001", "security", "Knowledge/Documents", "Employee", "High", async (ctx) => {
      const kbComment = await ctx.asEmployeeA({ method: "POST", path: "/api/comments", body: { entityType: "knowledge_base", entityId: "kb_001", body: `${PREFIX} forbidden comment` } });
      assertStatus(kbComment, 403, "Employee cannot comment on KB");
      const docAttachment = await ctx.asEmployeeA({ method: "POST", path: "/api/attachments", body: { entityType: "document", entityId: "doc_employee_handbook", filename: `${PREFIX}x.txt`, content: "qa" } });
      assertStatus(docAttachment, 403, "Employee cannot upload document attachment");
    }),
    test("SEC-COMMENTS-ATTACHMENTS-002", "security", "Comments/Attachments", "Employee/IT", "Critical", async (ctx) => {
      const ownTicket = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} own ticket for comments`, category: "General Questions", priority: "medium" } });
      assertStatus(ownTicket, 201, "Employee creates own ticket");
      assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/comments", body: { entityType: "ticket", entityId: ownTicket.data.id, body: `${PREFIX} employee public comment` } }), 201, "Employee comments on own ticket");
      assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/attachments", body: { entityType: "ticket", entityId: ownTicket.data.id, filename: `${PREFIX}own.txt`, mimeType: "text/plain", size: 2, content: "qa" } }), 201, "Employee uploads attachment to own ticket");
      const otherTicket = await ctx.asEmployeeB({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} other ticket for comments`, category: "General Questions", priority: "medium" } });
      assertStatus(otherTicket, 201, "Other employee creates ticket");
      assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/comments", body: { entityType: "ticket", entityId: otherTicket.data.id, body: `${PREFIX} forbidden cross comment` } }), 403, "Employee cannot comment on another employee ticket");
      assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/attachments", body: { entityType: "ticket", entityId: otherTicket.data.id, filename: `${PREFIX}cross.txt`, content: "qa" } }), 403, "Employee cannot attach to another employee ticket");
      assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/comments", body: { entityType: "ticket", entityId: ownTicket.data.id, body: `${PREFIX} forbidden internal`, internal: true } }), 403, "Employee cannot create internal notes");
    }),
    test("SEC-NOTIFICATIONS-002", "security", "Notifications", "Employee/IT Manager", "High", async (ctx) => {
      const ticket = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} notification privacy ticket`, category: "General Questions", priority: "high" } });
      assertStatus(ticket, 201, "Ticket creates manager notification");
      const managerState = await ctx.asManager({ path: "/api/state" });
      const note = managerState.data.notifications.find((item) => JSON.stringify(item).includes(ticket.data.id));
      assert(note, "Manager has related notification");
      assertStatus(await ctx.asEmployeeB({ method: "PATCH", path: `/api/notifications/${note.id}/read`, body: {} }), 403, "Unrelated employee cannot mark manager notification read");
      assertStatus(await ctx.asEmployeeB({ method: "DELETE", path: `/api/notifications/${note.id}` }), 403, "Unrelated employee cannot delete manager notification");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/notifications/${note.id}/read`, body: {} }), 200, "Manager can mark own visible notification read");
    }),
    test("SEC-RBAC-PAGES-002", "security", "RBAC", "All Roles", "Critical", async (ctx) => {
      const stateAdmin = await ctx.asAdmin({ path: "/api/state" });
      const stateManager = await ctx.asManager({ path: "/api/state" });
      const stateStaff = await ctx.asStaff({ path: "/api/state" });
      const stateEmployee = await ctx.asEmployeeA({ path: "/api/state" });
      for (const res of [stateAdmin, stateManager, stateStaff, stateEmployee]) assertStatus(res, 200, "Role state loads");
      assert(stateAdmin.data.users.length >= stateManager.data.users.length, "Admin has broad user visibility");
      assert(!JSON.stringify(stateEmployee.data.auditLogs || []).includes("audit"), "Employee state does not expose audit logs");
      assert(!JSON.stringify(stateEmployee.data.users || []).includes("QA_AUTO Manager"), "Employee state does not expose IT user directory");
      assertStatus(await ctx.asEmployeeA({ path: "/api/audit_logs" }), 403, "Employee direct audit list denied");
      assertStatus(await ctx.asStaff({ path: "/api/users" }), 403, "IT Staff direct user account list denied");
    })
  ];
}

// Restores auto assignment to its default disabled state so later tests are unaffected.
async function resetTicketAssignment(ctx) {
  await ctx.asManager({
    method: "PATCH",
    path: "/api/settings/ticket-assignment",
    body: { enabled: false, strategy: "manual", fallbackAssigneeId: "", categoryAssignees: {}, categoryRoutes: {} }
  });
}

function authTests() {
  return [
    test("SEC-AUTH-001", "security", "Authentication", "Anonymous", "Blocker", async (ctx) => {
      // The pre-session build served the whole dataset to anyone who asked.
      const state = await ctx.anonymous({ path: "/api/state" });
      assertStatus(state, 401, "Anonymous request cannot read application state");
      const tickets = await ctx.anonymous({ path: "/api/tickets" });
      assertStatus(tickets, 401, "Anonymous request cannot list tickets");
      const employees = await ctx.anonymous({ path: "/api/employees" });
      assertStatus(employees, 401, "Anonymous request cannot list people");
    }),
    test("SEC-AUTH-002", "security", "Authentication", "Anonymous", "Blocker", async (ctx) => {
      // A forged identity header must carry no authority at all.
      const forged = await ctx.anonymous({
        method: "POST",
        path: "/api/users",
        headers: { "x-user-id": qaIds.adminUser },
        body: { name: `${PREFIX} Forged`, username: "qa_auto_forged", email: "qa.auto.forged@example.test", password: "QA_AUTO_forged123!", roleId: "role_admin", status: "active", accountType: "Temporary" }
      });
      assertStatus(forged, 401, "Forged x-user-id header cannot create an account");
      const forgedRead = await ctx.anonymous({ path: "/api/state", headers: { "x-user-id": qaIds.adminUser } });
      assertStatus(forgedRead, 401, "Forged x-user-id header cannot read state");
    }),
    test("SEC-AUTH-003", "security", "Authentication", "All", "Critical", async (ctx) => {
      const bad = await ctx.anonymous({ method: "POST", path: "/api/login", body: { email: "qa_auto_manager", password: "wrong-password" } });
      assertStatus(bad, 401, "Wrong password is rejected");
      const good = await ctx.anonymous({ method: "POST", path: "/api/login", body: { email: "qa_auto_manager", password: ctx.password } });
      assertStatus(good, 200, "Correct password signs in");
      const cookie = [].concat(good.headers["set-cookie"] || []).map((value) => String(value).split(";")[0]).join("; ");
      assert(Boolean(cookie), "Sign-in returns a session cookie");
      const raw = [].concat(good.headers["set-cookie"] || []).join(";");
      assert(/HttpOnly/i.test(raw), "Session cookie is HttpOnly");
      assert(/SameSite=Strict/i.test(raw), "Session cookie is SameSite=Strict");
      assert(!JSON.stringify(good.data).includes(ctx.password), "Sign-in response never echoes the password");

      const withSession = await ctx.anonymous({ path: "/api/state", headers: { cookie } });
      assertStatus(withSession, 200, "Session cookie grants access");

      const loggedOut = await ctx.anonymous({ method: "POST", path: "/api/auth/logout", body: {}, headers: { cookie } });
      assertStatus(loggedOut, 200, "Logout succeeds");
      const afterLogout = await ctx.anonymous({ path: "/api/state", headers: { cookie } });
      assertStatus(afterLogout, 401, "Session is dead server-side after logout");
    }),
    test("SEC-AUTH-004", "security", "Authentication", "All", "Critical", async (ctx) => {
      // Codes must be single use, and an unknown address must look identical to a
      // known one so the endpoint cannot be used to enumerate staff.
      const known = await ctx.anonymous({ method: "POST", path: "/api/auth/request-code", body: { email: "qa.auto.employee.a@example.test" } });
      assertStatus(known, 200, "Code request accepted for a real address");
      const unknown = await ctx.anonymous({ method: "POST", path: "/api/auth/request-code", body: { email: "qa.auto.nobody@example.test" } });
      assertStatus(unknown, 200, "Unknown address returns the same status");
      assert(JSON.stringify(known.data) === JSON.stringify(unknown.data), "Unknown address returns an identical body");

      const wrong = await ctx.anonymous({ method: "POST", path: "/api/auth/verify-code", body: { email: "qa.auto.employee.a@example.test", code: "000000" } });
      assert(wrong.status === 401 || wrong.status === 429, "A wrong code never signs anyone in");
    }),
    test("SEC-AUTH-005", "security", "Authentication", "All", "High", async (ctx) => {
      // Secrets must never reach a client, even an administrator's own payload.
      const state = await ctx.asAdmin({ path: "/api/state" });
      assertStatus(state, 200, "Admin can read state");
      const raw = JSON.stringify(state.data);
      assert(!("sessions" in state.data), "Sessions are not exposed");
      assert(!("loginCodes" in state.data), "Login codes are not exposed");
      assert(!("authAttempts" in state.data), "Auth attempts are not exposed");
      assert(!/tokenHash|codeHash|totpSecret/.test(raw), "No auth secrets appear in the payload");
      assert(!/scrypt\$/.test(raw), "No password hashes appear in the payload");
    })
  ];
}

function regressionTests() {
  return [
    test("REG-TICKET-ROUTING-001", "regression", "Ticket Assignment", "IT Manager/Employee", "Critical", async (ctx) => {
      const configured = await ctx.asManager({
        method: "PATCH",
        path: "/api/settings/ticket-assignment",
        body: {
          enabled: true,
          strategy: "category",
          fallbackAssigneeId: qaIds.managerUser,
          categoryRoutes: {
            hardware_devices: { type: "user", id: qaIds.staffUser },
            hardware_devices_printer: { type: "user", id: qaIds.managerUser }
          }
        }
      });
      assertStatus(configured, 200, "Manager saves two-level category routing");
      try {
        const inherited = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} laptop routing`, subcategoryCode: "hardware_devices_laptop" } });
        assertStatus(inherited, 201, "Employee creates ticket under a routed main category");
        assert(inherited.data.assignedToId === qaIds.staffUser, "Subcategory with no rule inherits the main category assignee");
        assert(inherited.data.autoAssignmentMethod === "category", "Inherited route reports the category method");

        const overridden = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} printer routing`, subcategoryCode: "hardware_devices_printer" } });
        assertStatus(overridden, 201, "Employee creates ticket under an overridden subcategory");
        assert(overridden.data.assignedToId === qaIds.managerUser, "Subcategory rule overrides the main category rule");

        assert(overridden.data.mainCategoryCode === "hardware_devices", "Ticket stores its main category code");
        assert(overridden.data.category === "Hardware & Devices / Printer", "Ticket keeps a readable category label");

        const legacyLabel = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} legacy label`, category: "Hardware & Devices / Printer" } });
        assertStatus(legacyLabel, 201, "Legacy category label still resolves");
        assert(legacyLabel.data.subcategoryCode === "hardware_devices_printer", "Legacy label resolves to the migrated subcategory code");

        const unknown = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} bad category`, subcategoryCode: "not_a_real_category" } });
        assertStatus(unknown, 400, "Unknown category is rejected");

        const badRule = await ctx.asManager({ method: "PATCH", path: "/api/settings/ticket-assignment", body: { enabled: true, strategy: "category", categoryRoutes: { not_a_real_category: { type: "user", id: qaIds.staffUser } } } });
        assertStatus(badRule, 400, "Routing rule for an unknown category is rejected");

        const employeeAttempt = await ctx.asEmployeeA({ method: "PATCH", path: "/api/settings/ticket-assignment", body: { enabled: false } });
        assertStatus(employeeAttempt, 403, "Employees cannot change routing rules");
      } finally {
        await resetTicketAssignment(ctx);
      }
    }),
    test("REG-TICKET-REROUTE-001", "regression", "Ticket Assignment", "IT Manager", "High", async (ctx) => {
      const configured = await ctx.asManager({
        method: "PATCH",
        path: "/api/settings/ticket-assignment",
        body: {
          enabled: true,
          strategy: "category",
          fallbackAssigneeId: qaIds.managerUser,
          categoryRoutes: {
            hardware_devices: { type: "user", id: qaIds.staffUser },
            hardware_devices_printer: { type: "user", id: qaIds.managerUser }
          }
        }
      });
      assertStatus(configured, 200, "Routing configured for re-route test");
      try {
        const ticket = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} reroute`, subcategoryCode: "hardware_devices_laptop" } });
        assertStatus(ticket, 201, "Ticket created for re-route test");
        assert(ticket.data.assignedToId === qaIds.staffUser, "Ticket starts on the main category assignee");

        const moved = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { subcategoryCode: "hardware_devices_printer" } });
        assertStatus(moved, 200, "Manager recategorizes the ticket");
        assert(moved.data.assignedToId === qaIds.managerUser, "Auto-assigned ticket re-routes on category change");

        const manual = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { assignedToId: qaIds.staffUser } });
        assertStatus(manual, 200, "Manager assigns the ticket manually");
        assert(manual.data.autoAssigned === false, "Manual assignment clears the auto-assigned marker");

        const movedAgain = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { subcategoryCode: "hardware_devices_printer" } });
        assertStatus(movedAgain, 200, "Manager recategorizes a manually assigned ticket");
        assert(movedAgain.data.assignedToId === qaIds.staffUser, "Re-routing never overrides a manual assignment");
      } finally {
        await resetTicketAssignment(ctx);
      }
    }),
    test("REG-TICKET-ONBEHALF-001", "regression", "Tickets", "IT Staff/Employee", "Critical", async (ctx) => {
      // Requester notifications honour the employee's own preference, which an
      // earlier API test switches off - opt back in so this test is order-independent.
      assertStatus(await ctx.asEmployeeA({ method: "PATCH", path: "/api/preferences/notifications", body: { tickets: true, tasks: true, assets: false, contracts: false, vendors: false } }), 200, "Employee A opts into ticket notifications");
      const onBehalf = await ctx.asStaff({ method: "POST", path: "/api/tickets", body: { requesterId: qaIds.employeeA, description: `${PREFIX} opened on behalf`, subcategoryCode: "accounts_access_password_reset", priority: "high" } });
      assertStatus(onBehalf, 201, "IT Staff opens a ticket on behalf of an employee");
      assert(onBehalf.data.requesterId === qaIds.employeeA, "Requester is the employee, not the author");
      assert(onBehalf.data.createdById === qaIds.staffUser, "Author is recorded on the ticket");
      assert(onBehalf.data.onBehalf === true, "Ticket is flagged as created on behalf");

      const ownTicket = await ctx.asStaff({ method: "POST", path: "/api/tickets", body: { requesterId: qaIds.staffEmployee, description: `${PREFIX} own ticket`, subcategoryCode: "hardware_devices_headset" } });
      assertStatus(ownTicket, 201, "IT Staff can still raise a ticket for themselves");
      assert(ownTicket.data.onBehalf === false, "A ticket for yourself is not flagged as on behalf");

      const employeeState = await ctx.asEmployeeA({ path: "/api/state" });
      const visible = employeeState.data.tickets.find((ticket) => ticket.id === onBehalf.data.id);
      assert(Boolean(visible), "Requester sees the ticket opened for them");
      assert(employeeState.data.notifications.some((item) => item.entityId === onBehalf.data.id && item.title === "A ticket was opened for you"), "Requester is notified that a ticket was opened for them");

      const comment = await ctx.asEmployeeA({ method: "POST", path: "/api/comments", body: { entityType: "ticket", entityId: onBehalf.data.id, body: `${PREFIX} requester reply` } });
      assertStatus(comment, 201, "Requester can comment on a ticket opened for them");

      const spoofed = await ctx.asEmployeeB({ method: "POST", path: "/api/tickets", body: { requesterId: qaIds.employeeA, description: `${PREFIX} spoof attempt`, subcategoryCode: "hardware_devices_monitor" } });
      assertStatus(spoofed, 201, "Employee ticket is accepted");
      assert(spoofed.data.requesterId === qaIds.employeeB, "Employees cannot raise tickets for someone else");
      assert(spoofed.data.onBehalf === false, "Employee ticket is never flagged as on behalf");

      const noRequester = await ctx.asStaff({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} missing requester`, subcategoryCode: "hardware_devices_monitor" } });
      assertStatus(noRequester, 400, "IT ticket without a requester is rejected");

      const unknownRequester = await ctx.asStaff({ method: "POST", path: "/api/tickets", body: { requesterId: "emp_does_not_exist", description: `${PREFIX} unknown requester`, subcategoryCode: "hardware_devices_monitor" } });
      assertStatus(unknownRequester, 400, "IT ticket with an unknown requester is rejected");
    }),
    test("REG-TICKETS-001", "regression", "Tickets", "Employee/IT Manager", "Critical", async (ctx) => {
      const ticket = await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} VPN regression ticket`, category: "Network & Connectivity / VPN", priority: "high", suggestedArticleIds: ["kb_001"] } });
      assertStatus(ticket, 201, "Employee creates ticket");
      const assigned = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { assignedToId: qaIds.staffUser, priority: "medium" } });
      assertStatus(assigned, 200, "Manager assigns ticket");
      const inProgress = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { status: "in_progress" } });
      assertStatus(inProgress, 200, "Ticket moves to in progress");
      const waiting = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { status: "waiting", waitingReason: "User" } });
      assertStatus(waiting, 200, "Ticket moves to waiting with reason");
      const resolved = await ctx.asManager({ method: "PATCH", path: `/api/tickets/${ticket.data.id}`, body: { status: "resolved" } });
      assertStatus(resolved, 200, "Ticket resolves");
      const publicComment = await ctx.asManager({ method: "POST", path: "/api/comments", body: { entityType: "ticket", entityId: ticket.data.id, body: `${PREFIX} Public reply` } });
      assertStatus(publicComment, 201, "Public reply created");
      const internalNote = await ctx.asManager({ method: "POST", path: "/api/comments", body: { entityType: "ticket", entityId: ticket.data.id, body: `${PREFIX} Internal note`, internal: true } });
      assertStatus(internalNote, 201, "Internal note created");
      const attachment = await ctx.asManager({ method: "POST", path: "/api/attachments", body: { entityType: "ticket", entityId: ticket.data.id, filename: `${PREFIX}evidence.txt`, mimeType: "text/plain", size: 2, content: "qa" } });
      assertStatus(attachment, 201, "Attachment uploaded");
      const employeeState = await ctx.asEmployeeA({ path: "/api/state" });
      assert(!JSON.stringify(employeeState.data.comments).includes("Internal note"), "Employee state hides internal note");
      assert(includesQaPrefix(employeeState.data.notifications), "Employee receives related notification");
    }),
    test("REG-TASKS-001", "regression", "Tasks", "Employee/IT Manager", "Critical", async (ctx) => {
      const personal = await ctx.asEmployeeA({ method: "POST", path: "/api/tasks", body: { title: `${PREFIX} Personal Task`, category: "Personal", priority: "Medium", dueDate: "2026-08-01", recurrence: "Weekly" } });
      assertStatus(personal, 201, "Employee creates personal task");
      const start = await ctx.asEmployeeA({ method: "PATCH", path: `/api/tasks/${personal.data.id}`, body: { status: "in_progress" } });
      assertStatus(start, 200, "Employee starts personal task");
      const paused = await ctx.asEmployeeA({ method: "PATCH", path: `/api/tasks/${personal.data.id}`, body: { status: "waiting" } });
      assertStatus(paused, 200, "Employee pauses task");
      const done = await ctx.asEmployeeA({ method: "PATCH", path: `/api/tasks/${personal.data.id}`, body: { status: "completed" } });
      assertStatus(done, 200, "Employee completes task");
      const work = await ctx.asManager({ method: "POST", path: "/api/tasks", body: { title: `${PREFIX} Work Task`, ownerId: qaIds.managerUser, assignedToId: qaIds.staffUser, category: "Work", priority: "High", dueDate: "2026-08-05", recurrence: "One time" } });
      assertStatus(work, 201, "Manager creates work task");
      const assigned = await ctx.asManager({ method: "PATCH", path: `/api/tasks/${work.data.id}`, body: { assignedToId: qaIds.managerUser } });
      assertStatus(assigned, 200, "Manager reassigns work task");
    }),
    test("REG-ASSETS-001", "regression", "Assets", "IT Manager", "High", async (ctx) => {
      const asset = await ctx.asManager({ method: "POST", path: "/api/assets", body: { assetName: `${PREFIX} Lifecycle Laptop`, name: `${PREFIX} Lifecycle Laptop`, category: "Laptop", serialNumber: `${PREFIX}LIFE001`, location: "QA Storage", status: "available" } });
      assertStatus(asset, 201, "Create asset");
      const assign = await ctx.asManager({ method: "POST", path: "/api/transfers", body: { assetId: asset.data.id, movementType: "assign", toEmployeeId: qaIds.employeeA, assignmentDate: "2026-08-01", notes: `${PREFIX} assign` } });
      assertStatus(assign, 201, "Assign asset through transfer");
      const repair = await ctx.asManager({ method: "PATCH", path: `/api/assets/${asset.data.id}`, body: { status: "under_maintenance" } });
      assertStatus(repair, 200, "Move asset to maintenance");
      const archived = await ctx.asManager({ method: "PATCH", path: `/api/assets/${asset.data.id}/archive`, body: {} });
      assertStatus(archived, 200, "Archive asset");
      const restored = await ctx.asManager({ method: "PATCH", path: `/api/assets/${asset.data.id}/restore`, body: {} });
      assertStatus(restored, 200, "Restore asset");
    }),
    test("REG-KNOWLEDGE-001", "regression", "Knowledge Base", "IT Manager/Employee", "High", async (ctx) => {
      const draft = await ctx.asManager({ method: "POST", path: "/api/knowledge_base", body: { title: `${PREFIX} Draft Article`, category: "QA", body: "Draft body", tags: ["qa"], published: false, status: "Draft", ownerUserId: qaIds.managerUser } });
      assertStatus(draft, 201, "Create draft article");
      const employeeDraft = await ctx.asEmployeeA({ path: `/api/knowledge_base/${draft.data.id}` });
      assertStatus(employeeDraft, 403, "Employee cannot open unpublished article");
      const published = await ctx.asManager({ method: "PATCH", path: `/api/knowledge_base/${draft.data.id}`, body: { published: true, status: "Published" } });
      assertStatus(published, 200, "Publish article");
      const employeePublished = await ctx.asEmployeeA({ path: `/api/knowledge_base/${draft.data.id}` });
      assertStatus(employeePublished, 200, "Employee can open published article");
    }),
    test("REG-ARCHIVE-TRASH-001", "regression", "Archive/Trash", "IT Manager", "High", async (ctx) => {
      const vendor = await ctx.asManager({ method: "POST", path: "/api/vendors", body: { name: `${PREFIX} Archive Vendor`, status: "active", category: "QA" } });
      assertStatus(vendor, 201, "Create vendor");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/vendors/${vendor.data.id}/archive`, body: {} }), 200, "Archive vendor");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/vendors/${vendor.data.id}/restore`, body: {} }), 200, "Restore vendor");
      assertStatus(await ctx.asManager({ method: "PATCH", path: `/api/vendors/${vendor.data.id}/trash`, body: {} }), 200, "Trash vendor");
      const state = await ctx.asManager({ path: "/api/state" });
      assertStatus(state, 200, "State loads for trash center");
      assert(Array.isArray(state.data.trashBin), "Trash center collection is present in state");
    }),
    test("REG-VOLUME-001", "regression", "Data Volume", "IT Manager", "Medium", async (ctx) => {
      for (let i = 0; i < 8; i += 1) {
        assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/tickets", body: { description: `${PREFIX} volume ticket ${i}`, category: "General Questions", priority: "low" } }), 201, "Create volume ticket");
        assertStatus(await ctx.asEmployeeA({ method: "POST", path: "/api/tasks", body: { title: `${PREFIX} volume task ${i}`, category: "Personal", priority: "Low" } }), 201, "Create volume task");
      }
      const state = await ctx.asManager({ path: "/api/state" });
      assertStatus(state, 200, "Manager state loads after volume creation");
      assert(Array.isArray(state.data.tickets), "Tickets array is present");
    }),
    test("REG-SYNTAX-001", "regression", "Build/Syntax", "All", "Critical", async () => {
      childProcess.execFileSync(process.execPath, ["--check", "server.js"], { cwd: ROOT, stdio: "pipe" });
      childProcess.execFileSync(process.execPath, ["--check", "public/app.js"], { cwd: ROOT, stdio: "pipe" });
    }),
    test("REG-LOCALIZATION-001", "regression", "Localization", "All", "Medium", async () => {
      const fs = require("fs");
      const app = fs.readFileSync(`${ROOT}/public/app.js`, "utf8");
      assert(app.includes("dir") || app.includes("document.documentElement"), "App contains document direction handling");
      assert(app.includes("labels =") && app.includes("ar:") && app.includes("en:"), "Arabic and English dictionaries exist");
    })
  ];
}

function browserTests() {
  return [
    test("BROWSER-STATIC-001", "browser", "Browser Readiness", "All", "Medium", async (ctx) => {
      const html = await ctx.api({ path: "/" });
      assertStatus(html, 200, "Index loads");
      const app = await ctx.api({ path: "/app.js" });
      assertStatus(app, 200, "App bundle loads");
      const css = await ctx.api({ path: "/styles.css" });
      assertStatus(css, 200, "Styles load");
    }),
    test("BROWSER-MANUAL-001", "browser", "Manual Browser Checklist", "All", "Medium", async () => {
      throw new Error("Automated browser actions were not executed by the Node QA runner. Use V1_MANUAL_BROWSER_CHECKLIST.md.");
    }, { expected: "Manual checklist generated when browser automation is unavailable.", suggestedFix: "Run Playwright/in-app browser manually and update report evidence." })
  ];
}

run();
