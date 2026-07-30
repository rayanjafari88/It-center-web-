"use strict";
/* People import/export in the customer's workbook layout.
 *
 * Sheet1 row 1 carries the "mandatory" marker, row 2 the Arabic headers, and
 * data starts at row 3. dropdown_list_items holds the allowed values, one list
 * per column. Both are reproduced on export so an exported file can be
 * re-imported unchanged.
 */

const { readWorkbook, writeWorkbook } = require("./xlsx");

const DATA_SHEET = "Sheet1";
const LIST_SHEET = "dropdown_list_items";
const MARKER = "إجبارية";

// Sheet1 columns, in order. `field` is the employee property it maps to.
const COLUMNS = [
  { header: "الرقم الوظيفي", field: "employeeNo" },
  { header: "الاسم الكامل (عربي)", field: "name" },
  { header: "اسم الموقع", field: "location" },
  { header: "القسم", field: "department" },
  { header: "المدير المباشر", field: "manager" },
  { header: "البريد الإلكتروني", field: "email" },
  { header: "المسمى الوظيفي", field: "jobTitle" },
  { header: "وحدة العمل", field: "businessUnit" },
  { header: "رمز الهاتف الدولي", field: "phoneCountryCode" },
  { header: "رقم الجوال", field: "phone" }
];

// Which dropdown_list_items column feeds which lookup, by zero-based index.
const LIST_COLUMNS = [
  { index: 2, lookup: "location", from: (people) => people.map((p) => p.location) },
  { index: 3, lookup: null, from: (people, db) => people.map((p) => departmentName(db, p.departmentId)) },
  { index: 6, lookup: null, from: (people) => people.map((p) => managerLabel(people, p)) },
  { index: 7, lookup: "job_title", from: (people) => people.map((p) => p.jobTitle) },
  { index: 8, lookup: "business_unit", from: (people) => people.map((p) => p.businessUnit) },
  { index: 10, lookup: "phone_country_code", from: (people) => people.map((p) => p.phoneCountryCode) }
];

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

function departmentName(db, departmentId) {
  return (db.departments || []).find((d) => d.id === departmentId)?.name || "";
}

function managerLabel(people, person) {
  const manager = people.find((p) => p.id === person.managerId);
  if (!manager) return "";
  return manager.employeeNo ? `${manager.employeeNo} - ${manager.name}` : manager.name || "";
}

/** "1061 - احمد محمود" -> "1061" */
function managerEmployeeNo(value) {
  const match = clean(value).match(/^(\S+)\s*-\s*/);
  return match ? match[1] : "";
}

/* ------------------------------------------------------------------ import */

/**
 * Parses a workbook into rows plus a summary of what applying it would do.
 * Nothing is written here; the caller decides whether to commit.
 */
function analyseImport(db, buffer) {
  const workbook = readWorkbook(buffer);
  const sheetName = workbook.sheetNames.includes(DATA_SHEET) ? DATA_SHEET : workbook.sheetNames[0];
  const sheet = workbook.sheets[sheetName] || [];
  if (!sheet.length) throw new Error("The workbook has no sheets with data");

  // Find the header row: the one carrying the employee-number header. Falls
  // back to row 2, which is where the template puts it.
  let headerRow = sheet.findIndex((row) => (row || []).some((cell) => clean(cell) === COLUMNS[0].header));
  if (headerRow < 0) headerRow = 1;
  const headers = (sheet[headerRow] || []).map(clean);

  // Map each expected column to whichever position it occupies in this file,
  // so a re-ordered export still imports correctly.
  const positions = COLUMNS.map((column) => {
    const at = headers.indexOf(column.header);
    return at >= 0 ? at : COLUMNS.indexOf(column);
  });

  const existingByNo = new Map();
  for (const person of db.employees || []) {
    if (person.employeeNo) existingByNo.set(clean(person.employeeNo), person);
  }

  const rows = [];
  const problems = [];
  const seen = new Set();
  for (let r = headerRow + 1; r < sheet.length; r++) {
    const raw = sheet[r] || [];
    if (!raw.some((cell) => clean(cell))) continue;
    if (clean(raw[0]) === MARKER) continue;

    const record = {};
    COLUMNS.forEach((column, i) => { record[column.field] = clean(raw[positions[i]]); });
    const rowNumber = r + 1;

    if (!record.employeeNo) { problems.push({ row: rowNumber, reason: "Missing employee number" }); continue; }
    if (!record.name) { problems.push({ row: rowNumber, reason: "Missing name" }); continue; }
    if (seen.has(record.employeeNo)) { problems.push({ row: rowNumber, reason: `Duplicate employee number ${record.employeeNo}` }); continue; }
    seen.add(record.employeeNo);

    record.__row = rowNumber;
    record.__existingId = existingByNo.get(record.employeeNo)?.id || "";
    rows.push(record);
  }

  return {
    sheetName,
    lists: workbook.sheets[LIST_SHEET] || null,
    rows,
    problems,
    summary: {
      rowsRead: rows.length + problems.length,
      toCreate: rows.filter((r) => !r.__existingId).length,
      toUpdate: rows.filter((r) => r.__existingId).length,
      skipped: problems.length
    }
  };
}

