# IT Command Center V1 Manual Release Candidate QA Checklist

Use this checklist for the final manual Release Candidate pass. Test in a clean browser session when possible.

Recommended URL: `http://localhost:4230`

## Demo Login Credentials

| Role | Username | Password | Purpose |
|---|---|---|---|
| System Admin | `admin` | `admin123` | Full platform administration and security verification |
| IT Manager | `manager` | `manager123` | Daily IT operations, command center, workspaces, approvals |
| IT Staff | `staff` | `staff123` | Assigned operational work, tickets, tasks, assets |
| Employee | `employee` | `admin123` | Restricted employee self-service portal |

## Test Result Legend

- Pass: the feature works as expected.
- Fail: the feature is broken, unsafe, or blocks the workflow.
- Minor issue: usable but needs follow-up.
- Blocker: must be fixed before V1 sign-off.

---

## 1. Login / Logout

### Steps

1. Open the application URL.
2. Log in as System Admin.
3. Confirm the main shell loads.
4. Open the profile menu.
5. Click Logout.
6. Repeat for IT Manager, IT Staff, and Employee.

### Expected Result

- Each account logs in successfully with the listed credentials.
- Each account lands on the correct workspace for its role.
- Logout clears the session and returns to the login screen.
- No role sees another user's session after logout/login.

Pass/Fail: [ ]

Notes:

---

## 2. English / Arabic Switch

### Steps

1. Log in as IT Manager.
2. Click the language toggle.
3. Confirm the UI changes to Arabic.
4. Click the language toggle again.
5. Confirm the UI changes back to English.
6. Repeat once as Employee.

### Expected Result

- English mode shows English UI labels.
- Arabic mode shows Arabic UI labels.
- User-entered data, names, ticket subjects, asset names, and document titles are not incorrectly translated.
- The selected language persists after refresh.

Pass/Fail: [ ]

Notes:

---

## 3. RTL / LTR Click Behavior

### Steps

1. Switch to Arabic.
2. Click sidebar items.
3. Open profile menu.
4. Open notifications menu.
5. Open Create menu.
6. Open a More menu in Tickets or Tasks.
7. Open a modal and click Cancel.
8. Switch back to English and repeat the same checks.

### Expected Result

- Arabic sets the UI to RTL.
- English sets the UI to LTR.
- Buttons click exactly where they visually appear.
- Menus open next to the clicked button.
- Modals are centered.
- Dropdowns and tabs open/switch correctly.
- No horizontal overflow appears.

Pass/Fail: [ ]

Notes:

---

## 4. Command Center

### Steps

1. Log in as IT Manager.
2. Open Command Center.
3. Review Priority Summary cards.
4. Click each visible summary/drilldown card.
5. Review Attention Queue.
6. Click items in Needs Attention / Overdue / Expiring / Waiting / Unassigned areas.
7. Review Recent Activity.
8. Use Quick Actions:
   - Create Ticket
   - Create Task
   - Register Asset
   - Upload Document
   - Create Person

### Expected Result

- Command Center loads quickly.
- Cards navigate to the correct workspace or filtered data.
- Queue items open the correct record or module.
- Recent Activity shows meaningful operational events.
- Quick Actions open existing create modals.
- No generic or broken placeholder action appears.

Pass/Fail: [ ]

Notes:

---

## 5. Tickets Workflow

### Steps

1. Log in as Employee.
2. Submit a new ticket from Employee Portal.
3. Confirm suggested Knowledge Base articles are relevant or empty when no match exists.
4. Confirm the ticket appears in My Tickets.
5. Log out and log in as IT Manager.
6. Open Tickets.
7. Open the new ticket.
8. Assign or reassign the ticket.
9. Change status through the allowed workflow.
10. Add a public reply.
11. Add an internal note.
12. Upload an attachment.
13. Link an asset if applicable.
14. Confirm Timeline updates.
15. Confirm Audit updates where applicable.
16. Log in as Employee and open the same ticket.

### Expected Result

