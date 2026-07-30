// Opens every overlay in Arabic by calling the app's own functions (no UI
// clicking, which is slow and blocks on actionability) and reports interface
// text still rendered in Latin script.
const { chromium } = require("@playwright/test");
const fs = require("fs");
const BASE = "http://localhost:4173";
const MODULES = ["tickets", "tasks", "assets", "employees", "contracts", "vendors", "documents", "users", "knowledge_base", "form_templates"];

(async () => {
  const browser = await chromium.launch();
  const findings = [];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  await ctx.addInitScript(() => {
    localStorage.setItem("itcc.userId", "user_admin");
    localStorage.setItem("itcc.theme", "dark");
    localStorage.setItem("itcc.lang", "ar");
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => findings.push({ where: "pageerror", text: e.message }));
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForFunction(() => typeof state !== "undefined" && state.db && state.user);

  const probe = () => {
    const out = [];
    document.querySelectorAll("#dialogHost *, #menuHost *, #modalHost *, .modal-backdrop *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const add = (t) => {
        const v = String(t || "").replace(/\s+/g, " ").trim();
        if (!v || v.length > 110 || !/[A-Za-z]/.test(v)) return;
        if (/^[A-Z]{2,4}-\d+$/.test(v) || /^\S+@\S+$/.test(v)) return;
        out.push(v);
      };
      if (el.firstChild && el.firstChild.nodeType === 3) add(el.firstChild.nodeValue);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") add(el.placeholder);
      if (el.tagName === "OPTION") add(el.textContent);
    });
    return out;
  };

  const run = async (label, fn) => {
    await page.evaluate(() => {
      const d = document.querySelector("#dialogHost"); if (d) d.innerHTML = "";
      const m = document.querySelector("#menuHost"); if (m) m.innerHTML = "";
      document.querySelectorAll("body > .modal-backdrop").forEach((n) => n.remove());
    });
    const ok = await page.evaluate(fn).catch(() => false);
    if (!ok) return;
    await page.waitForTimeout(350);
    (await page.evaluate(probe)).forEach((t) => findings.push({ where: label, text: t }));
  };

  for (const m of MODULES) {
    await run("create-" + m, `(() => { try { openModal("${m}", null); return true; } catch (e) { return false; } })()`);
  }
  await run("quick-create-menu", `(() => { try { const b = document.querySelector("[data-header-quick-create]"); if (!b) return false; b.click(); return true; } catch (e) { return false; } })()`);
  await run("customize-dashboard", `(() => { try { if (typeof openDashboardCustomizeModal === "function") { openDashboardCustomizeModal(); return true; } const b = [...document.querySelectorAll("[data-dashboard-customize]")][0]; if (b) { b.click(); return true; } return false; } catch (e) { return false; } })()`);
  await run("request-wizard", `(() => { try { if (typeof openEmployeeRequestWizard === "function") { openEmployeeRequestWizard(); return true; } return false; } catch (e) { return false; } })()`);

  await browser.close();

  const counts = new Map();
  for (const f of findings) {
    if (f.where === "pageerror") { console.log("PAGEERROR:", f.text); continue; }
    if (!counts.has(f.text)) counts.set(f.text, { text: f.text, n: 0, where: new Set() });
    const e = counts.get(f.text); e.n++; e.where.add(f.where);
  }
  const rows = [...counts.values()].sort((a, b) => b.n - a.n);
  fs.writeFileSync("i18n-modals.txt", rows.map((r) => `${String(r.n).padStart(3)}x | ${r.text}   [${[...r.where].slice(0, 2).join(",")}]`).join("\n"));
  console.log("untranslated strings inside overlays: " + rows.length);
  console.log(rows.map((r) => "  " + r.text).join("\n"));
})();
