const { cleanupQaRecords } = require("./qa-lib");

const result = cleanupQaRecords();
console.log("QA cleanup removed records:");
for (const [key, count] of Object.entries(result.removed)) {
  if (count) console.log(`- ${key}: ${count}`);
}
console.log(result.remaining ? "QA_AUTO_ records remain." : "No QA_AUTO_ records remain.");
if (result.remaining) process.exitCode = 1;

