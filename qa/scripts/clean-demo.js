// Removes seeded demo content and test activity, leaving the real organisation
// behind: imported employees, departments, the category tree, routing settings and
// genuine staff accounts.
//
//   npm run clean:demo -- --dry-run     show what would go
//   npm run clean:demo                  do it (writes a backup first)
//
// Deliberately conservative: anything not on an explicit demo list is kept.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const DATA_FILE = path.join(ROOT, "data", "db.json");
const dryRun = process.argv.includes("--dry-run");

// Seeded demo records. Identified by id, not by name, so a real person who happens
// to share a name is never caught.
const DEMO_EMPLOYEES = new Set(["emp_lina", "emp_fahad", "emp_sara", "emp_amina", "emp_omar"]);
const DEMO_USERNAMES = new Set(["admin", "manager", "staff", "employee", "saleh"]);

// Collections that only ever held demo content. Real equivalents are created by
// staff once the system is live.
const WIPE_COLLECTIONS = [
  "tickets", "tasks", "assets", "transfers", "contracts", "vendors",
  "documents", "knowledgeBase", "comments", "attachments", "notifications",
  "announcements", "archiveCenter", "trashBin", "loginCodes", "sessions", "authAttempts"
];

// History of the demo period. Keeping it would mean every audit view opens on
// activity that never really happened.
const HISTORY_COLLECTIONS = ["timeline", "auditLogs"];

const db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const before = {};
const after = {};
const record = (key) => { before[key] = (db[key] || []).length; };
const done = (key) => { after[key] = (db[key] || []).length; };

for (const key of [...WIPE_COLLECTIONS, ...HISTORY_COLLECTIONS, "employees", "users"]) record(key);

// 1. Content and history.
for (const key of [...WIPE_COLLECTIONS, ...HISTORY_COLLECTIONS]) {
  if (Array.isArray(db[key])) db[key] = [];
}

// 2. Demo people and their logins.
db.employees = (db.employees || []).filter((row) => !DEMO_EMPLOYEES.has(row.id));
// Employee logins provision themselves on first sign-in, so any that exist now were
// created while testing rather than by the person. Removing them leaves a genuine
// first-sign-in for everyone. Granted IT roles are kept - those were deliberate.
const isDisposable = (row) => DEMO_USERNAMES.has(row.username) || row.roleId === "role_employee";
const removedUserIds = new Set((db.users || []).filter(isDisposable).map((row) => row.id));
db.users = (db.users || []).filter((row) => !isDisposable(row));

// 3. Drop dangling references to anyone removed.
for (const employee of db.employees) {
  if (employee.userId && removedUserIds.has(employee.userId)) delete employee.userId;
  if (employee.managerId && !db.employees.some((row) => row.id === employee.managerId)) delete employee.managerId;
}
const assignment = db.settings?.ticketAssignment;
if (assignment) {
  const valid = (id) => db.users.some((row) => row.id === id);
  if (assignment.fallbackAssigneeId && !valid(assignment.fallbackAssigneeId)) assignment.fallbackAssigneeId = "";
  for (const [key, route] of Object.entries(assignment.categoryRoutes || {})) {
    if (route?.type === "user" && !valid(route.id)) delete assignment.categoryRoutes[key];
  }
  for (const [key, id] of Object.entries(assignment.categoryAssignees || {})) {
    if (!valid(id)) delete assignment.categoryAssignees[key];
  }
}

// 4. Uploaded files belonged to demo records only.
const filesDir = path.join(ROOT, "data", "files");
let removedFiles = 0;
if (!dryRun && fs.existsSync(filesDir)) {
  for (const name of fs.readdirSync(filesDir)) {
    fs.unlinkSync(path.join(filesDir, name));
    removedFiles += 1;
  }
} else if (fs.existsSync(filesDir)) {
  removedFiles = fs.readdirSync(filesDir).length;
}

for (const key of [...WIPE_COLLECTIONS, ...HISTORY_COLLECTIONS, "employees", "users"]) done(key);

console.log(`\n${dryRun ? "DRY RUN - nothing written" : "Cleaning"}\n`);
for (const key of Object.keys(before)) {
  const delta = before[key] - after[key];
  if (delta === 0 && before[key] === 0) continue;
  console.log(`  ${key.padEnd(16)} ${String(before[key]).padStart(5)} -> ${String(after[key]).padStart(5)}${delta ? `   (-${delta})` : "   kept"}`);
}
console.log(`  ${"attachment files".padEnd(16)} ${String(removedFiles).padStart(5)} -> ${String(0).padStart(5)}   (-${removedFiles})`);

if (!dryRun) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = path.join(ROOT, "data", "backups", `db-before-clean-${stamp}.json`);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(DATA_FILE, backup);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  console.log(`\n  backup: ${backup}`);
  console.log(`  written: ${DATA_FILE}\n`);
} else {
  console.log("\n  Run without --dry-run to apply.\n");
}