- Employee can create a ticket.
- Requester is forced to the employee's own profile.
- Ticket appears for IT Manager and appropriate IT Staff.
- Assignment, status, public reply, internal note, attachment, and asset link work.
- Employee sees public replies only.
- Employee never sees internal notes.
- Timeline and audit entries are readable.
- Notifications are created for relevant users only.

Pass/Fail: [ ]

Notes:

---

## 6. Tasks Workflow

### Steps

1. Log in as IT Manager.
2. Open Tasks.
3. Create a task.
4. Edit the task.
5. Assign or reassign the task.
6. Change status:
   - Pending
   - In Progress
   - Completed
   - Cancelled
7. Confirm Completed and Cancelled confirmation dialogs.
8. Archive the task.
9. Restore the task.
10. Log in as Employee.
11. Open My Tasks.
12. Create an employee task.
13. Edit the employee task.

### Expected Result

- Create/edit works without Forbidden field errors.
- New tasks start as Pending.
- Status chips update correctly.
- Completed does not automatically move to archive.
- Archive and restore are separate actions.
- Employee sees only own/assigned tasks.
- Due badges appear for Today and Overdue.
- Timeline/notifications update where expected.

Pass/Fail: [ ]

Notes:

---

## 7. Assets Lifecycle

### Steps

1. Log in as IT Manager.
2. Open Assets.
3. Open each demo asset type:
   - Laptop
   - Printer
   - Monitor
   - Mobile phone
4. Verify lifecycle status and custodian details.
5. Run or open lifecycle actions where safe:
   - Assign Asset
   - Transfer Asset
   - Temporary Custody
   - Return to IT Storage
   - Send to Repair
   - Mark Lost / Stolen
   - Dispose Asset
6. Verify asset timeline.
7. Log in as Employee.
8. Confirm assigned asset appears in Employee Portal.

### Expected Result

- Existing assets load.
- Asset identity, custody, status, and attention are clear.
- Assigned assets show correct employee/custodian.
- In Repair assets show attention state.
- Disposed assets are not available for assignment.
- Employee sees only assigned/allowed assets.
- Timeline and audit remain readable.

Pass/Fail: [ ]

Notes:

---

## 8. People / Onboarding

### Steps

1. Log in as IT Manager.
2. Open People.
3. Open an existing employee profile.
4. Confirm profile details:
   - Full name
   - Department
   - Job title
   - Employment status
   - Contact info
   - Login account status
5. Create a new person if doing full QA.
6. Optionally create a linked login account.
7. Open tabs:
   - Overview
   - Assets
   - Tickets
   - Tasks
   - Documents
   - Account
   - Timeline

### Expected Result

- People workspace is profile-first and readable.
- Linked assets, tickets, tasks, documents, and account status render.
- Creating a person works.
- Creating a linked account works when enabled.
- Employee cannot access other employee profiles.
- IT Manager can manage People records.

Pass/Fail: [ ]

Notes:

---

## 9. Documents / Files

### Steps

1. Log in as IT Manager.
2. Open Documents.
3. Open published demo documents.
4. Verify Files tab.
5. Test Preview or Download where available.
6. Create or edit a document if doing full QA.
7. Upload a document/file if supported.
8. Archive and restore a document if supported.
9. Log in as Employee.
10. Confirm only permitted published documents appear.

### Expected Result

- Documents load and are document-first.
- Files display correctly.
- Preview/download actions work or show a clear future-version message.
- Employee cannot edit company documents.
- Employee sees only allowed published documents.
- Timeline/audit update where applicable.

Pass/Fail: [ ]

Notes:

---

## 10. Knowledge Base

### Steps

1. Log in as IT Manager.
2. Open Knowledge Base.
3. Open a published article.
4. Confirm article content is readable.
5. Create a draft article if doing full QA.
6. Submit for review.
7. Approve/publish as IT Manager.
8. Check version history if available.
9. Archive and restore an article if supported.
10. Log in as Employee.
11. Confirm only published articles are visible.
12. Test helpful feedback as Employee.

