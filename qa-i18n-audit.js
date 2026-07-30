// Renders every module (and every workspace tab) in Arabic for each role and
// reports visible Latin-script text, so untranslated UI chrome can be found.
const { chromium } = require("@playwright/test");
const fs = require("fs");
const BASE = "http://localhost:4173";

const ROLES = {
  user_admin: ["dashboard", "users", "roles", "employees", "assets", "transfers", "tickets", "tasks",
    "contracts", "vendors", "documents", "attachments", "comments", "notifications", "knowledge_base",
    "archive_center", "trash", "form_templates", "audit_logs", "timeline", "lookup_items", "settings",
    "profile", "preferences", "notification_preferences"],
  user_manager: ["dashboard", "tickets", "tasks", "employees", "assets", "knowledge_base", "documents",
    "contracts", "vendors", "settings", "notifications"],
  user_staff: ["dashboard", "tickets", "tasks", "employees", "assets", "knowledge_base", "documents", "notifications"],
  user_employee: ["employee_portal", "tickets", "assets", "tasks", "archived_tasks", "documents",
    "knowledge_base", "profile", "preferences", "notification_preferences"]
};

// Text that is data, not chrome: names, codes, emails, numbers.
const DATA_LIKE = [
  /^[A-Z]{2,4}-\d+$/,               // TCK-1014, AST-0001
  /^\S+@\S+$/,                      // emails
  /^v?\d+(\.\d+)*$/,                // versions
  /^\d[\d\s.,:/-]*$/,               // pure numbers/dates
  /^[؀-ۿ\s]+$/            // already Arabic
];

const probe = () => {
  const out = [];
  const push = (text, cls, kind) => {
    const t = String(text || "").replace(/\s+/g, " ").trim();
    if (!t || t.length > 90) return;
    if (!/[A-Za-z]/.test(t)) return;
    out.push({ text: t, cls: String(cls || "").slice(0, 40), kind });
  };
  document.querySelectorAll("#content *, .sidebar *, .topbar *, #menuHost *, #dialogHost *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    if (el.firstChild && el.firstChild.nodeType === 3) {
      // only the element's own leading text node
      push(el.firstChild.nodeValue, el.className, el.tagName);
    }
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      push(el.placeholder, el.className, "placeholder");
      if (el.value && el.type !== "password") push(el.value, el.className, "value");
    }
    if (el.tagName === "OPTION") push(el.textContent, el.className, "option");
    const aria = el.getAttribute && el.getAttribute("aria-label");
    if (aria) push(aria, el.className, "aria-label");
    if (el.title) push(el.title, el.className, "title");
  });
  return out;
};

(async () => {
  const browser = await chromium.launch();
  const findings = [];
  for (const [user, pages] of Object.entries(ROLES)) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((u) => {
      localStorage.setItem("itcc.userId", u);
      localStorage.setItem("itcc.theme", "light");
      localStorage.setItem("itcc.lang", "ar");
    }, user);
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForFunction(() => typeof state !== "undefined" && state.db && state.user);
    for (const p of pages) {
      await page.evaluate((x) => { state.detail = null; state.page = x; render(); }, p);
      await page.waitForTimeout(320);
      (await page.evaluate(probe)).forEach((r) => findings.push({ user, page: p, tab: "-", ...r }));
      // walk workspace tabs
      const item = page.locator(".ticket-workspace-item, .standard-workspace-item, .asset-workspace-item, .knowledge-workspace-item, .vendor-workspace-item, .contract-workspace-item, .task-workspace-item").first();
      if (await item.count()) { await item.click().catch(() => {}); await page.waitForTimeout(300); }
      const tabs = page.locator(".workspace-tabs button, .tabs button");
      const n = Math.min(await tabs.count(), 8);
      for (let i = 0; i < n; i++) {
        const label = (await tabs.nth(i).innerText().catch(() => "?")).trim();
        await tabs.nth(i).click().catch(() => {});
        await page.waitForTimeout(260);
        (await page.evaluate(probe)).forEach((r) => findings.push({ user, page: p, tab: label, ...r }));
      }
    }
    await ctx.close();
  }
  await browser.close();

  const isData = (t) => DATA_LIKE.some((re) => re.test(t));
  const counts = new Map();
  for (const f of findings) {
    if (isData(f.text)) continue;
    const key = f.text;
    if (!counts.has(key)) counts.set(key, { text: f.text, n: 0, where: new Set(), cls: new Set() });
    const e = counts.get(key);
    e.n++;
    e.where.add(`${f.user.replace("user_", "")}/${f.page}${f.tab !== "-" ? ":" + f.tab : ""}`);
    e.cls.add(f.kind + (f.cls ? "." + f.cls : ""));
  }
  const rows = [...counts.values()].sort((a, b) => b.n - a.n)
    .map((e) => ({ text: e.text, hits: e.n, where: [...e.where].slice(0, 3), cls: [...e.cls].slice(0, 2) }));
  fs.writeFileSync("i18n-report.json", JSON.stringify(rows, null, 1));
  console.log("distinct Latin strings still shown in Arabic mode: " + rows.length);
  console.log(rows.slice(0, 60).map((r) => `  ${String(r.hits).padStart(3)}x  ${r.text}`).join("\n"));
})();
