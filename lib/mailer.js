// Outbound email for sign-in codes.
//
// Transport is chosen with MAIL_TRANSPORT:
//   log  (default) - writes the message to the server log. Use for local work and
//                    for a pilot before mail delivery is wired up.
//   smtp           - talks SMTP directly (STARTTLS on 587, implicit TLS on 465),
//                    which is what Microsoft 365 expects. No dependencies.
//
// A Microsoft Graph transport can be added alongside these without touching callers.
const net = require("net");
const tls = require("tls");
const https = require("https");

const config = () => ({
  transport: process.env.MAIL_TRANSPORT || "log",
  host: process.env.SMTP_HOST || "smtp.office365.com",
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  from: process.env.SMTP_FROM || process.env.SMTP_USER || "it-command-center@localhost",
  // 465 is implicit TLS; 587 upgrades with STARTTLS.
  implicitTls: String(process.env.SMTP_SECURE || "") === "true" || Number(process.env.SMTP_PORT) === 465,
  // Microsoft Graph. Uses OAuth client credentials, so it works when a tenant has
  // SMTP AUTH disabled - which Microsoft does by default on newer tenants.
  graphTenantId: process.env.GRAPH_TENANT_ID || "",
  graphClientId: process.env.GRAPH_CLIENT_ID || "",
  graphClientSecret: process.env.GRAPH_CLIENT_SECRET || "",
  graphSender: process.env.GRAPH_SENDER || process.env.SMTP_FROM || ""
});

function encodeHeader(value) {
  // RFC 2047 so non-ASCII subjects survive.
  return /^[\x20-\x7E]*$/.test(value) ? value : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function buildMessage({ from, to, subject, text }) {
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(text, "utf8").toString("base64").replace(/(.{76})/g, "$1\r\n")
  ].join("\r\n");
}

// Minimal SMTP conversation. Each step waits for the expected reply code.
function sendViaSmtp({ host, port, user, pass, from, implicitTls }, { to, subject, text }) {
  return new Promise((resolve, reject) => {
    let socket = implicitTls ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    let buffer = "";
    let done = false;
    const queue = [];
    let waiting = null;

    const fail = (error) => {
      if (done) return;
      done = true;
      try { socket.destroy(); } catch (_) { /* already gone */ }
      reject(error instanceof Error ? error : new Error(String(error)));
    };

    const onReply = (code, line) => {
      if (waiting) {
        const { expect, resolveStep } = waiting;
        waiting = null;
        if (!expect.includes(code)) return fail(new Error(`SMTP ${code}: ${line.trim()}`));
        resolveStep(line);
      }
      pump();
    };

    const send = (line, expect) => new Promise((resolveStep) => {
      queue.push({ line, expect, resolveStep });
      pump();
    });

    function pump() {
      if (waiting || !queue.length) return;
      const step = queue.shift();
      waiting = step;
      if (step.line !== null) socket.write(`${step.line}\r\n`);
    }

    const attach = () => {
      socket.setEncoding("utf8");
      socket.on("data", (chunk) => {
        buffer += chunk;
        let index;
        while ((index = buffer.indexOf("\r\n")) !== -1) {
          const line = buffer.slice(0, index + 2);
          buffer = buffer.slice(index + 2);
          // Multi-line replies use "250-"; only the final "250 " completes the step.
          if (/^\d{3}-/.test(line)) continue;
          const code = Number(line.slice(0, 3));
          onReply(code, line);
        }
      });
      socket.on("error", fail);
      socket.on("close", () => { if (!done) fail(new Error("SMTP connection closed unexpectedly")); });
    };

    attach();
    socket.setTimeout?.(20000, () => fail(new Error("SMTP timeout")));

    (async () => {
      try {
        await send(null, [220]);
        await send(`EHLO ${host}`, [250]);
        if (!implicitTls) {
          await send("STARTTLS", [220]);
          const plain = socket;
          plain.removeAllListeners("data");
          plain.removeAllListeners("error");
          plain.removeAllListeners("close");
          socket = tls.connect({ socket: plain, servername: host });
          buffer = "";
          attach();
          await new Promise((ok, no) => { socket.once("secureConnect", ok); socket.once("error", no); });
          await send(`EHLO ${host}`, [250]);
        }
        if (user) {
          await send("AUTH LOGIN", [334]);
          await send(Buffer.from(user, "utf8").toString("base64"), [334]);
          await send(Buffer.from(pass, "utf8").toString("base64"), [235]);
        }
        await send(`MAIL FROM:<${from}>`, [250]);
        await send(`RCPT TO:<${to}>`, [250, 251]);
        await send("DATA", [354]);
        await send(`${buildMessage({ from, to, subject, text })}\r\n.`, [250]);
        await send("QUIT", [221]);
        done = true;
        socket.end();
        resolve({ delivered: true, transport: "smtp" });
      } catch (error) {
        fail(error);
      }
    })();
  });
}