### Expected Result

- Published articles open correctly.
- Draft/review/publish workflow works for IT roles.
- Employee cannot edit, publish, archive, or view unpublished articles.
- Helpful feedback works only in Employee reading experience.
- Suggested articles appear in ticket creation when relevant.

Pass/Fail: [ ]

Notes:

---

## 11. Contracts

### Steps

1. Log in as IT Manager.
2. Open Contracts.
3. Open Microsoft 365 subscription.
4. Confirm renewal health, days remaining, vendor, owner, and cost details.
5. Open Renewals tab.
6. Open Documents tab.
7. Test Renew workflow if safe.
8. Test Upload Document behavior.
9. Archive/restore if supported.

### Expected Result

- Contracts are renewal-first.
- Expiring contract is visible in dashboard/Command Center.
- Vendor relationship is visible.
- Documents/files are accessible.
- Renew workflow uses confirmation and preserves existing business logic.
- Employee cannot access contract admin data.

Pass/Fail: [ ]

Notes:

---

## 12. Vendors

### Steps

1. Log in as IT Manager.
2. Open Vendors.
3. Open Microsoft CSP.
4. Open Dell Partner.
5. Review:
   - Contacts
   - Contracts
   - Assets
   - Tickets
   - Documents
   - Timeline
6. Test Create Ticket or Create Contract if available.
7. Test Upload Document behavior.
8. Archive/restore if supported.

### Expected Result

- Vendors are relationship-first.
- Linked contracts/assets/tickets display.
- Contacts render clearly.
- Related records open correctly.
- Future-version actions show clear messages if not implemented.
- Employee cannot access vendor admin data.

Pass/Fail: [ ]

Notes:

---

## 13. Settings / Admin

### Steps

1. Log in as System Admin.
2. Open Settings.
3. Verify sections:
   - General
   - Administration
   - Ticket Assignment
   - Assignment Groups
   - Lookup Management
   - Appearance
   - System
4. Open User Accounts.
5. Open Roles.
6. Open Lookup Management.
7. Open Archive.
8. Open Trash.
9. Log in as IT Manager and repeat allowed areas.
10. Log in as IT Staff and Employee.

### Expected Result

- Settings feels like configuration, not a dashboard.
- System Admin has full access.
- IT Manager sees allowed admin/configuration areas.
- IT Staff cannot modify restricted configuration.
- Employee cannot access Settings/admin pages.
- Lookup Management still works.
- Ticket Assignment settings remain permission-protected.

Pass/Fail: [ ]

Notes:

---

## 14. Employee Portal

### Steps

1. Log in as Employee.
2. Confirm minimal navigation:
   - Dashboard
   - Requests / Tickets
   - My Assets
   - My Tasks
   - Documents
   - Knowledge
3. Submit a request.
4. Open My Tickets.
5. Open My Assets.
6. Open My Tasks.
7. Open Documents.
8. Open Knowledge.
9. Try accessing admin-only routes manually if possible.

### Expected Result

- Employee Portal is simple and non-admin.
- Employee sees only own tickets/tasks/assets.
- Employee sees allowed documents only.
- Employee sees published KB only.
- Employee cannot access admin pages, audit, users, roles, vendors, contracts, archive, or trash.

Pass/Fail: [ ]

Notes:

---

## 15. Search

### Steps

1. Log in as IT Manager.
2. Use global search for:
   - A ticket number
   - An employee name
   - An asset number
   - A contract name
   - A vendor name
   - A KB article keyword
3. Use local search inside Tickets, Tasks, Assets, Documents, and Knowledge.
4. Repeat global search as Employee.

### Expected Result

- Search keeps focus while typing.
- Results are relevant.
- Clicking a result opens the correct record.
- Employee search only returns permitted results.
- No unauthorized records appear.

Pass/Fail: [ ]

Notes:

---

## 16. Notifications

### Steps

