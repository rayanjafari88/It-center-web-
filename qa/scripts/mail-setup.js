// Writes a .env file with Gmail settings, so mail can be switched on without
// touching environment variables.
//
//   npm run mail:setup -- you@gmail.com abcdefghijklmnop
//
// The second argument is the 16-character Google app password, not the account
// password. Spaces in it are ignored, because Google displays it in groups of four.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const ENV_FILE = path.join(ROOT, ".env");

const account = (process.argv[2] || "").trim();
const appPassword = (process.argv[3] || "").replace(/\s+/g, "");

function fail(message) {
  console.log(`\n${message}\n`);
  console.log("Usage: npm run mail:setup -- you@gmail.com <16-character app password>\n");
  console.log("Get the app password from https://myaccount.google.com/apppasswords");
  console.log("2-Step Verification must be on before app passwords exist.\n");
  process.exitCode = 1;
}

if (!account || !account.includes("@")) {
  fail("A sending email address is required.");
} else if (appPassword.length < 12) {
  fail("That does not look like an app password. Google's are 16 characters.");
} else {
  // Preserve anything already configured; only replace the mail keys.
  const managed = new Set(["MAIL_TRANSPORT", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"]);
  const kept = fs.existsSync(ENV_FILE)
    ? fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/).filter((line) => {
      const key = line.split("=")[0].trim();
      return !managed.has(key);
    })
    : [];

  const host = account.toLowerCase().endsWith("@gmail.com") ? "smtp.gmail.com" : (process.env.SMTP_HOST || "smtp.office365.com");
  const lines = [
    ...kept.filter((line) => line.trim() !== ""),
    "",
    "# Mail settings written by npm run mail:setup",
    "MAIL_TRANSPORT=smtp",
    `SMTP_HOST=${host}`,
    "SMTP_PORT=587",
    `SMTP_USER=${account}`,
    `SMTP_PASS=${appPassword}`,
    `SMTP_FROM=${account}`,
    ""
  ];
  fs.writeFileSync(ENV_FILE, lines.join("\n"));
  console.log(`\nWrote ${ENV_FILE}\n`);
  console.log(`  MAIL_TRANSPORT   smtp`);
  console.log(`  SMTP_HOST        ${host}`);
  console.log(`  SMTP_USER        ${account}`);
  console.log(`  SMTP_PASS        set, ${appPassword.length} characters`);
  console.log("\nThese now load automatically every time the server starts.\n");
  console.log("Next:  npm run mail:test -- " + account);
  console.log("Then:  npm start\n");
}
