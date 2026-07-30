// Creates a login account through both paths and diffs the stored records.
const http = require("http");
const BASE = { host: "127.0.0.1", port: Number(process.env.PORT || 4173) };

function call(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({ ...BASE, path, method, headers: {
      "Content-Type": "application/json",
      "x-user-id": "user_admin",
      ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {})
    } }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const stamp = Date.now();
  const state = await call("GET", "/api/state");
  const roleId = (state.body.roles || []).find((r) => /staff/i.test(r.name))?.id;
  if (!roleId) throw new Error("no staff role found");

  // Path A — New Service Account modal payload
  const a = await call("POST", "/api/users", {
    name: "Parity A", username: "parity.a." + stamp, email: `parity.a.${stamp}@itcc.local`,
    roleId, accountType: "Employee", status: "active",
    password: "Passw0rd!", expiryDate: "", employeeId: "", requirePasswordChange: true
  });

  // Path B — Person + System Access payload
  const b = await call("POST", "/api/employees", {
    name: "Parity B", personType: "Employee",
    departmentId: (state.body.employees || [])[0]?.departmentId || "",
    email: `parity.b.${stamp}@itcc.local`, status: "active",
    systemAccess: {
      createLogin: true,
      name: "Parity B", username: "parity.b." + stamp, email: `parity.b.${stamp}@itcc.local`,
      roleId, accountType: "Employee", status: "active",
      password: "Passw0rd!", expiryDate: "", employeeId: "", requirePasswordChange: true
    }
  });

  if (a.status !== 201) { console.log("path A failed:", a.status, a.body); return; }
  if (b.status !== 201) { console.log("path B failed:", b.status, b.body); return; }

  const after = await call("GET", "/api/state");
  const users = after.body.users || [];
  const userA = users.find((u) => u.username === "parity.a." + stamp);
  const userB = users.find((u) => u.username === "parity.b." + stamp);
  if (!userA || !userB) { console.log("could not locate created accounts"); return; }

  const shape = (u) => Object.keys(u).sort();
  const ignore = new Set(["id", "name", "username", "email", "employeeId", "createdAt", "updatedAt", "password"]);
  console.log("keys A:", shape(userA).join(", "));
  console.log("keys B:", shape(userB).join(", "));

  const onlyA = shape(userA).filter((k) => !shape(userB).includes(k));
  const onlyB = shape(userB).filter((k) => !shape(userA).includes(k));
  console.log("\nfields only in A:", onlyA.length ? onlyA.join(", ") : "(none)");
  console.log("fields only in B:", onlyB.length ? onlyB.join(", ") : "(none)");

  const diffs = shape(userA).filter((k) => !ignore.has(k) && shape(userB).includes(k))
    .filter((k) => JSON.stringify(userA[k]) !== JSON.stringify(userB[k]))
    .map((k) => `  ${k}: A=${JSON.stringify(userA[k])}  B=${JSON.stringify(userB[k])}`);
  console.log("\nvalue differences (excluding identity fields):");
  console.log(diffs.length ? diffs.join("\n") : "  (none — records are equivalent)");

  // defaults check: omit requirePasswordChange entirely on both paths
  const c = await call("POST", "/api/users", {
    name: "Default A", username: "default.a." + stamp, roleId, password: "Passw0rd!"
  });
  const d = await call("POST", "/api/employees", {
    name: "Default B", personType: "Employee", email: `default.b.${stamp}@itcc.local`, status: "active",
    systemAccess: { createLogin: true, username: "default.b." + stamp, roleId, password: "Passw0rd!" }
  });
  const after2 = await call("GET", "/api/state");
  const dA = (after2.body.users || []).find((u) => u.username === "default.a." + stamp);
  const dB = (after2.body.users || []).find((u) => u.username === "default.b." + stamp);
  console.log("\nwith requirePasswordChange omitted:");
  console.log(`  service-account path: requirePasswordChange=${dA && dA.requirePasswordChange}  accountType=${dA && dA.accountType}`);
  console.log(`  person path:          requirePasswordChange=${dB && dB.requirePasswordChange}  accountType=${dB && dB.accountType}`);
  console.log(`  ${c.status === 201 && d.status === 201 ? "both created" : "create failed: " + c.status + "/" + d.status}`);
})();