1. Log in as IT Manager.
2. Open notification bell.
3. Open Notifications page.
4. Click a notification.
5. Mark one notification as read.
6. Mark all as read.
7. Delete a notification if available.
8. Repeat as IT Staff and Employee.

### Expected Result

- Bell counter shows unread notifications.
- Bell dropdown and Notifications page use the same data.
- Notifications open related records.
- Mark read and mark all read affect only visible/current user's notifications.
- Notifications do not leak across users.

Pass/Fail: [ ]

Notes:

---

## 17. Comments / Internal Notes

### Steps

1. Log in as IT Manager.
2. Open a ticket.
3. Add a public reply.
4. Add an internal note.
5. Log in as IT Staff.
6. Confirm internal note is visible to IT role.
7. Log in as Employee.
8. Open the same ticket if it belongs to the employee.

### Expected Result

- Public comments are visible to requester and IT.
- Internal notes are visible only to IT roles.
- Employee never sees internal notes.
- Comments create timeline/audit/notification entries where expected.

Pass/Fail: [ ]

Notes:

---

## 18. Attachments

### Steps

1. Log in as IT Manager.
2. Upload an attachment to a ticket.
3. Preview/download the attachment.
4. Upload or view attachments on Assets, Documents, Contracts, or Vendors where available.
5. Log in as Employee.
6. Confirm employee can access only allowed ticket/document attachments.
7. Attempt to add attachment to Knowledge Base or Company Document as Employee if possible.

### Expected Result

- Attachment upload works for allowed record types.
- Preview/download work or show a clear future-version message.
- Employees cannot add comments/attachments to read-only KB or Company Documents.
- Attachment access is permission-protected.

Pass/Fail: [ ]

Notes:

---

## 19. Archive / Restore / Trash

### Steps

1. Log in as IT Manager.
2. Archive a safe test record.
3. Open Archive.
4. Restore the record.
5. Delete/trash a safe test record if available.
6. Open Trash.
7. Restore from Trash.
8. Test permanent delete only on disposable QA data.
9. Log in as Employee.
10. Confirm Employee cannot access Archive or Trash.

### Expected Result

- Archive and Trash are distinct.
- Restore works from Archive/Trash.
- Permanent delete is permission-protected.
- Employee has no access to archive/trash/admin destructive actions.

Pass/Fail: [ ]

Notes:

---

## 20. Permissions / RBAC

### Steps

1. Log in as Employee.
2. Confirm employee cannot access:
   - Users
   - Roles
   - Settings
   - Audit
   - Archive
   - Trash
   - Vendors
   - Contracts
3. Confirm employee cannot see other employee tickets/tasks/assets.
4. Confirm employee cannot edit protected fields.
5. Log in as IT Staff.
6. Confirm IT Staff can work assigned/allowed operational records.
7. Log in as IT Manager.
8. Confirm IT Manager can manage operational records.
9. Log in as System Admin.
10. Confirm full administrative access.

### Expected Result

- RBAC is enforced in UI and server behavior.
- Restricted navigation is hidden.
- Unauthorized direct access returns safe errors or no data.
- Employee isolation is preserved.
- IT roles see only appropriate management surfaces.

Pass/Fail: [ ]

Notes:

---

## Release Blockers

List any issue that prevents V1 release.

| ID | Area | Description | Owner | Status |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## Minor Issues

List non-blocking issues that can move to V1.1 or post-release polish.

| ID | Area | Description | Recommendation | Priority |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## V1 Sign-Off

Complete this section only after all release blockers are closed.

- [ ] All core workflows passed.
- [ ] All four roles passed RBAC checks.
- [ ] English and Arabic passed.
- [ ] RTL and LTR click behavior passed.
- [ ] No release-blocking console errors.
- [ ] Demo data is clean.
- [ ] Product Owner approved V1 scope.
- [ ] Engineering approved V1 stability.
- [ ] Security/RBAC checks passed.

Sign-off decision:

- [ ] Approved for V1 release
- [ ] Not approved

Product Owner:

Date:

Engineering:

Date:

Notes:
