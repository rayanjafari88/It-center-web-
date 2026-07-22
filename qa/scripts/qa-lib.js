const fs = require("fs");
const path = require("path");
const http = require("http");
const childProcess = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const DATA_FILE = path.join(ROOT, "data", "db.json");
const REPORT_DIR = path.join(ROOT, "qa", "reports");
const PREFIX = "QA_AUTO_";
const QA_PASSWORD = process.env.QA_AUTO_PASSWORD || "QA_AUTO_password123!";

const qaIds = {
  adminUser: "QA_AUTO_user_admin",
  managerUser: "QA_AUTO_user_manager",
  staffUser: "QA_AUTO_user_staff",
  employeeAUser: "QA_AUTO_user_employee_a",
  employeeBUser: "QA_AUTO_user_employee_b",
  managerEmployee: "QA_AUTO_emp_manager",
  staffEmployee: "QA_AUTO_emp_staff",
  employeeA: "QA_AUTO_emp_a",
  employeeB: "QA_AUTO_emp_b"
};

function now() {
  return new Date().toISOString();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readDb() {
  return readJson(DATA_FILE);
}

function writeDb(db) {
  writeJson(DATA_FILE, db);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function hasQaMarker(value) {
  return JSON.stringify(value).includes(PREFIX);
}

function ensureArray(db, key) {
  if (!Array.isArray(db[key])) db[key] = [];
  return db[key];
}

function upsertById(rows, row) {
  const index = rows.findIndex((item) => item.id === row.id);
  if (index >= 0) rows[index] = { ...rows[index], ...row };
  else rows.unshift(row);
}

function seedQaRecords() {
  const db = readDb();
  const employees = ensureArray(db, "employees");
  const users = ensureArray(db, "users");
  const createdAt = now();

  [
    { id: qaIds.managerEmployee, employeeNumber: "QA-AUTO-MGR", fullName: "QA_AUTO Manager", name: "QA_AUTO Manager", email: "qa.auto.manager@example.test", department: "IT", jobTitle: "IT Manager", status: "active", personType: "IT Manager", location: "QA Lab", createdAt },
    { id: qaIds.staffEmployee, employeeNumber: "QA-AUTO-STF", fullName: "QA_AUTO Staff", name: "QA_AUTO Staff", email: "qa.auto.staff@example.test", department: "IT", jobTitle: "IT Staff", status: "active", personType: "IT Staff", location: "QA Lab", createdAt },
    { id: qaIds.employeeA, employeeNumber: "QA-AUTO-EA", fullName: "QA_AUTO Employee A", name: "QA_AUTO Employee A", email: "qa.auto.employee.a@example.test", department: "Finance", jobTitle: "Analyst", status: "active", personType: "Employee", location: "QA Lab", createdAt },
    { id: qaIds.employeeB, employeeNumber: "QA-AUTO-EB", fullName: "QA_AUTO Employee B", name: "QA_AUTO Employee B", email: "qa.auto.employee.b@example.test", department: "HR", jobTitle: "Coordinator", status: "active", personType: "Employee", location: "QA Lab", createdAt }
  ].forEach((row) => upsertById(employees, row));

  [
    { id: qaIds.adminUser, name: "QA_AUTO Admin", username: "qa_auto_admin", email: "qa.auto.admin@example.test", password: QA_PASSWORD, roleId: "role_admin", status: "active", accountType: "Temporary", createdAt },
    { id: qaIds.managerUser, name: "QA_AUTO Manager", username: "qa_auto_manager", email: "qa.auto.manager@example.test", password: QA_PASSWORD, roleId: "role_manager", status: "active", accountType: "Temporary", employeeId: qaIds.managerEmployee, createdAt },
    { id: qaIds.staffUser, name: "QA_AUTO Staff", username: "qa_auto_staff", email: "qa.auto.staff@example.test", password: QA_PASSWORD, roleId: "role_staff", status: "active", accountType: "Temporary", employeeId: qaIds.staffEmployee, createdAt },
    { id: qaIds.employeeAUser, name: "QA_AUTO Employee A", username: "qa_auto_employee_a", email: "qa.auto.employee.a@example.test", password: QA_PASSWORD, roleId: "role_employee", status: "active", accountType: "Temporary", employeeId: qaIds.employeeA, createdAt },
    { id: qaIds.employeeBUser, name: "QA_AUTO Employee B", username: "qa_auto_employee_b", email: "qa.auto.employee.b@example.test", password: QA_PASSWORD, roleId: "role_employee", status: "active", accountType: "Temporary", employeeId: qaIds.employeeB, createdAt }
  ].forEach((row) => upsertById(users, row));

  writeDb(db);
  return { users: Object.keys(qaIds).filter((key) => key.endsWith("User")).length, employees: 4 };
}

function cleanupQaRecords() {
  const db = readDb();
  const keys = Object.keys(db).filter((key) => Array.isArray(db[key]));
  const qaRecordIds = new Set();
  const qaUserIds = new Set();
  for (const key of keys) {
    for (const row of db[key]) {
      if (hasQaMarker(row)) {
        if (row.id) qaRecordIds.add(row.id);
        if (key === "users" && row.id) qaUserIds.add(row.id);
      }
    }
  }
  const before = {};
  const after = {};
  for (const key of keys) {
    before[key] = db[key].length;
    db[key] = db[key].filter((row) => !isQaRelatedRow(key, row, qaRecordIds, qaUserIds));
    after[key] = db[key].length;
  }
  writeDb(db);
  const remaining = JSON.stringify(db).includes(PREFIX);
  return { before, after, removed: Object.fromEntries(keys.map((key) => [key, before[key] - after[key]])), remaining };
}

function isQaRelatedRow(key, row, qaRecordIds, qaUserIds) {
  if (hasQaMarker(row)) return true;
  if (row.id && qaRecordIds.has(row.id)) return true;
  if (row.userId && qaUserIds.has(row.userId)) return true;
  if (row.actorUserId && qaUserIds.has(row.actorUserId)) return true;
  if (row.authorId && qaUserIds.has(row.authorId)) return true;
  if (row.uploaderId && qaUserIds.has(row.uploaderId)) return true;
  if (row.requesterId && qaRecordIds.has(row.requesterId)) return true;
  if (row.currentOwnerId && qaRecordIds.has(row.currentOwnerId)) return true;
  if (row.ownerId && qaUserIds.has(row.ownerId)) return true;
  if (row.assignedToId && qaUserIds.has(row.assignedToId)) return true;
  if (row.createdBy && qaUserIds.has(row.createdBy)) return true;
  if (row.entityId && qaRecordIds.has(row.entityId)) return true;
  if (row.linkedId && qaRecordIds.has(row.linkedId)) return true;
  if (row.relatedId && qaRecordIds.has(row.relatedId)) return true;
  return false;
}

function request(baseUrl, { method = "GET", path: urlPath, userId, body, headers = {} }) {
  const target = new URL(urlPath, baseUrl);
  const payload = body === undefined ? null : JSON.stringify(body);
  const requestHeaders = { ...headers };
  if (userId) requestHeaders["x-user-id"] = userId;
  if (payload) {
    requestHeaders["content-type"] = "application/json";
    requestHeaders["content-length"] = Buffer.byteLength(payload);
  }
  return new Promise((resolve, reject) => {
    const req = http.request(target, { method, headers: requestHeaders }, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        let data = raw;
        try { data = raw ? JSON.parse(raw) : null; } catch (_) {}
        resolve({ status: res.statusCode, data, raw, headers: res.headers });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function startServer(port) {
  const proc = childProcess.spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let stdout = "";
  let stderr = "";
  proc.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
  proc.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  return { proc, getOutput: () => ({ stdout, stderr }) };
}

async function waitForServer(baseUrl, timeoutMs = 10000) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await request(baseUrl, { path: "/api/state" });
      if (res.status === 200) return true;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw lastError || new Error(`Server did not start at ${baseUrl}`);
}

function stopServer(proc) {
  if (proc && !proc.killed) proc.kill();
}

function makeContext(baseUrl) {
  return {
    baseUrl,
    ids: qaIds,
    password: QA_PASSWORD,
    api: (options) => request(baseUrl, options),
    asAdmin: (options) => request(baseUrl, { ...options, userId: qaIds.adminUser }),
    asManager: (options) => request(baseUrl, { ...options, userId: qaIds.managerUser }),
    asStaff: (options) => request(baseUrl, { ...options, userId: qaIds.staffUser }),
    asEmployeeA: (options) => request(baseUrl, { ...options, userId: qaIds.employeeAUser }),
    asEmployeeB: (options) => request(baseUrl, { ...options, userId: qaIds.employeeBUser })
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertStatus(res, expected, message) {
  if (res.status !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${res.status} (${typeof res.data === "object" ? JSON.stringify(res.data) : res.raw})`);
  }
}

function includesQaPrefix(value) {
  return JSON.stringify(value).includes(PREFIX);
}

function writeReportFiles(results, meta) {
  ensureDir(REPORT_DIR);
  const summary = summarizeResults(results);
  const payload = { meta, summary, results };
  writeJson(path.join(REPORT_DIR, "V1_TEST_RESULTS.json"), payload);
  fs.writeFileSync(path.join(REPORT_DIR, "V1_FULL_QA_REPORT.md"), fullReportMarkdown(payload));
  fs.writeFileSync(path.join(REPORT_DIR, "V1_BUGS.md"), bugsMarkdown(payload));
  fs.writeFileSync(path.join(REPORT_DIR, "V1_RBAC_MATRIX.md"), rbacMarkdown(payload));
  fs.writeFileSync(path.join(REPORT_DIR, "V1_MANUAL_BROWSER_CHECKLIST.md"), browserChecklistMarkdown(meta));
  return { summary, files: [
    "qa/reports/V1_FULL_QA_REPORT.md",
    "qa/reports/V1_BUGS.md",
    "qa/reports/V1_RBAC_MATRIX.md",
    "qa/reports/V1_MANUAL_BROWSER_CHECKLIST.md",
    "qa/reports/V1_TEST_RESULTS.json"
  ] };
}

function summarizeResults(results) {
  const summary = { total: results.length, passed: 0, failed: 0, blocked: 0, notExecuted: 0 };
  for (const result of results) {
    if (result.status === "passed") summary.passed += 1;
    else if (result.status === "failed") summary.failed += 1;
    else if (result.status === "blocked") summary.blocked += 1;
    else summary.notExecuted += 1;
  }
  summary.recommendation = summary.failed > 0 ? "NO-GO" : summary.blocked > 0 ? "CONDITIONAL GO" : "GO";
  return summary;
}

function fullReportMarkdown({ meta, summary, results }) {
  return `# V1 Full QA Report

- Date/time: ${meta.generatedAt}
- Git branch: ${meta.gitBranch}
- Git commit: ${meta.gitCommit}
- Environment: ${meta.environment}
- Server URL: ${meta.serverUrl}
- Test tools: Node.js API/security/regression runner, Playwright Chromium browser runner, syntax checks, static/manual checklist
- Total tests: ${summary.total}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Blocked: ${summary.blocked}
- Not executed: ${summary.notExecuted}
- Release recommendation: **${summary.recommendation}**
- QA data cleanup result: ${meta.cleanupRemaining ? "FAILED - QA_AUTO_ records remain" : "PASSED - no QA_AUTO_ records remain"}

## Results

| ID | Suite | Module | Role | Status | Severity | Message |
| --- | --- | --- | --- | --- | --- | --- |
${results.map((r) => `| ${r.id} | ${r.suite} | ${r.module} | ${r.role || "All"} | ${r.status} | ${r.severity || ""} | ${(r.message || "").replace(/\|/g, "\\|")} |`).join("\n")}
`;
}

function bugsMarkdown({ results }) {
  const bugs = results.filter((result) => result.status === "failed");
  if (!bugs.length) return "# V1 Bugs\n\nNo automated test failures recorded.\n";
  return `# V1 Bugs

${bugs.map((bug) => `## ${bug.id} - ${bug.module}

- Role: ${bug.role || "All"}
- Severity: ${bug.severity || "Medium"}
- Preconditions: Automated QA seed was present.
- Steps: ${bug.steps || "Run the automated QA suite."}
- Expected result: ${bug.expected || "Test passes."}
- Actual result: ${bug.message || "Test failed."}
- Evidence: ${bug.evidence || "See V1_TEST_RESULTS.json."}
- Root cause: ${bug.rootCause || "Unknown"}
- Files affected: ${bug.filesAffected || "Unknown"}
- Suggested fix: ${bug.suggestedFix || "Investigate failing path."}
- Retest status: Not retested
`).join("\n")}
`;
}

function rbacMarkdown({ results }) {
  const rbac = results.filter((result) => result.suite === "security");
  return `# V1 RBAC Matrix

| Test | System Admin | IT Manager | IT Staff | Employee |
| --- | --- | --- | --- | --- |
| API visibility and direct access | Covered | Covered | Covered | Covered |
| Employee A cannot see Employee B tickets/assets/tasks/notifications | N/A | N/A | N/A | ${rbac.some((r) => r.status === "failed") ? "Review failures" : "Passed"} |
| IT roles cannot see employee personal tasks | ${rbac.some((r) => r.id.includes("personal-task") && r.status === "failed") ? "Failed" : "Passed"} | ${rbac.some((r) => r.id.includes("personal-task") && r.status === "failed") ? "Failed" : "Passed"} | ${rbac.some((r) => r.id.includes("personal-task") && r.status === "failed") ? "Failed" : "Passed"} | Owner only |
| Employees cannot access audit logs | N/A | N/A | N/A | ${rbac.some((r) => r.id.includes("audit") && r.status === "failed") ? "Failed" : "Passed"} |

See V1_TEST_RESULTS.json for evidence.
`;
}

function browserChecklistMarkdown(meta) {
  return `# V1 Manual Browser Checklist

Automated browser execution status: ${meta.browserStatus}

Use this checklist when browser automation is unavailable or blocked.

## Core Browser Checks

- [ ] Login/logout for System Admin, IT Manager, IT Staff, Employee
- [ ] English mode uses LTR and Arabic mode uses RTL
- [ ] Sidebar navigation works for each role
- [ ] Command Center cards and quick actions navigate correctly
- [ ] Tickets: create, open, reply, internal note hidden from employee, attach file, status change
- [ ] Tasks: create, edit, status chips, filters, personal/work badges
- [ ] Assets: create, assign, return, archive, restore
- [ ] People: create/edit/open user account tab
- [ ] Documents: create, upload/download, employee visibility
- [ ] Knowledge: published visibility, suggested article open, Back to Request preserves data
- [ ] Contracts and Vendors: create/edit/open related records
- [ ] Settings: ticket assignment, assignment groups, lookup management
- [ ] Notifications: unread count, mark read, role/user isolation
- [ ] Archive Center and Trash: list and restore
- [ ] Responsive widths: 1440, 1024, 768, 390
- [ ] Keyboard focus, Escape closing overlays, modal scroll behavior
`;
}

module.exports = {
  ROOT,
  DATA_FILE,
  REPORT_DIR,
  PREFIX,
  qaIds,
  QA_PASSWORD,
  now,
  readDb,
  writeDb,
  seedQaRecords,
  cleanupQaRecords,
  request,
  startServer,
  waitForServer,
  stopServer,
  makeContext,
  assert,
  assertStatus,
  includesQaPrefix,
  writeReportFiles
};
