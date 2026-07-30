// Employee number must be required and unique, and every required People
// field must be a column the Excel template carries.
const http = require("http");
const BASE = { host: "127.0.0.1", port: 4173 };

function call(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({ ...BASE, path, method, headers: {
      "Content-Type": "application/json", "x-user-id": "user_admin",
      ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {})
    } }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => { let p; try { p = JSON.parse(data); } catch (e) { p = data.slice(0, 120); } resolve({ status: res.statusCode, body: p }); });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const stamp = Date.now();
  const state = await call("GET", "/api/state");
  const deptId = (state.body.departments || [])[0]?.id;
  const existing = (state.body.employees || [])[0];
  console.log("existing person:", existing.name, "employeeNo =", existing.employeeNo);

  const base = { name: "Uniqueness Test", personType: "Employee", departmentId: deptId, email: `uniq.${stamp}@itcc.local`, status: "active" };

  const missing = await call("POST", "/api/employees", { ...base });
  console.log(`1. create without employee number -> ${missing.status} ${JSON.stringify(missing.body.error || "")}`);

  const duplicate = await call("POST", "/api/employees", { ...base, employeeNo: existing.employeeNo });
  console.log(`2. create with an existing number  -> ${duplicate.status} ${JSON.stringify(duplicate.body.error || "")}`);

  const ok = await call("POST", "/api/employees", { ...base, employeeNo: "T" + stamp });
  console.log(`3. create with a fresh number      -> ${ok.status} ${ok.status === 201 ? "created" : JSON.stringify(ok.body.error)}`);

  if (ok.status === 201) {
    const clash = await call("PATCH", `/api/employees/${ok.body.id}`, { employeeNo: existing.employeeNo });
    console.log(`4. rename onto an existing number  -> ${clash.status} ${JSON.stringify(clash.body.error || "")}`);
    const keep = await call("PATCH", `/api/employees/${ok.body.id}`, { employeeNo: "T" + stamp, jobTitle: "Tester" });
    console.log(`5. update keeping its own number   -> ${keep.status} ${keep.status === 200 ? "updated" : JSON.stringify(keep.body.error)}`);
  }

  // required fields vs the Excel columns
  const excelColumns = ["employeeNo", "name", "location", "department", "manager", "email", "jobTitle", "businessUnit", "phoneCountryCode", "phone"];
  const src = require("fs").readFileSync("public/app.js", "utf8");
  const schema = src.match(/^  employees: \[\[.*$/m)[0];
  const required = [...schema.matchAll(/\["(\w+)", "([^"]+)"[^\]]*?required: true/g)].map((m) => m[1]);
  const mapped = required.map((field) => (field === "departmentId" ? "department" : field));
  const notInExcel = mapped.filter((f) => !excelColumns.includes(f));
  console.log("\nrequired People fields:", required.join(", "));
  console.log("all present in the Excel template:", notInExcel.length === 0 ? "yes" : "NO -> " + notInExcel.join(", "));
})();
