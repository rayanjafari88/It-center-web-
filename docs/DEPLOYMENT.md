# Deployment Guide

Everything needed to run IT Command Center inside the company.

## 1. Requirements

- Node.js 20 or newer (no runtime dependencies to install)
- A host that can reach your mail server
- A reverse proxy terminating TLS (IIS, nginx, or Caddy)

## 2. Configuration

All configuration is environment variables. Nothing secret belongs in `data/db.json`.

| Variable | Default | What it does |
| --- | --- | --- |
| `PORT` | `4173` | Port the application listens on |
| `COOKIE_SECURE` | `false` | **Set to `true` in production.** Marks the session cookie `Secure` so it is only ever sent over HTTPS |
| `STRICT_TRANSPORT` | `true` | Sends HSTS when `COOKIE_SECURE` is also on |
| `MAIL_TRANSPORT` | `log` | `log` writes sign-in codes to the server log; `smtp` sends real email; `graph` sends via Microsoft Graph |
| `SMTP_HOST` | `smtp.office365.com` | Mail server |
| `SMTP_PORT` | `587` | `587` uses STARTTLS, `465` uses implicit TLS |
| `SMTP_USER` / `SMTP_PASS` | – | Mailbox credentials used to send |
| `SMTP_FROM` | `SMTP_USER` | The From address staff will see |
| `GRAPH_TENANT_ID` / `GRAPH_CLIENT_ID` / `GRAPH_CLIENT_SECRET` | – | App registration used by the `graph` transport |
| `GRAPH_SENDER` | – | Licensed mailbox the `graph` transport sends from |
| `MAX_UPLOAD_BYTES` | `10485760` | Attachment size limit (10 MB) |
| `BACKUP_INTERVAL_MS` | `900000` | Minimum gap between database snapshots (15 min) |
| `BACKUP_KEEP` | `48` | Snapshots retained before the oldest is pruned |

### Minimum production settings

```bash
PORT=4173
COOKIE_SECURE=true
MAIL_TRANSPORT=smtp
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=it-helpdesk@yourcompany.com
SMTP_PASS=<mailbox password or app password>
SMTP_FROM=it-helpdesk@yourcompany.com
```

> `COOKIE_SECURE=true` requires HTTPS. If you set it without TLS in front, nobody
> will be able to sign in, because the browser will refuse to return the cookie.

## 3. TLS

The application speaks plain HTTP and expects a proxy in front of it. Terminate TLS
there and forward to `PORT`. Without this the session cookie and the sign-in codes
travel in clear text on your network.

## 4. First run

```bash
npm start
```

On first boot the application will:

- create `data/db.json` if missing
- **hash any plaintext passwords in place** (originals are never written back)
- move any attachment bytes still stored inside the database out to `data/files/`
- create `data/files/` and `data/backups/`

## 5. Signing in

Primary path is passwordless:

1. The user enters their work email.
2. A 6-digit code is emailed to them.
3. The code signs them in. It expires in 10 minutes and works once.

An employee who has a mailbox but no account yet is **created automatically** on
first sign-in and linked to their employee record, so accounts do not have to be
provisioned in advance.

Sessions last 30 days for employees and 12 hours for Admin / IT Manager / IT Staff.

### Two-step sign-in (do this for every IT account)

Go to **Preferences → Two-step sign-in → Set up**, add the key to Microsoft or
Google Authenticator, and confirm with the 6-digit code.

This matters more than it looks. If the mail system is down, email codes cannot be
delivered — and that is exactly when IT needs to raise incidents. An authenticator
app works with no network dependency at all. Treat it as required for the three
privileged accounts, not optional.

## 6. Backups

A snapshot is written to `data/backups/` at most every 15 minutes, and the newest
48 are kept (about 12 hours of history). Database writes are atomic: the file is
written to a temporary name and renamed over the target, so a crash mid-write
cannot truncate it.

**This is not an offsite backup.** Copy `data/` to separate storage on your normal
backup schedule. It holds everything: the database, uploaded files, and snapshots.

### Restoring

```bash
# stop the application first
cp data/backups/db-<timestamp>.json data/db.json
# start it again
```

Attachments are referenced by `storagePath` and live in `data/files/`, so restore
both directories together or attachments will be missing.

## 7. What to back up

| Path | Contents |
| --- | --- |
| `data/db.json` | All records |
| `data/files/` | Uploaded attachment bytes |
| `data/backups/` | Rolling snapshots |

## 8. Health check

`GET /api/auth/config` returns `200` without a session and is safe to use as a
liveness probe. Every other API route returns `401` without one.

## 9. Security notes

- Identity comes only from a server-side session. No header or parameter can name a user.
- Session tokens are stored hashed, so a copy of the database cannot be replayed into a live session.
- Passwords use scrypt. Sign-in codes are hashed with a per-code salt and compared in constant time.
- Sign-in is rate limited per address and per source IP.
- Requesting a code for an unknown address returns the same response as a known one, so the endpoint cannot be used to enumerate staff.
- Responses carry `nosniff`, `X-Frame-Options: DENY`, and a Content-Security-Policy that forbids framing and third-party code.
- Attachments are always served as downloads with `nosniff`, never rendered inline from the API.

## 10. Known limits

- `/api/state` returns everything the signed-in role may see in one payload. That
  is fine at the current scale but will need pagination as ticket history grows.
- The datastore is a single JSON file. It suits this size of company; it is not a
  concurrent database.
