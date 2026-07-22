const fs = require("fs");
const path = require("path");
const { REPORT_DIR } = require("./qa-lib");

const file = path.join(REPORT_DIR, "V1_TEST_RESULTS.json");
if (!fs.existsSync(file)) {
  console.log("No QA report found. Run npm run test:all first.");
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(file, "utf8"));
console.log(JSON.stringify(report.summary, null, 2));

