const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const {
  ROOT,
  REPORT_DIR,
  DATA_FILE,
  PREFIX,
  writeReportFiles
} = require("./qa-lib");

const nodeResultsPath = path.join(REPORT_DIR, "V1_TEST_RESULTS.json");
const playwrightResultsPath = path.join(REPORT_DIR, "playwright-results.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function safeCommand(cmd, args) {
  try {
    return childProcess.execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch (_) {
    return "";
  }
}

function flattenPlaywrightSuites(suites, output = []) {
  for (const suite of suites || []) {
    flattenPlaywrightSuites(suite.suites, output);
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        output.push({ suite, spec, test });
      }
    }
  }
  return output;
}

function moduleFromFile(file) {
  const name = path.basename(file || "", ".spec.js");
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusFromResults(test) {
  const statuses = (test.results || []).map((result) => result.status);
  if (statuses.includes("failed") || statuses.includes("timedOut") || statuses.includes("interrupted")) return "failed";
  if (statuses.includes("passed")) return "passed";
  if (statuses.includes("skipped")) return "blocked";
  return test.outcome === "expected" ? "passed" : "notExecuted";
}

function messageFromResults(test) {
  const failed = (test.results || []).find((result) => result.error);
  if (failed && failed.error) return failed.error.message || "Playwright assertion failed.";
  return test.title || "Executed by Playwright.";
}

function evidenceFromResults(test) {
  const failed = (test.results || []).find((result) => result.error);
  if (!failed || !failed.error) return "";
  return failed.error.stack || failed.error.message || "";
}

function stripAnsi(value) {
  return String(value || "").replace(/\u001b\[[0-9;]*m/g, "");
}

function main() {
  if (!fs.existsSync(playwrightResultsPath)) {
    throw new Error("Missing qa/reports/playwright-results.json. Run npm run test:browser first.");
  }

  const existing = fs.existsSync(nodeResultsPath)
    ? readJson(nodeResultsPath)
    : { meta: {}, results: [] };
  const playwright = readJson(playwrightResultsPath);
  const browserResults = flattenPlaywrightSuites(playwright.suites).map(({ spec, test }, index) => ({
    id: `PW-${String(index + 1).padStart(3, "0")}`,
    suite: "browser",
    module: moduleFromFile(spec.file),
    role: "Browser",
    severity: "High",
    status: statusFromResults(test),
    message: stripAnsi(messageFromResults(test)),
    evidence: stripAnsi(evidenceFromResults(test)),
    steps: `Playwright spec: ${spec.file}`,
    expected: "Browser workflow completes without errors.",
    actual: test.title
  }));

  const nonBrowserResults = (existing.results || []).filter((result) => result.suite !== "browser");
  const meta = {
    ...existing.meta,
    generatedAt: new Date().toISOString(),
    gitBranch: safeCommand("git", ["branch", "--show-current"]) || existing.meta.gitBranch || "unknown",
    gitCommit: safeCommand("git", ["rev-parse", "--short", "HEAD"]) || existing.meta.gitCommit || "unknown",
    environment: `Node ${process.version} on ${process.platform}`,
    serverUrl: `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || 4321}`,
    browserStatus: `Executed with Playwright Chromium. Browser tests: ${browserResults.length}.`,
    cleanupRemaining: fs.readFileSync(DATA_FILE, "utf8").includes(PREFIX)
  };

  const report = writeReportFiles([...nonBrowserResults, ...browserResults], meta);
  fs.writeFileSync(path.join(REPORT_DIR, "V1_BROWSER_QA_REPORT.md"), browserReportMarkdown(browserResults, report.summary, meta));
  console.log(`Merged Playwright browser results: ${browserResults.length}`);
  console.log(`Total: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`Blocked: ${report.summary.blocked}`);
  console.log(`Recommendation: ${report.summary.recommendation}`);
  if (report.summary.failed > 0 || meta.cleanupRemaining) process.exitCode = 1;
}

function browserReportMarkdown(browserResults, summary, meta) {
  const byModule = {};
  for (const result of browserResults) {
    byModule[result.module] = byModule[result.module] || { total: 0, passed: 0, failed: 0, blocked: 0, notExecuted: 0 };
    byModule[result.module].total += 1;
    byModule[result.module][result.status] = (byModule[result.module][result.status] || 0) + 1;
  }
  const failures = browserResults.filter((result) => result.status === "failed");
  return `# V1 Browser QA Report

- Date/time: ${meta.generatedAt}
- Tool: Playwright Chromium
- Server URL: ${meta.serverUrl}
- Browser tests: ${browserResults.length}
- Browser passed: ${browserResults.filter((result) => result.status === "passed").length}
- Browser failed: ${failures.length}
- Screenshots/traces: qa/reports/playwright-artifacts
- HTML report: qa/reports/playwright-html/index.html
- Overall recommendation after merge: ${summary.recommendation}

## Browser Results By Module

| Module | Total | Passed | Failed | Blocked | Not Executed |
| --- | ---: | ---: | ---: | ---: | ---: |
${Object.entries(byModule).map(([module, counts]) => `| ${module} | ${counts.total} | ${counts.passed || 0} | ${counts.failed || 0} | ${counts.blocked || 0} | ${counts.notExecuted || 0} |`).join("\n")}

## Failures

${failures.length ? failures.map((failure) => `### ${failure.id} - ${failure.module}

- Message: ${failure.message}
- Evidence: ${failure.evidence || "See qa/reports/playwright-artifacts"}
- Spec: ${failure.steps}
`).join("\n") : "No browser failures recorded."}
`;
}

main();