/** Applies a parsed import. Mutates db; the caller persists it. */
function applyImport(db, analysis, helpers) {
  const { newId, now } = helpers;
  db.employees = db.employees || [];
  db.departments = db.departments || [];
  db.lookupItems = db.lookupItems || [];

  const departmentByName = new Map(db.departments.map((d) => [clean(d.name).toLowerCase(), d]));
  const ensureDepartment = (name) => {
    const key = clean(name).toLowerCase();
    if (!key) return "";
    if (departmentByName.has(key)) return departmentByName.get(key).id;
    const department = { id: newId("dep"), name: clean(name) };
    db.departments.push(department);
    departmentByName.set(key, department);
    return department.id;
  };

  const lookupSeen = new Set(db.lookupItems.map((item) => `${item.type}:${clean(item.nameEn).toLowerCase()}`));
  const ensureLookup = (type, value) => {
    const name = clean(value);
    if (!name) return;
    const key = `${type}:${name.toLowerCase()}`;
    if (lookupSeen.has(key)) return;
    lookupSeen.add(key);
    db.lookupItems.push({
      id: newId("lookup"), type, module: "employee",
      nameEn: name, nameAr: name, code: name,
      color: "", icon: "", sortOrder: db.lookupItems.filter((i) => i.type === type).length + 1, active: true
    });
  };

  const byNo = new Map();
  for (const person of db.employees) if (person.employeeNo) byNo.set(clean(person.employeeNo), person);

  let created = 0;
  let updated = 0;
  for (const row of analysis.rows) {
    const values = {
      employeeNo: row.employeeNo,
      name: row.name,
      location: row.location,
      jobTitle: row.jobTitle,
      businessUnit: row.businessUnit,
      email: row.email,
      phoneCountryCode: row.phoneCountryCode,
      phone: row.phone,
      departmentId: ensureDepartment(row.department)
    };
    ensureLookup("location", row.location);
    ensureLookup("job_title", row.jobTitle);
    ensureLookup("business_unit", row.businessUnit);
    ensureLookup("phone_country_code", row.phoneCountryCode);

    const existing = byNo.get(row.employeeNo);
    if (existing) {
      Object.assign(existing, values, { updatedAt: now() });
      updated++;
    } else {
      const person = {
        id: newId("empl"),
        personType: "Employee",
        status: "active",
        ...values,
        createdAt: now(),
        updatedAt: now()
      };
      db.employees.push(person);
      byNo.set(row.employeeNo, person);
      created++;
    }
  }

  // Managers are resolved afterwards so a manager listed further down the file
  // is already present by the time it is referenced.
  let managersLinked = 0;
  for (const row of analysis.rows) {
    const person = byNo.get(row.employeeNo);
    if (!person) continue;
    const managerNo = managerEmployeeNo(row.manager);
    const manager = managerNo ? byNo.get(managerNo) : null;
    if (manager && manager.id !== person.id) {
      person.managerId = manager.id;
      managersLinked++;
    }
  }

  // Keep the workbook's own dropdown lists so an export reproduces the file.
  if (analysis.lists) {
    db.settings = db.settings || {};
    db.settings.peopleDropdownLists = analysis.lists;
  }

  return { created, updated, managersLinked, skipped: analysis.problems.length };
}

/* ------------------------------------------------------------------ export */

function buildListSheet(db, people) {
  const stored = db.settings?.peopleDropdownLists;
  const rows = Array.isArray(stored) ? stored.map((row) => (row || []).slice()) : [];

  // Refresh the columns this app owns from live data; leave any others as the
  // imported workbook had them.
  for (const column of LIST_COLUMNS) {
    const values = [...new Set(column.from(people, db).map(clean).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ar"));
    for (let i = 0; i < Math.max(values.length, rows.length); i++) {
      rows[i] = rows[i] || [];
      rows[i][column.index] = values[i] || "";
    }
  }
  return rows;
}

function buildExport(db) {
  const people = (db.employees || []).filter((person) => !person.deletedAt);
  const marker = [MARKER];
  const headers = COLUMNS.map((column) => column.header);
  const dataRows = people.map((person) => [
    person.employeeNo || "",
    person.name || "",
    person.location || "",
    departmentName(db, person.departmentId),
    managerLabel(people, person),
    person.email || "",
    person.jobTitle || "",
    person.businessUnit || "",
    person.phoneCountryCode || "",
    person.phone || ""
  ]);

  return writeWorkbook({
    [DATA_SHEET]: [marker, headers, ...dataRows],
    [LIST_SHEET]: buildListSheet(db, people)
  });
}

module.exports = { analyseImport, applyImport, buildExport, COLUMNS, DATA_SHEET, LIST_SHEET };
