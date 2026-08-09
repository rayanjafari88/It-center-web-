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

## Fastest way to get codes arriving (about 5 minutes)

Use a Gmail account as the sender. No admin console, no app registration. Good
enough to pilot with real people today; move to a company mailbox later.

1. On the Google account you will send from, turn on **2-Step Verification**
   (required before app passwords exist): <https://myaccount.google.com/security>
2. Create an app password: <https://myaccount.google.com/apppasswords> — pick
   "Mail", copy the 16-character value.
3. Run:

```powershell
$env:MAIL_TRANSPORT='smtp'
$env:SMTP_HOST='smtp.gmail.com'
$env:SMTP_PORT='587'
$env:SMTP_USER='youraccount@gmail.com'
$env:SMTP_PASS='<the 16-character app password>'
$env:SMTP_FROM='youraccount@gmail.com'
npm run mail:test -- youraccount@gmail.com
```

If that says SENT, run `npm start` in the same window and sign-in codes will
arrive by email.

Gmail allows roughly 500 messages a day, which is ample for sign-in codes.

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

## Option B — Microsoft Graph (no SMTP AUTH needed)

Use this when the tenant will not permit SMTP AUTH, or when you would rather not
store a mailbox password at all. It authenticates with OAuth against an app
registration, which is what Microsoft now recommends.

### Step 1 — register the application

1. Entra admin centre (or Azure portal) → **App registrations** → **New registration**
2. Name it something like `IT Command Center mail`, single tenant, no redirect URI
3. From the **Overview** page copy:
   - **Application (client) ID** → `GRAPH_CLIENT_ID`
   - **Directory (tenant) ID** → `GRAPH_TENANT_ID`

### Step 2 — grant permission to send

1. **API permissions** → **Add a permission** → **Microsoft Graph**
2. Choose **Application permissions** — *not* Delegated. Delegated will not work
   for this flow, and it is the usual mistake.
3. Select **Mail.Send** → Add
4. Click **Grant admin consent**. Without this the app can authenticate but every
   send returns 403.

### Step 3 — create a client secret

**Certificates & secrets** → **New client secret** → copy the **Value** (not the
Secret ID; it is only shown once) → `GRAPH_CLIENT_SECRET`.

> Secrets expire — 24 months at most. Put the expiry date in a calendar, because
> sign-in for the whole company stops when it lapses.

### Step 4 — pick the sending mailbox

`GRAPH_SENDER` must be a **real licensed mailbox** in the tenant, for example
`it-helpdesk@amjad-almutahidah.com`. An alias or unlicensed account returns 404.

> By default the app can send as *any* mailbox in the tenant. To restrict it to
> one, apply an **application access policy** in Exchange Online:
>
> ```powershell
> New-ApplicationAccessPolicy -AppId <client id> `
>   -PolicyScopeGroupId it-helpdesk@amjad-almutahidah.com `
>   -AccessRight RestrictAccess -Description "ITCC sign-in mail only"
> ```

### Step 5 — configure and test

```powershell
$env:MAIL_TRANSPORT='graph'
$env:GRAPH_TENANT_ID='<directory tenant id>'
$env:GRAPH_CLIENT_ID='<application client id>'
$env:GRAPH_CLIENT_SECRET='<secret value>'
$env:GRAPH_SENDER='it-helpdesk@amjad-almutahidah.com'
npm run mail:test -- your.name@amjad-almutahidah.com
```

### Graph failures the test explains

| What you see | What it means |
| --- | --- |
| `AADSTS7000215` / `invalid_client` | Secret wrong or expired |
| `AADSTS700016` / `unauthorized_client` | Client id not in that tenant |
| `AADSTS53003` / Conditional Access | A policy blocks the service principal |
| `403` / `Authorization_RequestDenied` | Mail.Send missing, or admin consent not granted |
| `404` / `MailboxNotEnabled` | `GRAPH_SENDER` is not a licensed mailbox |

## Option C — a high-volume connector

An IP-restricted relay in Exchange Online, requiring no credentials at all. Suits
a server with a fixed internal address. Configure it as an unauthenticated SMTP
relay and point `SMTP_HOST` at it with `MAIL_TRANSPORT=smtp` and no `SMTP_USER`.

## A note on personal email addresses

340 of the imported employees use `gmail.com` and only 132 use
`amjad-almutahidah.com`. Sign-in codes will therefore be delivered to mailboxes
the company does not control. That works, but it means:

- Removing someone's company account does **not** cut off their access. You must
  disable them in this system as well, which takes effect immediately.
- A compromised personal inbox becomes access to company ticket data.

Where you can, prefer company addresses — especially for anyone with IT Staff,
IT Manager or Admin rights.
