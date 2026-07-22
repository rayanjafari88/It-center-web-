const fs = require("fs");
const path = require("path");
const { DATA_FILE, cleanupQaRecords } = require("./qa-lib");

const backupFile = path.join(__dirname, "..", "fixtures", "db.before-playwright.json");

module.exports = async function globalTeardown() {
  cleanupQaRecords();
  if (fs.existsSync(backupFile)) {
    fs.writeFileSync(DATA_FILE, fs.readFileSync(backupFile, "utf8"));
    fs.unlinkSync(backupFile);
  }
};