// --- Microsoft Graph ---------------------------------------------------------

// Small JSON-over-HTTPS helper so Graph needs no dependencies either.
function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, raw }));
    });
    req.on("error", reject);
    req.setTimeout(20000, () => req.destroy(new Error("Graph request timed out")));
    if (body) req.write(body);
    req.end();
  });
}

// Tokens last about an hour; cache until shortly before expiry rather than
// authenticating on every message.
let graphToken = { value: "", expiresAt: 0 };

async function graphAccessToken(settings) {
  if (graphToken.value && Date.now() < graphToken.expiresAt) return graphToken.value;
  const payload = new URLSearchParams({
    client_id: settings.graphClientId,
    client_secret: settings.graphClientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  }).toString();
  const res = await httpsRequest({
    method: "POST",
    hostname: "login.microsoftonline.com",
    path: `/${encodeURIComponent(settings.graphTenantId)}/oauth2/v2.0/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(payload)
    }
  }, payload);
  let parsed = {};
  try { parsed = JSON.parse(res.raw); } catch (_) { /* reported below */ }
  if (res.status !== 200 || !parsed.access_token) {
    const detail = parsed.error_description || parsed.error || res.raw.slice(0, 300);
    throw new Error(`Graph token request failed (${res.status}): ${detail}`);
  }
  graphToken = {
    value: parsed.access_token,
    expiresAt: Date.now() + Math.max(0, (Number(parsed.expires_in || 3600) - 120)) * 1000
  };
  return graphToken.value;
}

async function sendViaGraph(settings, { to, subject, text }) {
  for (const [name, value] of [["GRAPH_TENANT_ID", settings.graphTenantId], ["GRAPH_CLIENT_ID", settings.graphClientId], ["GRAPH_CLIENT_SECRET", settings.graphClientSecret], ["GRAPH_SENDER", settings.graphSender]]) {
    if (!value) throw new Error(`${name} is required for the graph transport`);
  }
  const token = await graphAccessToken(settings);
  const payload = JSON.stringify({
    message: {
      subject,
      body: { contentType: "Text", content: text },
      toRecipients: [{ emailAddress: { address: to } }]
    },
    // Sign-in codes are transient; keeping them in Sent Items adds no value.
    saveToSentItems: false
  });
  const res = await httpsRequest({
    method: "POST",
    hostname: "graph.microsoft.com",
    path: `/v1.0/users/${encodeURIComponent(settings.graphSender)}/sendMail`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  }, payload);
  // Graph answers 202 Accepted on success and returns no body.
  if (res.status !== 202) {
    let detail = res.raw.slice(0, 400);
    try { detail = JSON.parse(res.raw).error?.message || detail; } catch (_) { /* keep raw */ }
    throw new Error(`Graph sendMail failed (${res.status}): ${detail}`);
  }
  return { delivered: true, transport: "graph" };
}

async function sendMail({ to, subject, text }) {
  const settings = config();
  if (settings.transport === "smtp") {
    return sendViaSmtp(settings, { to, subject, text });
  }
  if (settings.transport === "graph") {
    return sendViaGraph(settings, { to, subject, text });
  }
  // Default transport: the message goes to the server log so the flow is testable
  // end to end before mail delivery exists.
  console.log(`[mail:log] to=${to} subject=${subject}\n${text}\n`);
  return { delivered: true, transport: "log" };
}

module.exports = { sendMail, mailerTransport: () => config().transport };
