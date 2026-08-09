// Sends one test message using the current mail settings and explains failures in
// plain language, so SMTP can be diagnosed without reading the app's source.
//
//   npm run mail:test -- you@example.com
const { sendMail, mailerTransport } = require("../../lib/mailer");

const to = process.argv[2];

function show(label, value, note = "") {
  console.log(`  ${label.padEnd(16)} ${value}${note ? `  ${note}` : ""}`);
}

async function main() {
  console.log("\nMail settings\n");
  const transport = mailerTransport();
  show("MAIL_TRANSPORT", transport, transport === "smtp" ? "" : "<- codes go to the console, not email");
  show("SMTP_HOST", process.env.SMTP_HOST || "smtp.office365.com (default)");
  show("SMTP_PORT", process.env.SMTP_PORT || "587 (default)");
  show("SMTP_USER", process.env.SMTP_USER || "(not set)");
  show("SMTP_PASS", process.env.SMTP_PASS ? `set, ${process.env.SMTP_PASS.length} characters` : "(not set)");
  show("SMTP_FROM", process.env.SMTP_FROM || process.env.SMTP_USER || "(not set)");
  console.log("");

  if (!to) {
    console.log("Usage: npm run mail:test -- you@example.com\n");
    process.exitCode = 1;
    return;
  }

  if (transport !== "smtp") {
    console.log("MAIL_TRANSPORT is not 'smtp', so nothing will be sent. Set it and try again.\n");
    process.exitCode = 1;
    return;
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("SMTP_USER and SMTP_PASS are required to authenticate.\n");
    process.exitCode = 1;
    return;
  }

  console.log(`Sending a test message to ${to} ...\n`);
  try {
    await sendMail({
      to,
      subject: "IT Command Center test message",
      text: "If you are reading this, sign-in codes will reach your staff.\n\nSent by npm run mail:test."
    });
    console.log("  SENT. Check the inbox, and the junk folder.\n");
  } catch (error) {
    const message = String(error.message || error);
    console.log(`  FAILED: ${message}\n`);
    console.log("Likely cause:\n");
    // The failures worth naming, because each has a different fix.
    if (/SmtpClientAuthentication is disabled|535 5\.7\.139/i.test(message)) {
      console.log("  Microsoft 365 has SMTP AUTH switched off for this mailbox. This is the");
      console.log("  default for tenants created since 2020 and is the most common cause.");
      console.log("  Fix: Microsoft 365 admin centre > Users > the mailbox > Mail > Manage email");
      console.log("  apps > tick 'Authenticated SMTP'. It can take an hour to apply.");
    } else if (/5\.7\.57|must issue a STARTTLS|authentication required/i.test(message)) {
      console.log("  The server refused unauthenticated sending. Check SMTP_USER and SMTP_PASS.");
    } else if (/535|5\.7\.3|authentication unsuccessful|invalid credentials/i.test(message)) {
      console.log("  The username or password was rejected. If the mailbox has MFA enabled, a");
      console.log("  normal password will not work - create an app password and use that.");
    } else if (/ENOTFOUND|EAI_AGAIN/i.test(message)) {
      console.log("  The mail server hostname could not be resolved. Check SMTP_HOST.");
    } else if (/ECONNREFUSED|ETIMEDOUT|timeout/i.test(message)) {
      console.log("  Could not reach the mail server. Port 587 outbound is often blocked on");
      console.log("  corporate networks - check with whoever manages the firewall.");
    } else if (/certificate|self.signed/i.test(message)) {
      console.log("  TLS certificate problem. If this is an internal relay, its certificate is");
      console.log("  probably not trusted by this host.");
    } else {
      console.log("  Unrecognised error. The raw message above is what the mail server returned.");
    }
    console.log("");
    process.exitCode = 1;
  }
}

main();
