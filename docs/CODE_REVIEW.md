# IT Command Center V1 — Review Notes

Review of the V1 prototype: what was broken, what was changed, and what to do
next. Verified against Node 24 with the bundled QA suites (28 Node tests) and
the Playwright browser suite (24 tests) — all 52 pass before and after the
changes described here.

---

## 1. Defects found and fixed

### 1.1 The app rendered nothing in a background tab — **high**

`render()` in `public/app.js` painted a skeleton, then filled `#content`
inside a `requestAnimationFrame` callback. Browsers do not run animation
frames in a hidden or backgrounded tab, so the page sat on its loading
skeleton indefinitely until the tab was focused.

Fixed by scheduling through a small `afterPaint()` helper that falls back to
`setTimeout` when `document.visibilityState === "hidden"`.

### 1.2 Ticket list rows overlapped and were unreadable — **high**

`.ticket-workspace-list` was a CSS grid whose auto-sized tracks mis-measured
the nested-grid list rows. Each row was clamped to its `min-height` (68px)
while its content laid out to ~125px, so every row's lower half printed on
top of the row beneath it. Only the selected row, which was taller, looked
correct.

Fixed by making the list a flex column so rows size to their content, and
placing the status badges and the assignment indicator on a shared row so a
ticket entry is four lines instead of five.

### 1.3 Sidebar text was invisible in light mode — **high**

`.brand strong`, `.sidebar-footer strong` and `.nav-section-toggle` carried
hardcoded near-white colours (`#f8fbff`, `#fff`, `#d7e2f3`) left over from an
earlier design where the sidebar rail was permanently dark. A later layer
relit the rail using theme tokens but never updated the text colours, so the
product name, the signed-in user and the navigation group headings all
disappeared against the light rail.

### 1.4 The ticket detail rail was unreadable in dark mode — **high**

`.ticket-v2-side-panel` had a hardcoded `background: #fff`, and
`.ticket-v2-list-head strong` / `.workspace-ticket-subject` had a hardcoded
`color: #0f172a`. In dark mode this produced a white panel behind light text,
and near-black text on dark panels. The whole "Ticket Information" rail was
effectively blank.

All colours in these paths now come from tokens. A sweep across 20 modules in
dark mode now reports zero light-on-light or dark-on-dark text.

### 1.5 Advertised demo credentials did not work — **medium**

The login screen and `server.js`'s seed both said `staff / staff123`, but the
shipped `data/db.json` had drifted to `manager123`, so the credentials printed
on the sign-in form returned 401. `data/db.json` now matches the seed and the
clean demo snapshot, and `README.md` was corrected to agree.

### 1.6 Headings had no typography — **medium**

The page loaded Tailwind's Play CDN purely for its preflight reset, which
strips the browser's default heading sizes. Nothing restored them, so every
bare `<h1>`/`<h2>`/`<h3>` rendered at body size and weight — most visibly the
`<h1>` on the sign-in screen, which looked like a paragraph.

### 1.7 Header breadcrumb collided with the page title — **low**

The topbar had a fixed `min-height` and an unconstrained breadcrumb, so the
crumb wrapped to two lines and overlapped the page title. The breadcrumb also
began with a decorative dot that read as a rendering artifact, and repeated
"IT Command Center" — already shown in the sidebar — which pushed the useful
part off the end.

### 1.8 Dashboard hero buttons overlapped the heading — **medium**

Between 721px and 1280px wide, `.hero-actions` was absolutely positioned over
the hero copy, with room reserved by a physical `padding-right: 190px`. The
reserved gutter was narrower than the buttons themselves (~230–250px), so they
printed on top of the heading in English — and in Arabic the gutter sits on the
opposite side from the buttons, so they landed squarely across the title.

The actions are now an ordinary grid item in the hero's second column, which
sizes itself to the buttons and mirrors automatically under `dir="rtl"`. A
sweep for absolutely-positioned elements colliding with text now reports clean
across 12 modules × 4 widths × both writing directions.

This one is worth generalising: the stylesheet uses physical `left`/`right`/
`padding-right` in several media queries. Those are invisible in English and
break only in Arabic. Prefer the logical equivalents (`inset-inline-start`,
`padding-inline-end`) so RTL is correct by construction.

### 1.9 The tickets page clipped content out of reach — **high**

A single rule put the whole shell into a viewport-locked mode, but only on this
one screen:

