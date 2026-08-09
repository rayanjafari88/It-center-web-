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
  const sends = transport === "smtp" || transport === "graph";
  show("MAIL_TRANSPORT", transport, sends ? "" : "<- codes go to the console, not email");
  if (transport === "graph") {
    show("GRAPH_TENANT_ID", process.env.GRAPH_TENANT_ID || "(not set)");
    show("GRAPH_CLIENT_ID", process.env.GRAPH_CLIENT_ID || "(not set)");
    show("GRAPH_CLIENT_SECRET", process.env.GRAPH_CLIENT_SECRET ? `set, ${process.env.GRAPH_CLIENT_SECRET.length} characters` : "(not set)");
    show("GRAPH_SENDER", process.env.GRAPH_SENDER || process.env.SMTP_FROM || "(not set)");
  } else {
    show("SMTP_HOST", process.env.SMTP_HOST || "smtp.office365.com (default)");
    show("SMTP_PORT", process.env.SMTP_PORT || "587 (default)");
    show("SMTP_USER", process.env.SMTP_USER || "(not set)");
    show("SMTP_PASS", process.env.SMTP_PASS ? `set, ${process.env.SMTP_PASS.length} characters` : "(not set)");
    show("SMTP_FROM", process.env.SMTP_FROM || process.env.SMTP_USER || "(not set)");
  }
  console.log("");

  if (!to) {
    console.log("Usage: npm run mail:test -- you@example.com\n");
    process.exitCode = 1;
    return;
  }

  if (!sends) {
    console.log("MAIL_TRANSPORT is neither 'smtp' nor 'graph', so nothing will be sent.\n");
    process.exitCode = 1;
    return;
  }
  if (transport === "smtp" && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    console.log("SMTP_USER and SMTP_PASS are required to authenticate.\n");
    process.exitCode = 1;
    return;
  }
  if (transport === "graph") {
    const missing = ["GRAPH_TENANT_ID", "GRAPH_CLIENT_ID", "GRAPH_CLIENT_SECRET"].filter((key) => !process.env[key]);
    if (!process.env.GRAPH_SENDER && !process.env.SMTP_FROM) missing.push("GRAPH_SENDER");
    if (missing.length) {
      console.log(`Missing for the graph transport: ${missing.join(", ")}\n`);
      process.exitCode = 1;
      return;
    }
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
    if (/Graph token request failed/i.test(message) && /AADSTS7000215|invalid_client/i.test(message)) {
      console.log("  The client secret is wrong or has expired. Azure secrets expire - create a new");
      console.log("  one under App registrations > your app > Certificates & secrets.");
    } else if (/Graph token request failed/i.test(message) && /tenant identifier|tenant .{0,20}(not valid|not found)|AADSTS9000\d\d/i.test(message)) {
      console.log("  The tenant id was not recognised. Check GRAPH_TENANT_ID - it is the");
      console.log("  Directory (tenant) ID on the app registration's Overview page.");
    } else if (/AADSTS53003|Conditional Access/i.test(message)) {
      console.log("  A Conditional Access policy is blocking this sign-in. Ask whoever manages");
      console.log("  Entra ID to exclude this app registration, or scope the policy so service");
      console.log("  principals are not caught by it.");
    } else if (/AADSTS700016|unauthorized_client|application with identifier .* was not found/i.test(message)) {
      console.log("  The client id does not exist in this tenant. Check GRAPH_CLIENT_ID and that");
      console.log("  GRAPH_TENANT_ID points at the tenant where the app was registered.");
    } else if (/Graph sendMail failed \(403\)|Authorization_RequestDenied|Access is denied/i.test(message)) {
      console.log("  The app registration cannot send. Add the APPLICATION permission Mail.Send");
      console.log("  under API permissions, then click 'Grant admin consent'. A delegated Mail.Send");
      console.log("  permission does not work for this flow.");
    } else if (/Graph sendMail failed \(404\)|ResourceNotFound|MailboxNotEnabled/i.test(message)) {
      console.log("  GRAPH_SENDER is not a licensed mailbox in this tenant. It must be a real");
      console.log("  mailbox address, not an alias or an unlicensed account.");
    } else if (/SmtpClientAuthentication is disabled|535 5\.7\.139/i.test(message)) {
      console.log("  Microsoft 365 has SMTP AUTH switched off for this mailbox. This is the");
      console.log("  default for tenants created since 2020 and is the most common cause.");
      console.log("  Fix: Microsoft 365 admin centre > Users > the mailbox > Mail > Manage email");
      console.log("  apps > tick 'Authenticated SMTP'. It can take an hour to apply.");
    } else if (/5\.7\.57|must issue a STARTTLS|authentication required/i.test(message)) {
      console.log("  The server refused unauthenticated sending. Check SMTP_USER and SMTP_PASS.");
    } else if (/535|5\.7\.3|authentication unsuccessful|invalid credentials|Username and Password not accepted/i.test(message)) {
      console.log("  The username or password was rejected.");
      console.log("  Gmail: you must use a 16-character app password, not your normal password,");
      console.log("  and 2-Step Verification has to be on first. https://myaccount.google.com/apppasswords");
      console.log("  Microsoft 365: same idea - create an app password if the mailbox has MFA.");
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
