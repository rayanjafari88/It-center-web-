// Imports the real workbook through the API, exports it again, and diffs.
const fs = require("fs");
const http = require("http");
const { readWorkbook } = require("./lib/xlsx");

const SOURCE = process.argv[2] || "C:\\Users\\sdsd0\\OneDrive\\Desktop\\Updated employees data (1).xlsx";
const BASE = { host: "127.0.0.1", port: 4173 };

function call(method, path, body, raw) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({ ...BASE, path, method, headers: {
      "Content-Type": "application/json", "x-user-id": "user_admin",
      ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {})
    } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        if (raw) return resolve({ status: res.statusCode, buffer, headers: res.headers });
        let parsed; try { parsed = JSON.parse(buffer.toString("utf8")); } catch (e) { parsed = buffer.toString("utf8").slice(0, 200); }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const fileBase64 = fs.readFileSync(SOURCE).toString("base64");

  const preview = await call("POST", "/api/employees/import", { fileBase64, preview: true });
  console.log("preview:", preview.status, JSON.stringify(preview.body.summary));
  if (preview.body.problems?.length) console.log("  problems (first 3):", JSON.stringify(preview.body.problems.slice(0, 3)));
  console.log("  sample:", JSON.stringify(preview.body.sample?.[0]));

  const applied = await call("POST", "/api/employees/import", { fileBase64 });
  console.log("apply:", applied.status, JSON.stringify({ created: applied.body.created, updated: applied.body.updated, managersLinked: applied.body.managersLinked, skipped: applied.body.skipped }));

  const state = await call("GET", "/api/state");
  const people = state.body.employees || [];
  console.log("people in system now:", people.length);
  const withUnit = people.filter((p) => p.businessUnit).length;
  const withCode = people.filter((p) => p.phoneCountryCode).length;
  const withMgr = people.filter((p) => p.managerId).length;
  console.log(`  businessUnit set: ${withUnit}   phoneCountryCode set: ${withCode}   managerId set: ${withMgr}`);

  const exported = await call("GET", "/api/employees/export", null, true);
  console.log("export:", exported.status, exported.headers["content-type"], exported.buffer.length, "bytes");
  fs.writeFileSync("exported-people.xlsx", exported.buffer);

  // compare Sheet1 data against the source
  const src = readWorkbook(fs.readFileSync(SOURCE)).sheets.Sheet1;
  const out = readWorkbook(exported.buffer).sheets.Sheet1;
  const norm = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
  const key = (row) => norm(row[0]);
  const srcRows = new Map(src.slice(2).filter((r) => norm(r[0])).map((r) => [key(r), r]));
  const outRows = new Map(out.slice(2).filter((r) => norm(r[0])).map((r) => [key(r), r]));
  console.log(`\nSheet1: source ${srcRows.size} records, export ${outRows.size} records`);
  console.log("headers match:", JSON.stringify(src[1].map(norm)) === JSON.stringify(out[1].map(norm)));
  console.log("marker row:", JSON.stringify(norm(out[0][0])));

  let diffs = 0;
  for (const [no, srcRow] of srcRows) {
    const outRow = outRows.get(no);
    if (!outRow) { if (diffs < 5) console.log(`  MISSING employee ${no}`); diffs++; continue; }
    for (let c = 0; c < 10; c++) {
      if (norm(srcRow[c]) !== norm(outRow[c])) {
        if (diffs < 8) console.log(`  DIFF emp ${no} col ${c + 1} (${norm(src[1][c])}): ${JSON.stringify(norm(srcRow[c]))} -> ${JSON.stringify(norm(outRow[c]))}`);
        diffs++;
      }
    }
  }
  console.log(diffs ? `\n${diffs} cell differences` : "\nround trip clean: every source row exported identically");
})();