```css
body:has(.ticket-workspace-v2) { overflow: hidden; }
body:has(.ticket-workspace-v2) .main    { height: 100vh; overflow: hidden; }
body:has(.ticket-workspace-v2) #content { overflow: hidden; }
```

Every other module scrolls as an ordinary document — the dashboard renders
2,133px tall, the audit feed 17,426px. On tickets the page could not scroll at
all, and `#content` was 725px tall holding 1,177px of content with
`overflow: hidden`. Anything past the fold was clipped and unreachable unless
it happened to sit inside one of the four nested scroll panes (list, detail
main, info rail, tab strip). In practice the info rail's lower sections —
Knowledge Suggestions, Attachments, Watchers — were reachable only by finding
and using that pane's own scrollbar.

The tickets page now uses the same page-scroll model as the rest of the app:
the detail column and info rail flow at their natural height and the document
scrolls once. Each region is drawn as a bordered block so the layout stays
readable without scrollbars to delimit it. The ticket list keeps a bounded
scroll of its own — it is a navigator rather than part of the record — and
sticks below the header as the page scrolls.

Nested scroll panes are worth avoiding generally here: they hide how much
content exists, they make "scroll to the bottom" ambiguous, and as this case
shows, one wrong height turns a scrollable region into a clipped one.

### 1.10 The two account-creation paths wrote different records — **high**

A login account can be created from two places: **New Service Account** on the
User Accounts page, and **System Access** while creating a Person. They shared
no code, and the records they produced differed:

| | New Service Account | Person → System Access |
| --- | --- | --- |
| Fields collected | name, username, email, password, confirm, role, account type, status, expiry, linked person | username, role, temporary password, confirm, require-change, send welcome email |
| `requirePasswordChange` default | **false** (`Boolean(undefined)`) | **true** (`!== false`) |
| `accountType` default | `"Service"` | role-derived, always `"Employee"` |
| `expiryDate` when unset | `undefined` (key absent) | `""` |
| Input names | `username`, `password`, `roleId` | `accountUsername`, `accountTemporaryPassword`, `accountRoleId` |

So the same checkbox produced opposite stored values depending on which screen
was used, and `data/db.json` accumulated user rows with different key sets.
Three further problems: `requirePasswordChange` was declared in the users
schema with `default: true` but the modal never rendered it, so it silently
resolved to `false`; the Person form's payload mapping referenced
`accountEmail`, `accountExpiryDate` and `accountEnabled`, none of which that
form rendered; and **Send welcome email** was collected and then discarded —
`sendWelcomeEmail` appears nowhere in `server.js`.

Both forms now render from one definition (`accountFieldsHtml`) and funnel
through one normaliser (`normaliseAccountPayload`), so they collect the same
eleven inputs with the same labels, order and required rules. The Person form
namespaces its inputs with an `account` prefix — it has to, because the form
already owns `name`, `email` and `status` for the person — and shows the linked
person as fixed text rather than a selector, since that link is already
decided. Server-side, `resolveAccountType()` replaces the two divergent rules:
an account with no linked person is `Service`, one attached to a person is
role-derived. `requirePasswordChange` now defaults to `true` on both paths.

`qa-account-parity.js` creates an account through each path and diffs the
stored records field by field. It currently reports identical key sets and no
value differences.

**Registration is now a single page.** Having two entry points was the root of
the drift, so they were merged into one form on User Accounts. It asks what the
login is for, then adapts:

| Choice | What is created |
| --- | --- |
| Service Account | user record, no linked person |
| Employee Account | user record linked to an existing People record |

Both post to `POST /api/users`, and Account Details is the same shared field
set either way, so the stored record has one shape regardless of route.
Selecting a person fills the account name and email from their record until
the values are edited.

**A third account form existed and also diverged.** `openPersonAccountDialog()`
was opened by the "Create Account" buttons on a person's record and rendered
its own bespoke set: `username`, `email`, `roleId`, `temporaryPassword`,
`expiryDate`, `requirePasswordChange` — no account name, no account type, no
status, no password confirmation, and `temporaryPassword` rather than
`password` again. It was missed in the first pass because it is opened by a
button handler rather than through `openModal()`. All three "create a login for
this person" entry points now open the shared account form pre-linked to that
person, and the bespoke dialog was deleted.

The System Access block was removed from the People form, along with
`personSystemAccessHtml()` and `wirePersonSystemAccess()`. Registering the
*person* now lives in a list-actions menu inside the People workspace rather
than a header button, keeping page headers clean while staying reachable to IT
Staff — who can create people but cannot open Settings, so moving it into
Settings would have silently removed that ability.

Both record types now start from the People page, each gated on the permission
that drives it so what appears matches what the role can actually do:

| Action | Where | Permission |
| --- | --- | --- |
| New Account | People page header | `users.create` |
| Register Person | People gear menu | `employees.create` |
| Export list | People gear menu | `employees.export` |

**New Account** sits in the page header rather than the menu because it is the
primary action here and a menu hid it — it was reported as missing after the
first attempt put it in the dropdown. IT Staff see neither the header button
nor Export, since they can create people but not logins.

The User Accounts page no longer carries its own create button — it is now a
management view for existing logins, which keeps one entry point per action
rather than two.

### 1.11 People Excel import and export

People records now carry the columns the customer's workbook uses, and can be
imported from and exported to that exact layout.

**Field mapping** (Sheet1, row 1 is the `إجبارية` marker, row 2 the headers,
data from row 3):

| Column | Field |
| --- | --- |
| الرقم الوظيفي | `employeeNo` |
| الاسم الكامل (عربي) | `name` |
| اسم الموقع | `location` |
| القسم | `departmentId` — resolved by name, created when new |
| المدير المباشر | `managerId` — resolved from the leading employee number |
| البريد الإلكتروني | `email` |
| المسمى الوظيفي | `jobTitle` |
| وحدة العمل | `businessUnit` — **added** |
| رمز الهاتف الدولي | `phoneCountryCode` — **added** |
| رقم الجوال | `phone` |

Import matches existing people by employee number, so re-importing updates
rather than duplicating. Managers are linked in a second pass, so a manager
listed further down the file resolves correctly. Values seen in the location,
job-title, business-unit and dialing-code columns are added to the lookup lists
so the dropdowns offer them afterwards. The workbook's own
`dropdown_list_items` sheet is retained and re-emitted on export, so an export
can be re-imported unchanged.

**Employee number is the People key.** It is required and unique, enforced on
create and on update, because the import matches rows by it — two people
sharing a number would be indistinguishable on the next import, and an edit
could silently overwrite the wrong record. Every field the form requires
(`employeeNo`, `name`, `departmentId`, `email`) is a column the template
carries, so a workbook always holds enough to create a person. `personType` was
required but is not a column in the workbook, so it now relies on its
`Employee` default instead.

Two bundled tests created people without an employee number and asserted 201.
They encoded the previous contract, so both were updated to supply one rather
than the rule being relaxed.

**No new dependencies.** `lib/xlsx.js` implements the slice of the format
needed — an .xlsx is a ZIP of XML, and Node's `zlib` covers the compression —
rather than adding a spreadsheet library to a project that otherwise has none.

**A bug worth recording.** The first version of the reader matched
`<c ...>…</c>` before the self-closing `<c ... />` form. Because empty cells are
usually omitted from the XML entirely, an open-tag match would run past a
self-closing cell to the *next* `</c>` and swallow it, shifting every later
value one column left. The round-trip test did not catch this: it read with the
same faulty parser it was checking, so the error cancelled out. It only
surfaced when the output was diffed against `openpyxl`. Any codec test needs an
independent implementation on one side.

### 1.12 Other layout fixes

- The "More" button in the ticket workspace was styled as a 38px square icon
  button but labelled with a word, so its text was clipped.
- The decorative grid panel on the sign-in screen rendered as a large empty
  box that read as a broken image.
- The hero banner's actions are absolutely positioned; below ~720px they sat
  on top of the heading. They now flow inline at small widths.

---

## 2. Changes made

| File | Change |
| --- | --- |
| `public/theme.css` | **New.** Reset, base typography, design tokens, and restyled shell/primitives. Loaded after `styles.css`. |
| `public/index.html` | Dropped the Tailwind CDN, linked `theme.css`. |
| `public/app.js` | `afterPaint()` render scheduling; breadcrumb no longer repeats the product name. |
| `data/db.json` | `staff` password realigned to `staff123`. |
| `README.md` | Corrected the staff credential. |

The redesign is deliberately a **separate stylesheet layered on top** rather
than edits threaded through the existing 12,000-line `styles.css`. It keeps
the change reviewable and revertible (delete one `<link>`), and it avoids
touching the markup that the 52 automated tests select against.

