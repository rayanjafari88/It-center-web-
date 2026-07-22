const fs = require("fs");
const path = require("path");
const { REPORT_DIR } = require("./qa-lib");

const inventoryFile = path.join(REPORT_DIR, "V1_FUNCTION_INVENTORY.md");
const resultsFile = path.join(REPORT_DIR, "V1_TEST_RESULTS.json");

function parseInventory() {
  const text = fs.readFileSync(inventoryFile, "utf8");
  return text.split(/\r?\n/)
    .filter((line) => line.startsWith("| INV-"))
    .map((line) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      return {
        id: cells[0],
        module: cells[1],
        page: cells[2],
        role: cells[3],
        action: cells[4],
        expected: cells[5],
        api: cells[6],
        test: cells[7],
        status: cells[8],
        evidence: cells[9]
      };
    });
}

function classify(item) {
  const hay = `${item.module} ${item.page} ${item.action} ${item.api}`.toLowerCase();
  if (item.status !== "Not covered") {
    return {
      finalClassification: item.status.includes("browser") ? "Partial automation" : "API/security automation",
      risk: /rbac|audit|attachment|comment|notification|ticket|task|asset|document|knowledge|user|role/.test(hay) ? "High" : "Medium",
      importance: "V1 covered by executed automated evidence",
      proposedTest: item.test,
      feasibility: "Already automated or partially automated"
    };
  }
  if (/export|duplicate|schedule review|link licenses/.test(hay)) {
    return { finalClassification: "Future version", risk: "Low", importance: "Not required for V1 release", proposedTest: "Add when feature is promoted from roadmap/placeholder", feasibility: "Automate later when workflow is active" };
  }
  if (/timeline|employee asset|employee document|notification preferences|roles|user accounts/.test(hay)) {
    return { finalClassification: "Manual V1 check", risk: "Medium", importance: "Needs visual/detail inspection but not a release-blocking privacy path", proposedTest: "Manual checklist item with role, language, viewport, and expected behavior", feasibility: "Partially automatable; manual visual confirmation remains better for V1" };
  }
  if (/portal|add contact|terminate/.test(hay)) {
    return { finalClassification: "Future version", risk: "Low", importance: "Secondary workflow; current V1 behavior may be placeholder/confirmation-based", proposedTest: "Workflow-specific Playwright test after V1.1 activation", feasibility: "Future automation" };
  }
  if (/archive|trash|restore|comments|attachments|audit|rbac|lookup|preferences|assignment groups|form templates|transfers|users|roles|login/.test(hay)) {
    return { finalClassification: "Must automate before V1", risk: "High", importance: "Security/shared infrastructure path", proposedTest: "API/security test or focused browser smoke", feasibility: "Automatable" };
  }
  return { finalClassification: "Manual V1 check", risk: "Medium", importance: "Lower-risk uncovered UI detail", proposedTest: "Manual checklist item", feasibility: "Manual for V1; automate in V1.1 if repeated" };
}

function counts(items) {
  const output = {};
  for (const item of items) output[item.finalClassification] = (output[item.finalClassification] || 0) + 1;
  return output;
}

function main() {
  const inventory = parseInventory();
  const priorities = inventory.map((item) => ({ ...item, ...classify(item) }));
  const uncovered = priorities.filter((item) => item.status === "Not covered");
  const results = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile, "utf8")) : { summary: {} };
  const summaryCounts = counts(priorities);
  const uncoveredCounts = counts(uncovered);

  const md = `# V1 Coverage Priorities

Generated from V1_FUNCTION_INVENTORY.md and latest automated QA results.

## Execution Summary

- Total tests: ${results.summary.total || 0}
- Passed: ${results.summary.passed || 0}
- Failed: ${results.summary.failed || 0}
- Blocked: ${results.summary.blocked || 0}
- Recommendation: ${results.summary.recommendation || "Unknown"}

## Coverage Classification Summary

| Classification | Count |
| --- | ---: |
${Object.entries(summaryCounts).map(([key, value]) => `| ${key} | ${value} |`).join("\n")}

## Remaining Uncovered Classification

| Classification | Count |
| --- | ---: |
${Object.entries(uncoveredCounts).map(([key, value]) => `| ${key} | ${value} |`).join("\n")}

## Function Priorities

| Function ID | Module | Role | Current coverage | Risk | V1 importance | Proposed test | Automation feasibility | Final classification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${priorities.map((item) => `| ${item.id} | ${item.module} | ${item.role} | ${item.status} | ${item.risk} | ${item.importance} | ${item.proposedTest.replace(/\|/g, "/")} | ${item.feasibility} | ${item.finalClassification} |`).join("\n")}
`;

  fs.writeFileSync(path.join(REPORT_DIR, "V1_COVERAGE_PRIORITIES.md"), md);
  console.log(`Coverage priorities written: ${priorities.length}`);
  console.log(JSON.stringify({ all: summaryCounts, uncovered: uncoveredCounts }, null, 2));
}

main();
