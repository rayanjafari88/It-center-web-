// Narrow the audit to genuine UI chrome that must be translated.
const fs = require("fs");
const rows = JSON.parse(fs.readFileSync("i18n-report.json", "utf8"));
const db = JSON.parse(fs.readFileSync("data/db.json", "utf8"));

const proper = new Set();
const add = (v) => { if (v && String(v).trim()) proper.add(String(v).trim()); };
(db.users || []).forEach((u) => { add(u.name); add(u.username); add(u.email); });
(db.employees || []).forEach((e) => { add(e.name); add(e.email); add(e.phone); });
(db.vendors || []).forEach((v) => { add(v.name); add(v.contactName); add(v.email); add(v.website); });
(db.assets || []).forEach((a) => { add(a.name); add(a.serialNumber); add(a.assetNumber); add(a.model); });
(db.tickets || []).forEach((t) => { add(t.title); add(t.description); });
(db.tasks || []).forEach((t) => { add(t.title); add(t.description); });
(db.contracts || []).forEach((c) => { add(c.name); add(c.contractNumber); });
(db.documents || []).forEach((d) => { add(d.title); add(d.name); });
(db.knowledgeBase || []).forEach((k) => { add(k.title); add(k.summary); });
const lookupNames = new Set((db.lookupItems || []).map((i) => i.nameEn).filter(Boolean));

const noise = (t) =>
  /[{}[\]]/.test(t) ||                       // JSON payloads
  /^https?:\/\//.test(t) ||
  /performed .+ on /i.test(t) ||             // audit sentences (need templates, not entries)
  /^[a-z0-9]+([_-][a-z0-9]+)+$/.test(t) ||   // raw codes: head_office, microsoft-365
  /^[A-Z]{1,3}$/.test(t) ||                  // initials
  proper.has(t);

// Strings that only ever appear in the audit/timeline feeds are record content
// (who did what to which record), not interface chrome.
const feedOnly = (r) => (r.where || []).length > 0 && (r.where || []).every((w) => /audit_logs|timeline/.test(w));

const needs = rows.filter((r) => !noise(r.text) && !feedOnly(r));
const codes = rows.filter((r) => /^[a-z0-9]+([_-][a-z0-9]+)+$/.test(r.text) || /^[a-z]+$/.test(r.text));

fs.writeFileSync("i18n-needs.json", JSON.stringify(needs, null, 1));
console.log(`UI chrome needing translation: ${needs.length}`);
console.log(`(raw lowercase codes leaking into UI: ${codes.length} — separate bug)\n`);
const lines = needs.map((r) => `${String(r.hits).padStart(4)}x | ${r.text}`);
fs.writeFileSync("i18n-needs.txt", lines.join("\n"));
console.log(lines.join("\n"));