### Design direction

- **Tokens first.** `theme.css` redefines the shared custom properties
  (`--surface-elevated`, `--text-primary`, `--border`, `--primary`, the
  semantic colours, radii, shadows, and a type scale), so most of the app
  re-themes by inheritance rather than by per-component overrides.
- **Calmer surfaces.** Flat cards with one hairline border and a very light
  shadow, replacing stacked pastel fills and heavy drop shadows.
- **Status colour carries meaning, not decoration.** Dashboard priority tiles
  are neutral cards with a single tinted accent bar and a tinted icon, instead
  of full pastel backgrounds that made every tile shout equally.
- **Legible density.** Minimum type size raised to ~10.5px, a consistent 4px
  spacing rhythm, and tabular sans figures for record IDs.
- **Both themes from one source.** Light and dark are two token sets; no
  component hardcodes a colour.
- **Accessibility.** A single visible `:focus-visible` ring across all
  controls, a `prefers-reduced-motion` block, and muted text darkened to clear
  4.5:1 on the surfaces it actually sits on.

---

## 3. Recommendations, highest value first

### 3.1 Authentication is not real — do not deploy as-is

`currentUser()` in `server.js` trusts a client-supplied header and falls back
to an admin-adjacent account:

```js
const userId = req.headers["x-user-id"] || "user_manager";
```

Any client can read or write any record as any user by setting one header.
`POST /api/login` verifies a password but issues nothing — no session, no
token — so the login screen is decorative. Passwords are stored and compared
in plaintext (`item.password === body.password`).

This is defensible in a demo, but it means the RBAC model, the audit trail and
the "internal note privacy" tests all rest on a client-controlled value. Before
this handles real data it needs: a signed, httpOnly session cookie or JWT
issued at login; `currentUser()` resolving only from that; password hashing
(bcrypt/argon2); and a constant-time comparison. The bundled "security" suite
passes, but it does not test any of this — worth knowing before the green
result is taken as assurance.

### 3.2 The JSON store will lose data under concurrency

Every API request runs `readDb()`, which reads and parses the whole ~450KB
file **and** runs `migrateDb()` (which builds a fresh seed) before doing any
work. Thirty call sites then `writeDb()` the entire object back with a
non-atomic `fs.writeFileSync`.

Two consequences: the read-modify-write cycle has no locking, so simultaneous
requests silently clobber each other's changes; and a crash mid-write can
truncate the only copy of the data. At minimum, write to a temp file and
rename. Better, move to SQLite — it is a single file, needs no server, and
would remove this whole class of problem.

### 3.3 Split the two large files

`public/app.js` is 9,600 lines and `public/styles.css` is 12,000. The
stylesheet in particular contains at least three generations of design system
layered on top of each other — `.brand strong` is defined four times,
`.sidebar` five — which is exactly how the invisible-text bugs in §1.3 and
§1.4 survived. The winning rule for any selector can only be found by reading
to the end of the file.

Splitting by module (even without a build step, via several `<script>` tags or
ES modules) would make ownership and review tractable. If you do one thing
here, do a dead-rule pass on `styles.css` first — a large fraction is
overridden later and never takes effect.

### 3.4 Serve assets properly

`serveStatic` sets `Content-Type` and nothing else. Each load transfers about
1.0MB uncompressed (`app.js` 681KB + `styles.css` 277KB + `theme.css` 49KB)
with no `Cache-Control` and no `ETag`. Adding gzip/brotli and long-lived
cache headers on hashed filenames is a small change with a large effect on
load time, especially over the kind of connection a branch office has.

### 3.5 Arabic localisation — largely done, with a known remainder

**How it works.** English strings are baked into the markup, then
`localizeRenderedUi()` walks the rendered DOM after every render and swaps any
text node found in the `uiTextAr` dictionary. Anything missing from the
dictionary silently stays English — there is no build-time check, so gaps are
invisible until someone looks at the screen in Arabic.

**What was fixed.** An automated audit renders every module (and every
workspace tab) for all four roles in Arabic and reports remaining Latin text.
It started at 833 distinct untranslated interface strings. Roughly 400
dictionary entries were added — the ticket, asset, task, knowledge, document,
vendor, contract and account workspaces, plus filters, empty states, editor
tools, departments, locations, job titles and ticket categories.

Three classes of bug could not be fixed with dictionary entries:

