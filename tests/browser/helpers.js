const { expect } = require("@playwright/test");

const QA_PASSWORD = process.env.QA_AUTO_PASSWORD || "QA_AUTO_password123!";
const users = {
  admin: { id: "QA_AUTO_user_admin", username: "qa_auto_admin", password: QA_PASSWORD },
  manager: { id: "QA_AUTO_user_manager", username: "qa_auto_manager", password: QA_PASSWORD },
  staff: { id: "QA_AUTO_user_staff", username: "qa_auto_staff", password: QA_PASSWORD },
  employeeA: { id: "QA_AUTO_user_employee_a", username: "qa_auto_employee_a", password: QA_PASSWORD },
  employeeB: { id: "QA_AUTO_user_employee_b", username: "qa_auto_employee_b", password: QA_PASSWORD }
};

async function login(page, user) {
  await page.goto("/");
  await page.locator("#loginForm input[name='email']").fill(user.username);
  await page.locator("#loginForm input[name='password']").fill(user.password);
  await page.locator("#loginForm button[type='submit']").click();
  await expect(page.locator("#app")).toBeVisible();
  await expect(page.locator("#login")).toBeHidden();
}

async function loginByStorage(page, user) {
  await page.goto("/");
  await page.evaluate((userId) => localStorage.setItem("itcc.userId", userId), user.id);
  await page.reload();
  await expect(page.locator("#app")).toBeVisible();
}

async function logout(page) {
  await page.locator("#profileButton").click();
  await page.locator("#menuHost").getByText(/Logout/i).click();
  await expect(page.locator("#login")).toBeVisible();
}

async function api(page, path, options = {}) {
  const result = await page.evaluate(async ({ path, options }) => {
    const response = await fetch(path, {
      method: options.method || "GET",
      headers: { "Content-Type": "application/json", "x-user-id": options.userId || localStorage.getItem("itcc.userId") || "QA_AUTO_user_manager" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });
    const text = await response.text();
    let data = text;
    try { data = text ? JSON.parse(text) : null; } catch (_) {}
    return { status: response.status, data };
  }, { path, options });
  return result;
}

async function openModule(page, label) {
  const nav = page.locator("#nav");
  const aliases = {
    Knowledge: ["Knowledge", "Knowledge Base"],
    Documents: ["Documents", "Company Documents"],
    Tickets: ["Tickets", "Requests / Tickets"],
    Assets: ["Assets", "My Assets"],
    Tasks: ["Tasks", "My Tasks"]
  };
  const candidates = aliases[label] || [label];
  let clicked = false;
  for (const candidate of candidates) {
    const item = nav.getByText(candidate, { exact: true }).first();
    if (await item.count()) {
      await item.click();
      clicked = true;
      break;
    }
  }
  expect(clicked, `Navigation item exists for ${label}`).toBeTruthy();
  const expected = label === "Requests / Tickets"
    ? /Tickets|Requests/
    : new RegExp(candidates.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
  await expect(page.locator("#pageTitle")).toContainText(expected);
}

async function ensureNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  expect(overflow).toBeFalsy();
}

async function captureEvidence(page, name) {
  const safe = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return page.screenshot({ path: `qa/reports/playwright-artifacts/evidence-${safe}.png`, fullPage: true });
}

async function expectAccessDenied(page, path, user = users.employeeA) {
  const result = await api(page, path, { userId: user.id });
  expect([401, 403, 404]).toContain(result.status);
  return result;
}

async function setLanguage(page, lang) {
  await page.evaluate((value) => localStorage.setItem("itcc.lang", value), lang);
  await page.reload();
  await expect(page.locator("#app")).toBeVisible();
}

module.exports = { users, login, loginByStorage, logout, api, openModule, ensureNoHorizontalOverflow, captureEvidence, expectAccessDenied, setLanguage };
