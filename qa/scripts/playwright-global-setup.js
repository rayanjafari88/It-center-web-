const fs = require("fs");
const path = require("path");
const { DATA_FILE, seedQaRecords, cleanupQaRecords } = require("./qa-lib");

const backupFile = path.join(__dirname, "..", "fixtures", "db.before-playwright.json");

module.exports = async function globalSetup() {
  fs.mkdirSync(path.dirname(backupFile), { recursive: true });
  fs.writeFileSync(backupFile, fs.readFileSync(DATA_FILE, "utf8"));
  cleanupQaRecords();
  seedQaRecords();
};
