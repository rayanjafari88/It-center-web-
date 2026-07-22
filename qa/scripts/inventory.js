const fs = require("fs");
const path = require("path");
const { ROOT, REPORT_DIR } = require("./qa-lib");

const APP_FILE = path.join(ROOT, "public", "app.js");
const SERVER_FILE = path.join(ROOT, "server.js");
const RESULTS_FILE = path.join(REPORT_DIR, "V1_TEST_RESULTS.json");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function unique(values) {
  return [...new Set(values.filter(Boolean).filter(isUsefulToken))];
}

function extract(regex, source, group = 1) {
  return unique([...source.matchAll(regex)].map((match) => match[group]));
}

function isUsefulToken(value) {
  const token = String(value || "");
  if (!token || token.includes("${") || token.includes("}") || token.includes("(")) return false;
  if (/^(module|name|id|page|item|row|action|workflow|escapeHtml|canView|navigateTo|standardWorkspace)$/i.test(token)) return false;
  return /^[a-zA-Z0-9_-]+$/.test(token);
}

function normalizeModuleName(value) {
  return String(value || "")
    .replace(/Page$/, "")
    .replace(/Workspace$/, "")
    .replace(/Detail$/, "")
    .replace(/^employee/, "employee_")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function moduleFromToken(token) {
  return normalizeModuleName(token)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusFor(module, results) {
  const aliases = {
    login: "authentication",
    employees: "people",
    employee_s: "people",
    users: "users roles",
    roles: "users roles",
    user_accounts: "users roles",
    lookup_items: "lookup management",
    audit_logs: "audit feed",
    comments: "comments attachments",
    attachments: "comments attachments",
    assignment_groups: "assignment groups",
    form_templates: "form templates",
    preferences: "preferences",
    transfers: "transfers",
    assign: "transfers",
    transfer: "transfers",
    return: "transfers",
    repair: "assets",
    upload_attachment: "comments attachments",
    upload_document: "documents",
    publish: "knowledge base",
    ticket: "tickets",
    contract: "contracts vendors",
    add_contact: "contracts vendors",
    renew: "contracts vendors",
    security: "rbac"
  };
  const canonical = aliases[normalizeModuleName(module)] || normalizeModuleName(module);
  const clean = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const normalized = clean(canonical);
  const matching = results.filter((item) => clean(item.module).includes(normalized) || normalized.includes(clean(item.module)));
  if (!matching.length) return { status: "Not covered", test: "None", evidence: "" };
  if (matching.some((item) => item.status === "failed")) return { status: "Failed", test: matching.map((item) => item.id).join(", "), evidence: "qa/reports/playwright-artifacts when browser test failed" };
  if (matching.some((item) => item.suite === "browser")) return { status: "Automated browser covered", test: matching.map((item) => item.id).join(", "), evidence: "qa/reports/playwright-results.json" };
  return { status: "Automated API/security covered", test: matching.map((item) => item.id).join(", "), evidence: "qa/reports/V1_TEST_RESULTS.json" };
}

function row(id, module, page, role, action, expected, api, coverage) {
  return { id, module, page, role, action, expected, api, ...coverage };
}

function markdownTable(rows) {
  return `| Function ID | Module | Page | Role | Action | Expected result | API involved | Automated test name | Test status | Evidence path |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.map((item) => `| ${item.id} | ${item.module} | ${item.page} | ${item.role} | ${item.action} | ${item.expected} | ${item.api} | ${item.test} | ${item.status} | ${item.evidence} |`).join("\n")}`;
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const app = read(APP_FILE);
  const server = read(SERVER_FILE);
  const results = fs.existsSync(RESULTS_FILE) ? JSON.parse(read(RESULTS_FILE)).results || [] : [];

  const pages = unique([
    ...extract(/data-page="([^"]+)"/g, app),
    ...extract(/data-page-jump="([^"]+)"/g, app),
    ...extract(/function\s+([a-zA-Z0-9_]+Page)\s*\(/g, app)
  ]).filter((page) => !/^(can_view|navigate_to|standard|detail|table|board|card|toolbar|empty|section|profile|preferences|notifications)$/i.test(normalizeModuleName(page)));
  const tabs = extract(/data-tab="([^"]+)"/g, app);
  const buttons = unique([
    ...extract(/data-add="([^"]+)"/g, app),
    ...extract(/data-edit="([^"]+)"/g, app),
    ...extract(/data-archive="([^"]+)"/g, app),
    ...extract(/data-trash="([^"]+)"/g, app),
    ...extract(/data-restore="([^"]+)"/g, app),
    ...extract(/data-[a-z-]*workflow="([^"]+)"/g, app)
  ]);
  const endpoints = extract(/resource\s*===\s*"([^"]+)"/g, server);
  const methods = ["GET", "POST", "PATCH", "DELETE"].filter((method) => server.includes(`req.method === "${method}"`));
  const roles = ["System Admin", "IT Manager", "IT Staff", "Employee"];

  const rows = [];
  let index = 1;
  for (const page of pages) {
    const module = page.endsWith("Page") ? page.replace(/Page$/, "") : page;
    rows.push(row(`INV-${String(index++).padStart(4, "0")}`, moduleFromToken(module), module, "Role-based", "Open page/navigation item", "Page renders only for permitted roles", "GET /api/state", statusFor(module, results)));
  }
  for (const tab of tabs) {
    rows.push(row(`INV-${String(index++).padStart(4, "0")}`, moduleFromToken(tab), "Workspace tab", "Permitted users", `Open ${tab} tab`, "Tab content renders or is marked not applicable", "GET /api/state", statusFor(tab, results)));
  }
  for (const action of buttons) {
    rows.push(row(`INV-${String(index++).padStart(4, "0")}`, moduleFromToken(action), "Workspace/modal", "Permitted users", `Trigger ${action} action`, "Action opens modal, updates record, or shows clear unavailable message", "Module REST endpoint", statusFor(action, results)));
  }
  for (const endpoint of endpoints) {
    const coverage = statusFor(endpoint, results);
    rows.push(row(`INV-${String(index++).padStart(4, "0")}`, moduleFromToken(endpoint), "API", "Role-based", `${methods.join("/")} ${endpoint}`, "Endpoint enforces validation and RBAC", `/api/${endpoint}`, coverage));
  }
  for (const role of roles) {
    rows.push(row(`INV-${String(index++).padStart(4, "0")}`, "RBAC", "All", role, "Role-restricted navigation and direct access", "Forbidden modules and records are hidden or denied", "GET /api/state + direct record APIs", statusFor("security", results)));
  }
  rows.push(row(`INV-${String(index++).padStart(4, "0")}`, "Localization", "All", "All", "Arabic/English UI state", "Arabic uses RTL, English uses LTR, persistence survives refresh", "localStorage + UI render", statusFor("localization", results)));
  rows.push(row(`INV-${String(index++).padStart(4, "0")}`, "Responsive", "All", "All", "Viewport smoke checks", "No horizontal overflow and controls remain reachable", "Browser viewport", statusFor("responsive", results)));
  rows.push(row(`INV-${String(index++).padStart(4, "0")}`, "Accessibility", "All", "All", "Keyboard/labels/dialog smoke", "Basic keyboard and accessible-name behavior works", "Browser UI", statusFor("accessibility", results)));

  const covered = rows.filter((item) => item.status !== "Not covered").length;
  const failed = rows.filter((item) => item.status === "Failed").length;
  const notCovered = rows.filter((item) => item.status === "Not covered").length;
  const partial = rows.length - covered - notCovered;

  const inventory = `# V1 Function Inventory\n\nGenerated from implemented SPA markup, server resource handlers, and latest QA results.\n\n- Total inventoried functions: ${rows.length}\n- Automated/partial coverage references: ${covered}\n- Failed covered functions: ${failed}\n- Not covered: ${notCovered}\n- Static inventory source: public/app.js and server.js\n\nImportant: Inventory entries are not counted as browser passes unless their Test Status references an executed Playwright browser test.\n\n${markdownTable(rows)}\n`;

  const matrix = `# V1 Test Matrix\n\nThis matrix maps implemented functions to executed evidence. Static discovery is used only to identify functions.\n\n## Coverage Summary\n\n- Total inventoried functions: ${rows.length}\n- Automated functions covered or partially covered: ${covered}\n- Failed covered functions: ${failed}\n- Not covered: ${notCovered}\n- Not applicable: Unsupported operations are marked in Expected result when a visible operation is not implemented.\n\n${markdownTable(rows)}\n`;

  fs.writeFileSync(path.join(REPORT_DIR, "V1_FUNCTION_INVENTORY.md"), inventory);
  fs.writeFileSync(path.join(REPORT_DIR, "V1_TEST_MATRIX.md"), matrix);
  console.log(`Inventory functions: ${rows.length}`);
  console.log(`Covered references: ${covered}`);
  console.log(`Failed covered functions: ${failed}`);
  console.log(`Not covered: ${notCovered}`);
}

main();