- **Concatenation.** `` `${data.length} matching` `` produced "14 matching" —
  the fragment is assembled in code, so the joined string is never in the
  dictionary. A `tpl()` helper now formats these from translatable templates
  (`"{n} matching"` → `"{n} مطابقة"`), so word order can differ per language.
  The same applied to `Open {module}`, `Search {module}`, `{module} list`,
  `{n} min read`, `{n} records`, `Appearance: {mode}`, `{entity} created` and
  the other counted strings.
- **Joined summary lines.** Secondary lines are built by joining parts with
  `" | "`, so the whole node never matched. `trText()` now splits on `" | "`
  and `" / "` and translates each segment.
- **Raw ISO timestamps.** `cellText()` returned `row[column]` verbatim, so
  fields like `uploadedAt` rendered as `2026-01-15T08:00:00.000Z` — in English
  too. Dates are now formatted in the active locale.

**What remains, and why.** The audit still reports ~300 Latin strings, but the
composition has changed: they are overwhelmingly *data* rather than interface —
people's names, asset models (`Dell Latitude 7440`), vendor company names, file
names, user-typed ticket descriptions, and junk left in the demo data. Those
should not be auto-translated. Two genuine gaps are worth planning:

1. **The audit and activity feeds.** Entries read "Amina IT Manager performed
   login on users." These are assembled from an actor, a verb and a resource.
   They need a sentence template per verb rather than dictionary entries.
2. **`nameAr` is unfilled in the data.** All 192 rows in `data/db.json`
   `lookupItems` have `nameAr` identical to `nameEn`. `lookupLabel()` already
   prefers `nameAr`, so filling those fields is pure data entry that would
   localise every dropdown natively. The dictionary currently covers the common
   ones as a fallback; the data is the correct home for them.

**Overlays were missed entirely at first.** Modals, wizards and menus render
long after `render()` returns, and only some of the paths that open them called
`localizeRenderedUi`. Worse, `openModal()` appends its backdrop straight to
`<body>` rather than into `#dialogHost`, so even watching the overlay hosts
would not have caught it. A `MutationObserver` on the hosts *and* on
`document.body` now localises any overlay however it was opened — a single fix
instead of chasing every call site. Overlay text went from 237 untranslated
strings to 29, and all 29 are proper nouns (brands, product names, people).

Three presentation bugs surfaced with them:

- The markup already emits an asterisk for required fields, and the refreshed
  stylesheet added a generated one too, so every required label read `* *`.
- Field labels are laid out as a CSS grid, so a bare label text node and the
  separate required-marker span became two grid rows and the asterisk dropped
  onto its own line. Both are now wrapped in one `.field-label-text` element.
- Native date pickers render a segmented placeholder that Chromium reverses
  inside an RTL container, showing `ةنس/رهش/موي`. Date, time, number and
  similar inputs are now pinned to LTR while staying aligned to the field's
  start edge.

**Keeping it honest.** `qa-i18n-audit.js` (pages) and `qa-i18n-modals.js`
(overlays) are the tools used above. Both are worth keeping in CI — a
localisation gap is otherwise only discoverable by a person switching language
and reading every screen, which is exactly how these went unnoticed.

### 3.6 Clean the demo data

`data/db.json` contains test rubbish visible on the first screen a reviewer
sees — tickets titled `اااا`, `سسسسسس`, `صسءشسؤبثي`, and a knowledge article
called `bfxdvxdfv`. A clean snapshot already exists at
`data/db.demo.clean.v1.json`. Consider making that the shipped default, or add
an `npm run reset:demo` script that restores it.

### 3.7 Tidy the repository

Twenty-one `server-*.log` files (twenty of them empty) are committed at the
repo root, plus nine more log files under `data/`. `tests/api/`, `tests/regression/` and
`tests/security/` contain only `.gitkeep` — the suites those names refer to
actually live inside `qa/scripts/run-tests.js`, which is misleading when you
go looking for them. Add the logs to `.gitignore` and either populate or
remove the empty directories.

### 3.8 Testing gaps worth closing

The existing coverage is genuinely good for a prototype. The gaps that matter:
no test asserts the RBAC boundary from the server's perspective (they drive
the UI, which enforces nothing), and there is no visual or contrast
regression check — which is why §1.3 and §1.4 went unnoticed. A handful of
API-level authorisation tests would be the highest-value addition.
