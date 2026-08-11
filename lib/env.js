// Loads settings from a .env file next to the application.
//
// Environment variables set in a terminal only exist in that terminal. Setting
// them and then starting the server from a different window - or after a reboot -
// silently leaves mail switched off, which looks exactly like sign-in being
// broken. A file removes that whole class of problem.
//
// Real environment variables always win, so containers and systemd are unaffected.
const fs = require("fs");
const path = require("path");

function parse(text) {
  const out = {};
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Allow quoting, which matters for passwords containing spaces or #.
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

function loadEnv(root = path.join(__dirname, "..")) {
  const file = path.join(root, ".env");
  if (!fs.existsSync(file)) return { loaded: false, file, keys: [] };
  let values = {};
  try {
    values = parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`[env] could not read ${file}: ${error.message}`);
    return { loaded: false, file, keys: [] };
  }
  const applied = [];
  for (const [key, value] of Object.entries(values)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
      applied.push(key);
    }
  }
  return { loaded: true, file, keys: applied };
}

module.exports = { loadEnv, parse };
