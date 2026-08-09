# Email Setup

Sign-in codes are emailed. Until this is configured they are printed to the server
console instead, and **no email is sent** — which looks exactly like the system
being broken.

## Where the code is right now

If you have not configured mail yet, look at the terminal running `npm start`:

```text
[mail:log] to=you@example.com subject=Your IT Command Center sign-in code
Your sign-in code is 387060
```

That is the working sign-in code. This is fine for your own testing and useless
for staff.

## Turning on real email

### Step 1 — check SMTP AUTH is allowed

**Do this first.** Microsoft 365 disables SMTP AUTH by default for every tenant
created since 2020, and it is the single most common reason this fails.

1. Microsoft 365 admin centre → **Users** → **Active users**
2. Pick the mailbox you will send from (for example `it-helpdesk@amjad-almutahidah.com`)
3. **Mail** tab → **Manage email apps**
4. Tick **Authenticated SMTP** → Save

Changes can take up to an hour to apply.

### Step 2 — get a password that works

If the sending mailbox has MFA enabled — and it should — a normal password will
be rejected. Create an **app password**:

1. Sign in as that mailbox at <https://mysignins.microsoft.com/security-info>
2. **Add sign-in method** → **App password**
3. Copy the generated password; it is shown once

### Step 3 — set the variables

**Windows (PowerShell), for a quick test:**

```powershell
$env:MAIL_TRANSPORT='smtp'
$env:SMTP_HOST='smtp.office365.com'
$env:SMTP_PORT='587'
$env:SMTP_USER='it-helpdesk@amjad-almutahidah.com'
$env:SMTP_PASS='<app password>'
$env:SMTP_FROM='it-helpdesk@amjad-almutahidah.com'
npm start
```

**Docker:** copy `.env.example` to `.env`, fill in the same values, then
`docker compose up -d`.

**systemd:** put them in `/etc/itcc.env` (see `deploy/itcc.env`).

> Keep the password out of the repository. `.env` is already git-ignored, and
> `data/db.json` is too.

### Step 4 — test before letting staff near it

```bash
npm run mail:test -- your.name@amjad-almutahidah.com
```

It prints the settings it is using, sends one message, and if it fails explains
why in plain language rather than showing a raw SMTP error.

## Common failures

| What you see | What it means | Fix |
| --- | --- | --- |
| `SmtpClientAuthentication is disabled` / `535 5.7.139` | SMTP AUTH is off for that mailbox | Step 1 above |
| `535` / `Authentication unsuccessful` | Password rejected | Use an app password (Step 2) |
| `ETIMEDOUT` / `ECONNREFUSED` | Port 587 outbound blocked | Ask whoever manages the firewall |
| `ENOTFOUND` | Hostname wrong | Check `SMTP_HOST` |
| Sends, but nothing arrives | Delivered to Junk | Check junk; consider an SPF record for the sending host |

## If SMTP AUTH cannot be enabled

Some organisations will not allow it. Two alternatives:

- **A high-volume connector in Exchange Online** — an IP-restricted relay that
  requires no mailbox credentials. Suits a server with a fixed internal address.
- **Microsoft Graph with an app registration** — OAuth rather than a password,
  and the option Microsoft prefers. `lib/mailer.js` is written so a Graph
  transport slots in beside SMTP without changing anything that calls it.

Tell me which route you take and I will wire it up.

## A note on personal email addresses

340 of the imported employees use `gmail.com` and only 132 use
`amjad-almutahidah.com`. Sign-in codes will therefore be delivered to mailboxes
the company does not control. That works, but it means:

- Removing someone's company account does **not** cut off their access. You must
  disable them in this system as well, which takes effect immediately.
- A compromised personal inbox becomes access to company ticket data.

Where you can, prefer company addresses — especially for anyone with IT Staff,
IT Manager or Admin rights.
