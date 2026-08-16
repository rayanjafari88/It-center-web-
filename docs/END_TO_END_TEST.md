# End-to-End Test: Ticket Lifecycle

A complete run of the system as real users would use it, from an employee raising a
request to IT resolving it.

Run on a **copy** of the production database so the live system stayed clean. Names
are omitted here because this repository is public; the run itself used real
imported staff records.

- **Data**: 500 imported employees, 52 departments, 42 ticket categories
- **Accounts**: 1 System Admin, 1 IT Manager, 1 IT Staff
- **Mail**: log transport, so codes could be captured and asserted

---

## Step 0 — Admin configures routing

Signed in as System Admin via email code, then set category routing:

| Category | Routed to |
| --- | --- |
| Hardware & Devices | IT Staff |
| Accounts & Access | IT Staff |
| Network & Connectivity | IT Staff |
| Software & Applications | IT Manager |
| Service Requests | IT Manager |
| *anything else* | IT Manager (fallback) |

`PATCH /api/settings/ticket-assignment` → **200**

## Step 1 — Employee signs in for the first time

The employee had **no account**. Requesting a code created one automatically and
linked it to their imported employee record.

```
POST /api/auth/request-code   → 200   (code emailed)
POST /api/auth/verify-code    → 200
```

Result: account created, role **Employee**, linked to employee no. 1004.

> This is why 500 accounts did not have to be provisioned up front.

## Step 2 — Employee raises a ticket

Submitted through the guided wizard in the browser: category **Hardware & Devices
→ Laptop**, description written in Arabic.

On success a paper aeroplane flies off the screen and the request is confirmed as
sent. The animation is decoration only - its own layer, `pointer-events: none`,
`aria-hidden`, and it removes itself when the flight ends. It is skipped entirely
for anyone whose system asks for reduced motion, and in Arabic it flies the other
way, following the reading direction.

| Field | Value |
| --- | --- |
| Ticket | **TCK-0001** |
| Category | Hardware & Devices / Laptop |
| Status | open |
| **Assigned to** | **IT Staff** |
| Method | `category` |

The employee never chose an assignee. Routing did it from the category alone.

## Step 3 — IT Staff receives it

Signed in as IT Staff and loaded the workspace.

- Ticket present in their queue: **yes** (TCK-0001)
- Notification received: **"Ticket auto-assigned — TCK-0001 was assigned to you."**

## Step 4 — Work begins

```
PATCH /api/tickets/{id}  {"status":"in_progress"}   → 200
```

## Step 5 — Conversation, including a private note

| Author | Message | Visibility |
| --- | --- | --- |
| IT Staff | "Received, I will check the device today." (Arabic) | public |
| IT Staff | "Internal: battery diagnostics scheduled." | **internal** |

**Isolation check** — the employee's own view returned **1 comment, not 2**, and
the internal note appeared nowhere in their payload.

## Step 6 — Resolution

```
PATCH /api/tickets/{id}  {"status":"resolved"}   → 200
```

## Step 7 — What the employee sees

- Ticket status: **resolved**
- Notifications received: **3** — *Ticket resolved*, *Comment added*, *Ticket status changed*

## Step 8 — Audit trail

Every action recorded, attributed to the person who performed it:

| Action | By |
| --- | --- |
| `create` | Employee |
| `auto_assign` | (system, on the employee's request) |
| `status_change` | IT Staff |
| `comment` ×2 | IT Staff |
| `resolve` | IT Staff |

Every entry is attributed to the person who performed it.

---

## Result

| Capability | Outcome |
| --- | --- |
| Passwordless sign-in by email code | pass |
| Account auto-provisioning on first sign-in | pass |
| Ticket creation with the category tree | pass |
| Category-based automatic routing | pass |
| Notification to the assignee | pass |
| Status transitions open → in progress → resolved | pass |
| Two-way conversation | pass |
| Internal notes hidden from the requester | pass |
| Requester notified of progress and resolution | pass |
| Full audit trail with attribution | pass |
| Arabic content end to end | pass |
| Paper aeroplane on submit, then self-removes | pass |
| Animation skipped under reduced motion | pass |

**13 of 13 checks passed.**

## Notes

- `ticket.history` stays empty on new tickets. It is a legacy field, hidden from
  the interface; the timeline is the record that is actually used and displayed.
- The run used the `log` mail transport so codes could be asserted. Live mail
  (Gmail SMTP) was verified separately and delivers to real inboxes.

## Reproducing

```bash
# against a copy, never the live database
cp data/db.json /tmp/itcc-test/db.json
DATA_DIR=/tmp/itcc-test MAIL_TRANSPORT=log PORT=4410 node server.js
```

Then follow the steps above. The automated suite covers the same ground:

```bash
npm test              # regression
npm run test:security # authentication and isolation
```
