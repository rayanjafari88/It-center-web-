// Authentication primitives: sessions, password hashing, email sign-in codes and
// TOTP. Built on node's crypto module only, so the project keeps zero runtime
// dependencies.
const crypto = require("crypto");

const SESSION_COOKIE = "itcc_session";
// Employees sign in rarely, so a long session avoids pointless re-authentication.
// Privileged roles get a short one because their access is worth far more.
const SESSION_TTL_MS = {
  role_employee: 30 * 24 * 60 * 60 * 1000,
  default: 12 * 60 * 60 * 1000
};
const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_MAX_ATTEMPTS = 5;

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

// Session tokens are stored hashed, so a leaked database cannot be used to
// impersonate a live session.
function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

// --- passwords ------------------------------------------------------------

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

function isHashedPassword(value) {
  return typeof value === "string" && value.startsWith("scrypt$");
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!isHashedPassword(stored)) return false;
  const [, salt, expected] = String(stored).split("$");
  if (!salt || !expected) return false;
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return timingSafeEqual(derived, expected);
}

// --- email sign-in codes --------------------------------------------------

// Readable but unguessable: avoids characters that are easily confused when a
// password is read out or written down.
function generateTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 14; i += 1) out += alphabet[crypto.randomInt(0, alphabet.length)];
  return out;
}

function generateLoginCode() {
  // 6 digits, uniformly distributed.
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function hashLoginCode(code, salt) {
  return crypto.createHmac("sha256", String(salt)).update(String(code)).digest("hex");
}

// --- TOTP (RFC 6238), for privileged break-glass access -------------------
// Works with any authenticator app and, critically, without email delivery.

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function generateTotpSecret(length = 20) {
  const bytes = crypto.randomBytes(length);
  let bits = "";
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");
  let secret = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) secret += BASE32[parseInt(bits.slice(i, i + 5), 2)];
  return secret;
}

function base32Decode(secret) {
  let bits = "";
  for (const char of String(secret).toUpperCase().replace(/=+$/, "")) {
    const index = BASE32.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

function totpAt(secret, counter) {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  buffer.writeUInt32BE(counter >>> 0, 4);
  const digest = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const value = ((digest[offset] & 0x7f) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3];
  return String(value % 1_000_000).padStart(6, "0");
}

// A one-step window either side absorbs clock drift between phone and server.
function verifyTotp(secret, token, window = 1) {
  if (!secret || !/^\d{6}$/.test(String(token || ""))) return false;
  const counter = Math.floor(Date.now() / 30000);
  for (let drift = -window; drift <= window; drift += 1) {
    if (timingSafeEqual(totpAt(secret, counter + drift), String(token))) return true;
  }
  return false;
}

function totpUri(secret, account, issuer = "IT Command Center") {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&period=30&digits=6`;
}

// --- cookies --------------------------------------------------------------

function parseCookies(header) {
  const out = {};
  for (const part of String(header || "").split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return out;
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", `SameSite=${options.sameSite || "Strict"}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  // Secure is required for real deployments but breaks plain-http local testing.
  if (options.secure) parts.push("Secure");
  return parts.join("; ");
}

module.exports = {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  CODE_TTL_MS,
  CODE_MAX_ATTEMPTS,
  randomToken,
  hashToken,
  timingSafeEqual,
  hashPassword,
  isHashedPassword,
  verifyPassword,
  generateLoginCode,
  generateTemporaryPassword,
  hashLoginCode,
  generateTotpSecret,
  totpAt,
  verifyTotp,
  totpUri,
  parseCookies,
  serializeCookie
};
