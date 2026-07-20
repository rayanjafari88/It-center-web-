# IT Command Center V1 Product Blueprint

## 1. Product Vision

IT Command Center is a unified IT operations workspace for small and growing IT teams. V1 is designed around a single IT Manager who owns daily IT operations, while preserving a scalable foundation for IT Staff, System Admins, employees, and future organizations.

The product should help IT teams answer four questions quickly:

- What needs attention today?
- Who is affected?
- What action should I take next?
- Where is the complete history?

IT Command Center V1 should feel like a focused enterprise SaaS product, not a generic admin panel. It should simplify support, tasks, assets, documents, people, vendors, contracts, audit, and knowledge into one calm operational command workspace.

## 2. Product Philosophy

V1 prioritizes operational clarity over feature abundance.

The product should:

- Make daily IT work easier to see, prioritize, and complete.
- Hide technical and administrative complexity until it is needed.
- Preserve complete history without forcing users to look at raw system data.
- Keep employees in a simple self-service experience.
- Keep IT Managers in an operational workspace with strong context.
- Keep System Admins in configuration and governance areas.

The product should not expose database structure, raw IDs, system payloads, or configuration concepts to normal users unless there is a clear operational reason.

## 3. Design Principles

1. Clarity before density.
2. Daily work before administration.
3. Conversation and context before raw records.
4. One primary action per moment.
5. No visible action should do nothing.
6. No duplicated information unless it has a clear purpose.
7. Record history should be readable by humans.
8. Forms should ask business questions, not database questions.
9. Employees should see only what they need to complete self-service work.
10. Advanced fields should be available without overwhelming the default flow.
11. Every dashboard card, chart, and signal must navigate to meaningful filtered data.
12. Navigation should preserve context whenever possible.
13. Visual style must be consistent across modules.
14. Permissions must be enforced server-side, never only hidden in the UI.

## 4. Navigation Architecture

### Recommended Daily Navigation

The main sidebar should focus on modules used in daily operations:

- Dashboard
- Tickets
- Tasks
- People
- Assets
- Knowledge
- Documents
- Vendors
- Contracts

### Recommended Admin / Secondary Navigation

The following should not be first-level daily navigation for most users:

- Activity
- Archive
- Trash
- Settings

### Settings / Admin Areas

Settings should contain:

- General
- Appearance
- Ticket Assignment
- Assignment Groups
- Lookup Management
- User Accounts
- Roles & Permissions
- Form Templates
- System Audit
- Archive & Trash
- System Utilities

### Employee Navigation

Employees should only see:

- Dashboard
- Tickets
- My Tasks
- Company Documents
- Knowledge Base

Employees should not see operational administration, audit, archive, trash, user accounts, roles, settings, vendors, contracts, attachments, lifecycle, or people management.

## 5. Information Architecture

The product should be organized into three mental zones.

### Daily Operations

Used every day to manage IT work:

- Dashboard
- Tickets
- Tasks
- People
- Assets
- Knowledge
- Documents
- Vendors
- Contracts

### Record Context

Context that belongs inside records rather than as standalone modules:

- Attachments
- Timeline
- Audit history
- Related records
- Lifecycle history
- Comments
- Internal notes

### Administration

Configuration, governance, and recovery:

- Settings
- User Accounts
- Roles
- Lookup Management
- Assignment Groups
- Form Templates
- Archive
- Trash
- Audit

## 6. Module Mission

### Dashboard / Command Center

Mission: Provide a clear operational picture of IT health, urgent work, and priority signals.

Primary users: IT Manager, IT Staff.

Should remain main navigation: Yes.

Daily use case: Review active tickets, overdue tasks, contract renewals, asset attention, and recent activity.

Simplification direction: Keep high-value metrics visible, move secondary metrics lower, ensure all cards drill into filtered views.

### Tickets

Mission: Manage employee requests, IT conversations, assignments, statuses, attachments, and resolution history.

Primary users: IT Manager, IT Staff, Employee.

Should remain main navigation: Yes.

Daily use case: Receive, triage, assign, discuss, resolve, and close requests.

Simplification direction: Conversation-first workspace, right-side context panel, limited primary actions, readable timeline.

### Tasks

Mission: Track personal and operational IT work that may or may not be connected to tickets.

Primary users: IT Manager, IT Staff, Employee.

Should remain main navigation: Yes.

Daily use case: Track due work, recurring work, assignments, notes, and progress.

Simplification direction: Keep card/calendar views, make creation simple, move extra scheduling and related-record fields to advanced sections.

### People

Mission: Store master records for real people and their operational relationships.

Primary users: IT Manager, System Admin.

Should remain main navigation: Yes.

Daily use case: View employee profile, assets, tickets, tasks, documents, and linked login account.

Simplification direction: People is the source of truth for humans. User account management belongs in a tab or Settings area.

### User Accounts

Mission: Manage login credentials, roles, access status, service accounts, and account security.

Primary users: System Admin, IT Manager.

Should remain main navigation: No.

Recommended location: Settings / Admin.

Daily use case: Create, disable, unlock, reset, and manage accounts.

Simplification direction: Treat as access administration, not people management.

### Assets

Mission: Manage physical and digital IT assets, ownership, custody, lifecycle events, repair, loss, disposal, and history.

Primary users: IT Manager, IT Staff.

Should remain main navigation: Yes.

Daily use case: Assign, transfer, return, repair, locate, archive, and audit assets.

Simplification direction: Operational changes should use workflow actions. Manual editing of custody fields should be minimized.

### Lifecycle

Mission: Show asset movement and lifecycle history.

Primary users: IT Manager, IT Staff.

Should remain main navigation: No.

Recommended location: Inside Assets as a tab, filter, or timeline view.

Daily use case: Investigate where an asset has been and who handled it.

Simplification direction: Merge into Assets to reduce navigation duplication.

### Contracts

Mission: Manage contract health, renewal risk, vendors, documents, costs, linked assets, and lifecycle events.

Primary users: IT Manager.

Should remain main navigation: Yes.

Daily use case: Track renewals, expiration risk, contract documents, vendor details, and costs.

Simplification direction: Keep renewal health prominent, move deep financial/legal details to tabs.

### Vendors

Mission: Manage supplier relationships, support contacts, linked contracts, tickets, assets, documents, and performance.

Primary users: IT Manager.

Should remain main navigation: Yes, if vendor management is part of daily operations.

Daily use case: Contact support, open vendor tickets, inspect contracts, track vendor-related issues.

Simplification direction: Keep vendor workspace relationship-oriented, not simple CRUD.

### Documents

Mission: Provide a central library for company documents, operational documents, signed records, and document attachments.

Primary users: IT Manager, IT Staff, Employee.

Should remain main navigation: Yes.

Daily use case: Publish company documents, view policies/guides, store signed operational records.

Simplification direction: Rename Docs & Forms to Documents. Keep employee view read-only and library-oriented.

### Form Templates

Mission: Configure reusable templates for forms and operational documents.

Primary users: IT Manager, System Admin.

Should remain main navigation: No.

Recommended location: Documents > Templates or Settings > Form Templates.

Daily use case: Maintain reusable form definitions.

Simplification direction: Hide from normal daily navigation.

### Attachments

Mission: Store files attached to records.

Primary users: IT Manager, IT Staff, System Admin.

Should remain main navigation: No.

Recommended location: Record-level attachments, with optional admin search later.

Daily use case: Upload, preview, and download files from the relevant record.

Simplification direction: Remove from sidebar; attachments belong to records.

### Knowledge Base

Mission: Help employees and IT teams find answers, document procedures, and reduce tickets.

Primary users: Employee, IT Staff, IT Manager.

Should remain main navigation: Yes.

Daily use case: Search, read, create, review, and publish articles.

Simplification direction: Keep employee reading experience simple; keep governance and analytics for IT roles.

### Notifications

Mission: Alert users about relevant operational events.

Primary users: All roles.

Should remain main navigation: No.

Recommended location: Header bell and notifications page/dropdown.

Daily use case: See unread operational alerts and navigate to related records.

Simplification direction: Keep recipient-scoped, grouped, and relevant.

### Activity Feed

Mission: Show recent operational events across the system.

Primary users: IT Manager, IT Staff.

Should remain main navigation: Optional.

Recommended location: Dashboard section or Activity area.

Daily use case: Understand what changed recently.

Simplification direction: Hide repetitive login/system noise.

### Audit Feed

Mission: Provide compliance-grade technical audit history.

Primary users: System Admin, IT Manager.

Should remain main navigation: No.

Recommended location: Settings / System Audit.

Daily use case: Investigate changes, permissions, archives, deletes, and sensitive actions.

Simplification direction: Do not expose raw audit as daily operational UI.

### Archive Center

Mission: View and restore archived inactive records.

Primary users: IT Manager, System Admin.

Should remain main navigation: No.

Recommended location: Settings / Archive & Trash.

Daily use case: Restore inactive records.

Simplification direction: Keep distinct from Trash.

### Trash Bin

Mission: View deleted records, restore them, or permanently delete when allowed.

Primary users: System Admin, IT Manager.

Should remain main navigation: No.

Recommended location: Settings / Archive & Trash.

Daily use case: Recover deleted records or perform controlled cleanup.

Simplification direction: Keep distinct from Archive.

### Roles

Mission: Configure role permissions.

Primary users: System Admin.

Should remain main navigation: No.

Recommended location: Settings / Roles & Permissions.

Daily use case: Review and adjust permissions.

Simplification direction: Hide from normal users.

### Settings

Mission: Configure system behavior, appearance, lookup values, assignment routing, access controls, and administrative utilities.

Primary users: IT Manager, System Admin.

Should remain main navigation: Yes for authorized admin users.

Daily use case: Occasional configuration, not daily operations.

Simplification direction: Use clear sections, not one long settings page.

## 7. Workspace Identity

Sprint 1 proved that the navigation structure is cleaner, but it also exposed a new product risk: if every operational page uses the same visual hierarchy, the product becomes consistent but emotionally flat and operationally unclear.

IT Command Center should use one design system, but each workspace must have its own identity. Users should immediately understand the job of the workspace they are in.

### Workspace Identity Principle

Consistency does not mean every page should look identical.

Every workspace should share:

- Navigation behavior
- Typography
- Buttons
- Forms
- Menus
- Tabs
- Badges
- Empty states
- Accessibility rules
- RBAC behavior

But every workspace should have a different visual center of gravity based on the user's primary task.

### Workspace Centers of Gravity

- Command Center: Operational awareness first.
- Tickets: Conversation-first.
- Tasks: Execution-first.
- Assets: Lifecycle-first.
- People: Profile-first.
- Documents: Document-first.
- Knowledge Base: Article-first.
- Contracts: Renewal-first.
- Vendors: Relationship-first.
- Settings: Configuration-first.

### Workspace Design Rules

1. Do not overload operational pages with dashboard-style KPI cards.
2. KPIs belong only where they help the user act in that workspace.
3. Large content areas should dominate Tickets, Documents, and Knowledge Base.
4. Operational actions should dominate Tasks and Assets.
5. Renewal and risk context should dominate Contracts.
6. Relationship context should dominate Vendors.
7. Identity/profile context should dominate People.
8. Configuration sections should dominate Settings.
9. The Command Center is the only workspace that should feel like an executive operations dashboard.
10. Each workspace should make its primary job obvious above the fold.

### Command Center: Operational Awareness-first

Primary objective: Help IT Manager and IT Staff understand operational health and urgent work.

Primary information above the fold:

- Health score or operational summary
- Open tickets
- Overdue tasks
- Renewals
- Priority signals
- Work queue

Secondary information:

- Activity feed
- Charts
- Focus/due-soon sections
- Asset and contract signals

Supporting information:

- Secondary metrics
- Low-priority activity
- Historical trends

KPIs that belong here:

- Open tickets
- In progress tickets
- Overdue tasks
- Renewals due
- Critical tickets
- Assets needing attention
- SLA risk

KPIs that should move elsewhere:

- Article analytics should stay in Knowledge Base.
- Vendor performance should stay in Vendors.
- Contract financial detail should stay in Contracts.
- Asset custody detail should stay in Assets.

Primary buttons:

- Create
- Review work queue

Menu actions:

- Dashboard customization
- Secondary exports or future actions

Recommended visual emphasis:

- Executive summary
- Compact KPIs
- Actionable signals
- Drilldown cards

Expected user journey:

The IT Manager opens the Command Center, identifies what needs attention, clicks a signal or KPI, and lands in the correct filtered workspace.

### Tickets: Conversation-first

Primary objective: Resolve employee requests through clear conversation, assignment, status, and attachments.

Primary information above the fold:

- Ticket subject
- Requester
- Status
- Priority
- Assigned To
- Conversation thread
- Reply composer

Secondary information:

- SLA
- Related asset
- Related employee
- Attachment count
- Knowledge suggestions

Supporting information:

- Timeline
- Audit
- Linked vendor/contract
- Historical metadata

KPIs that belong here:

- SLA remaining
- Response status
- Priority
- Assignment state

KPIs that should move elsewhere:

- Overall ticket distribution belongs in Command Center.
- Assignee workload belongs in Dashboard or Tasks/Reports.
- Knowledge helpfulness belongs in Knowledge Base.

Primary buttons:

- Reply
- Assign
- Change Status

Menu actions:

- Upload file
- Link asset
- Add watcher
- Archive
- Delete
- Export/print if available later

Recommended visual emphasis:

- Conversation thread
- Reply composer
- Clear right-side ticket context

Expected user journey:

The IT user selects a ticket, reads the conversation, checks context, replies or changes status, and moves to the next ticket without leaving the workspace.

### Tasks: Execution-first

Primary objective: Help users complete work and understand what needs action now.

Primary information above the fold:

- Task title
- Status
- Priority
- Due date
- Owner/assignee
- Checklist or next action

Secondary information:

- Notes
- Related ticket/asset/person
- Recurrence
- Calendar view

Supporting information:

- Timeline
- Attachments
- Audit
- Historical changes

KPIs that belong here:

- Due today
- Overdue
- In progress
- Completed where useful

KPIs that should move elsewhere:

- Broad operational health belongs in Command Center.
- Ticket SLA belongs in Tickets.
- Contract renewal KPIs belong in Contracts.

Primary buttons:

- Create Task
- Change Status
- Add Note

Menu actions:

- Assign
- Duplicate
- Archive
- Convert to ticket
- Attach file

Recommended visual emphasis:

- Work list
- Status chips
- Due badges
- Checklist/progress

Expected user journey:

The user sees what is due, opens a task, updates status or notes, and continues execution.

### Assets: Lifecycle-first

Primary objective: Manage asset custody, condition, lifecycle actions, and history.

Primary information above the fold:

- Asset number/name
- Status
- Current holder
- Permanent custodian
- Location
- Attention level
- Asset Actions

Secondary information:

- Warranty
- Supplier
- Linked tickets
- Linked documents
- Financial/disposal data

Supporting information:

- Timeline
- Audit
- Transfer history
- Attachments

KPIs that belong here:

- Pending return
- Temporary custody
- In repair
- Warranty expiring
- Lost/stolen
- Disposed

KPIs that should move elsewhere:

- Overall operational health belongs in Command Center.
- Vendor performance belongs in Vendors.
- Contract renewal risk belongs in Contracts.

Primary buttons:

- Assign Asset
- Transfer Asset
- Return Asset
- Send to Repair

Menu actions:

- Mark Lost/Stolen
- Dispose
- Print Label
- Create Ticket
- Archive

Recommended visual emphasis:

- Current state
- Lifecycle workflow actions
- Custody cards
- Warning states

Expected user journey:

The IT user opens an asset, understands who has it, performs a lifecycle workflow, and verifies the timeline.

### People: Profile-first

Primary objective: Provide a complete operational profile for each real person.

Primary information above the fold:

- Name
- Role/person type
- Department
- Job title
- Status
- Contact details
- Linked user account state

Secondary information:

- Assets
- Tickets
- Tasks
- Documents
- Manager/location

Supporting information:

- Timeline
- Audit
- Access/account history

KPIs that belong here:

- Assigned assets count
- Open tickets count
- Open tasks count
- Account status

KPIs that should move elsewhere:

- Department-wide metrics belong in Dashboard or reporting.
- Asset inventory counts belong in Assets.
- Ticket queue counts belong in Tickets/Command Center.

Primary buttons:

- Edit Person
- Create/Manage Account
- Assign Asset where appropriate

Menu actions:

- Archive person
- Disable account
- Reset password
- Export profile

Recommended visual emphasis:

- Human profile
- Relationships
- Account/access status

Expected user journey:

The IT Manager opens a person, confirms profile and access state, checks linked records, and performs a people/account action.

### Documents: Document-first

Primary objective: Help users read, publish, organize, and retrieve documents.

Primary information above the fold:

- Document title
- Description
- Category/type
- Publish status
- Attachment/preview
- Document body or file card

Secondary information:

- Linked record
- Version/status metadata
- Owner
- Visibility

Supporting information:

- Timeline
- Audit
- Related records
- Form/template metadata

KPIs that belong here:

- Published/draft status
- Last updated
- Attachment count

KPIs that should move elsewhere:

- Knowledge analytics belong in Knowledge Base.
- Audit volume belongs in Audit/Admin.
- Operational health belongs in Command Center.

Primary buttons:

- Create Document
- Upload/Replace File
- Publish where supported

Menu actions:

- Archive
- Link record
- Download
- Future acknowledgements/signatures

Recommended visual emphasis:

- Document content
- Preview/download
- Clean library cards

Expected user journey:

The user finds a document, opens it, reads or downloads it, and performs document-specific management if authorized.

### Knowledge Base: Article-first

Primary objective: Help employees and IT staff find and use documented answers.

Primary information above the fold:

- Article title
- Category
- Tags
- Published status
- Reading metadata
- Article body

Secondary information:

- Related articles
- Attachments
- Helpful feedback
- Owner/review state for IT roles

Supporting information:

- Versions
- Governance
- Analytics
- Timeline
- Audit

KPIs that belong here:

- Views
- Helpful score
- Review status
- Version
- Last updated

KPIs that should move elsewhere:

- Ticket queue health belongs in Command Center.
- Document counts belong in Documents.
- Vendor/contract metrics belong in their workspaces.

Primary buttons:

- Create Article
- Edit Draft
- Publish/Submit Review where authorized

Menu actions:

- Archive
- Restore version
- Export
- Link related record

Recommended visual emphasis:

- Reading area
- Article structure
- Table of contents
- Related/helpful content

Expected user journey:

The employee searches or opens an article, reads the answer, rates it, and avoids creating a ticket when the article solves the issue.

### Contracts: Renewal-first

Primary objective: Prevent missed renewals and make contract risk clear.

Primary information above the fold:

- Contract name
- Vendor
- Status
- Renewal health
- Days remaining
- Owner
- Cost summary

Secondary information:

- Linked assets/licenses
- Documents
- Vendor contact
- Auto-renewal
- Renewal history

Supporting information:

- Timeline
- Audit
- Related tickets
- Financial detail

KPIs that belong here:

- Days remaining
- Renewal health
- Monthly/annual cost
- Linked assets/licenses
- Expiring soon

KPIs that should move elsewhere:

- Vendor performance belongs in Vendors.
- Overall renewal count belongs in Command Center.
- Asset custody belongs in Assets.

Primary buttons:

- Renew Contract
- Upload Document
- Assign Owner

Menu actions:

- Terminate
- Link Assets
- Link Licenses
- Create Ticket
- Export
- Archive

Recommended visual emphasis:

- Renewal health panel
- Dates and risk
- Vendor and cost context

Expected user journey:

The IT Manager opens a contract, understands renewal risk, reviews documents/costs, and takes renewal or owner action.

### Vendors: Relationship-first

Primary objective: Manage supplier relationship context and vendor-related work.

Primary information above the fold:

- Vendor name
- Category
- Status
- Criticality
- Primary contact
- Open tickets
- Active contracts
- Vendor health

Secondary information:

- Contacts
- Contracts
- Assets
- Tickets
- Documents
- Support details

Supporting information:

- Performance
- Timeline
- Audit
- Reviews

KPIs that belong here:

- Open tickets
- Active contracts
- Expiring contracts
- Assets covered
- Response SLA
- Vendor health

KPIs that should move elsewhere:

- Contract-level renewal detail belongs in Contracts.
- Ticket SLA belongs in Tickets.
- Asset lifecycle belongs in Assets.

Primary buttons:

- Create Ticket
- Create Contract
- Add Contact

Menu actions:

- Assign Owner
- Link Assets
- Upload Document
- Schedule Review
- Archive
- Export

Recommended visual emphasis:

- Relationship health
- Contacts
- Linked contracts/tickets/assets

Expected user journey:

The IT Manager opens a vendor, finds support/relationship context, opens linked work, and takes vendor-related action.

### Settings: Configuration-first

Primary objective: Configure the platform without distracting daily users.

Primary information above the fold:

- Settings sections
- Administration groups
- Current configuration summary

Secondary information:

- Ticket assignment
- Assignment groups
- Lookup management
- Appearance
- User accounts
- Roles
- Archive/trash

Supporting information:

- System posture
- Audit/admin utilities
- Future system controls

KPIs that belong here:

- Configuration health if implemented
- Active lookup values
- Active assignment groups
- Account status counts where useful

KPIs that should move elsewhere:

- Operational KPIs belong in Command Center.
- Workspace-specific KPIs belong in their workspace.

Primary buttons:

- Save settings for the active section
- Add lookup value
- Create assignment group

Menu actions:

- Reset to defaults
- Archive/deactivate admin records
- Export configuration where supported later

Recommended visual emphasis:

- Section navigation
- Forms/configuration panels
- Clear save states

Expected user journey:

The authorized admin opens Settings, selects the configuration area, updates values, saves, and returns to operations.

## 8. Workspace Design Standard

Main operational modules should use a consistent workspace model.

The shared workspace standard exists to make the product learnable. Workspace Identity exists to make each module useful. Both are required.

Use the same design language across workspaces, but do not force every workspace into the same visual hierarchy.

### Left Panel

Purpose: Find and select records.

Contents:

- Search
- Quick filters
- Optional advanced filters
- Compact record list
- Clear selected state

Rules:

- Keep cards compact and scannable.
- Do not repeat all detail data in the list.
- Preserve search focus while typing.
- Row/card click should open the record in the workspace.

### Center Panel

Purpose: Complete the primary work.

Contents:

- Main record title
- Primary status/context
- Main content
- Conversation, details, article content, or workflow area
- Primary action result

Rules:

- The center should answer: What is this record and what should I do next?
- Avoid oversized headers.
- Avoid duplicated metadata if it already appears in the right panel.

### Right Context Panel

Purpose: Provide compact context and related records.

Contents:

- Status
- Ownership
- Assignment
- Key metadata
- Related records
- Attachment count
- Watchers or stakeholders where relevant
- SLA, renewal, warranty, or risk context

Rules:

- The right panel should replace unnecessary Details tabs.
- It should be readable at a glance.
- It should not become a second full detail page.

## 9. Form Design Rules

Forms should be designed around user intent.

Rules:

- Use clear titles that match the action.
- Group fields by meaning.
- Show required indicators.
- Use dropdowns for configured values.
- Use record pickers for linked records.
- Avoid manual ID entry.
- Keep primary fields visible.
- Move secondary/system fields to Advanced Options.
- Use inline validation.
- Use confirmation dialogs for destructive or major state-changing actions.
- Keep modal footers consistent: Cancel on the left, primary action on the right.
- Do not expose fields employees should not understand or control.

## 10. Basic vs Advanced Rules

### Basic Fields

Basic fields are required for normal users to complete the common workflow.

Examples:

- Title
- Category
- Description
- Status when role-appropriate
- Priority when role-appropriate
- Owner or assignee
- Due date
- Attachment
- Vendor
- Contract date
- Asset serial number

### Advanced Fields

Advanced fields are important but less common, administrative, technical, or conditional.

Examples:

- Internal notes
- SLA override
- Linked record IDs
- Cost center
- Budget code
- Disposal fields
- Approval metadata
- Review metadata
- Audit/system fields
- Notification preferences
- Expiry dates
- Legal/commercial notes

### Rule

If a field is not needed for 80% of normal create/edit flows, it should be hidden under Advanced Options or moved to a workflow-specific dialog.

## 11. Detail Page Standard

Every detail page should follow a predictable structure.

### Header

Include:

- Record title
- Status badge
- Primary secondary identifier
- Limited primary actions
- More menu for secondary actions

### Overview

Include:

- Human-readable summary
- Most important operational fields
- Attachments if they are core to understanding the record

### Tabs

Use only tabs that provide distinct value.

Recommended common tabs:

- Overview
- Conversation or Notes
- Documents or Attachments
- Timeline

Audit should be admin-only or advanced unless the module is explicitly compliance-focused.

### Timeline

Timeline must be readable:

- Status changed to In Progress
- Assigned to Omar IT Staff
- Attachment uploaded
- Contract renewed
- Asset assigned to Lina Employee

Do not show raw JSON or technical payloads in standard timeline views.

## 12. Employee Portal Philosophy

The Employee Portal exists for self-service, not administration.

Employees should be able to:

- Submit requests
- Track their own tickets
- Reply to IT
- Upload allowed attachments to their own tickets
- Manage their own tasks
- Read published company documents
- Search and read published knowledge articles
- Receive relevant notifications

Employees should not be able to:

- Access other employee records
- Access IT admin modules
- Edit protected ticket fields
- See internal notes
- See audit logs
- Manage documents
- Manage knowledge governance
- Access vendors, contracts, roles, settings, archive, trash, or user accounts

Employee UI should use plain language:

- Create Ticket, not create record
- Company Documents, not Docs & Forms
- Conversation, not comments metadata
- Dashboard, not Employee Portal

## 13. Administration Philosophy

Administration should be powerful but not visually dominant.

Admin areas should include:

- User Accounts
- Roles & Permissions
- Lookup Management
- Assignment Groups
- Ticket Assignment
- Form Templates
- Audit
- Archive
- Trash
- System preferences

Rules:

- Admin tools should be grouped under Settings.
- Normal users should not see unavailable admin areas.
- IT Staff should see only admin areas they are allowed to use.
- System Admin should have full access.
- Dangerous actions require confirmation.
- Permanent delete should be restricted and clearly separated from archive.

## 14. Documents / Forms / Templates / Attachments Architecture

### Documents

Documents is the user-facing module.

It includes:

- Company documents
- Operational documents
- Signed forms
- Guides
- Policies
- Linked record documents

Employees see only published company documents they are permitted to view.

IT roles can manage documents according to permissions.

### Forms

Forms in V1 should be treated as structured requests or document templates, not a separate broad module unless a true submission workflow is added.

If form submissions are ticket-based, the UI should make that clear:

- Employee selects a request/form type.
- System creates one ticket.
- Related form/template context is stored on the ticket.

### Form Templates

Form Templates should move out of main navigation.

Recommended location:

- Documents > Templates, or
- Settings > Form Templates

Templates are configuration, not daily work.

### Attachments

Attachments should be record-level.

Attachment access should be available inside:

- Tickets
- Tasks
- People
- Assets
- Contracts
- Vendors
- Documents
- Knowledge Base

The standalone Attachments module should be hidden from daily navigation and reserved for future admin search if needed.

## 15. Asset Philosophy

Assets are operational objects with custody, ownership, risk, and lifecycle history.

The asset workspace should prioritize:

- Current status
- Permanent custodian
- Current holder
- Location
- Warranty
- Attention level
- Lifecycle actions
- Related tickets
- Documents and attachments

Operational ownership changes should happen through guided workflows:

- Assign Asset
- Transfer Asset
- Temporary Custody
- Return to IT Storage
- Send to Repair
- Mark Lost / Stolen
- Dispose Asset

Manual editing should be reserved for descriptive fields, not normal lifecycle changes.

Disposed, lost, stolen, retired, and archived assets require clear visual treatment and should not appear as available for assignment.

## 16. Contracts & Vendors Philosophy

Contracts and Vendors should work together but remain separate workspaces.

### Contracts

Contracts focus on:

- Renewal health
- Expiration risk
- Vendor
- Owner
- Cost
- Documents
- Linked assets/licenses
- Timeline

The contract workspace should help IT Managers prevent missed renewals and understand financial/operational impact.

### Vendors

Vendors focus on:

- Relationship health
- Contacts
- Linked contracts
- Open tickets
- Covered assets
- Documents
- Support information
- Performance

Vendor actions should be relationship workflows, not raw field editing.

## 17. UX Simplification Rules

1. Remove modules from main navigation if they are not daily workspaces.
2. Merge context modules into their parent records.
3. Use one workspace pattern for operational modules.
4. Keep create/edit forms short by default.
5. Hide advanced fields until needed.
6. Avoid duplicate cards, tabs, and metadata blocks.
7. Replace raw values with readable labels.
8. Use role-specific views.
9. Keep employee language simple.
10. Make every visible action either work or clearly say it is coming later.
11. Keep destructive actions separated from normal actions.
12. Use More menus for secondary actions.
13. Keep timeline readable and audit technical.
14. Use dashboard widgets as navigation, not decoration.

## 18. Naming Standards

Use business-friendly names.

Recommended names:

- Dashboard instead of Command Center for employees.
- Command Center or Dashboard for IT Manager, depending on product positioning.
- Tickets instead of Requests in IT workspace.
- Submit Request for employee ticket creation.
- People instead of Employees when the module includes employees, contractors, trainees, interns, IT Staff, and managers.
- User Accounts instead of Users.
- Documents instead of Docs & Forms.
- Knowledge instead of Knowledge Base if a shorter product label is preferred.
- Archive instead of Archive Center if grouped under Settings.
- Trash instead of Trash Bin if grouped under Settings.

Avoid:

- Record Editor
- Linked ID
- Entity Type
- Payload
- Raw action names like status_change or patch
- Database terms in user-facing screens

## 19. Responsive Rules

### Desktop

Target widths:

- 1920px
- 1600px
- 1440px
- 1366px
- 1280px

Rules:

- Main operational workspaces should fit without horizontal scrolling.
- Split workspaces should use proportional columns.
- Left list and right context panels should scroll independently where appropriate.
- Headers should stay compact.
- Tables should remain readable at 1280px.

### Employee Portal

Employee Portal must work well on mobile.

Rules:

- Use single-column layouts on small screens.
- Keep ticket cards compact.
- Keep forms simple.
- Avoid technical tabs.
- Make buttons touch-friendly.

### IT Manager Workspace

IT Manager workspaces are desktop-first.

Rules:

- Preserve high-density scanning.
- Avoid oversized cards.
- Keep context panels available.
- Do not force mobile patterns onto desktop operations.

## 20. Accessibility Rules

The interface should meet WCAG AA expectations where practical.

Rules:

- Maintain strong text contrast in light and dark modes.
- Do not rely on color alone for status.
- Use labels for all inputs.
- Use visible focus states.
- Ensure buttons have clear accessible names.
- Avoid tiny click targets.
- Keep status badges readable.
- Support keyboard navigation for menus, dialogs, and forms.
- Use semantic headings in page structure.
- Provide clear error messages next to fields.
- Avoid modal traps and hidden inaccessible controls.

## 21. Implementation Roadmap

### Phase 1: Navigation Simplification

Goals:

- Simplify sidebar to daily operational modules.
- Move admin/system modules under Settings.
- Remove standalone Attachments from daily navigation.
- Move Form Templates under Documents or Settings.
- Merge Lifecycle into Assets.
- Keep Employee Portal minimal.

Deliverables:

- Updated navigation map.
- Role-specific menus.
- Redirects or aliases for moved pages.
- No loss of permissions or data access.

### Phase 2: Workspace Identity

Goals:

- Define the visual center of gravity for each major workspace.
- Keep one design system without making every page feel identical.
- Decide which KPIs, actions, and information belong above the fold per module.
- Prevent dashboard-style KPI overload inside operational pages.

Deliverables:

- Workspace Identity rules applied to planning.
- Module-by-module primary focus documented.
- Clear guidance for what each workspace should emphasize.

### Phase 3: Workspace Standardization

Goals:

- Apply common workspace structure across Tickets, Tasks, People, Assets, Contracts, Vendors, Documents, and Knowledge while preserving each workspace identity.
- Normalize headers, action bars, right context panels, tabs, cards, lists, tables, and empty states.
- Remove duplicated information.

Deliverables:

- Shared workspace layout rules.
- Consistent record list behavior.
- Consistent detail panel behavior.
- Readable timeline pattern.

### Phase 4: Form Simplification

Goals:

- Redesign create/edit flows around Basic and Advanced fields.
- Remove manual technical fields where possible.
- Use dropdowns and record pickers.
- Keep employee forms self-service oriented.

Deliverables:

- Simplified Ticket, Task, People, Asset, Contract, Vendor, Document, Knowledge, and User Account forms.
- Advanced Options standard.
- Validation and confirmation standards.

### Phase 5: Administration Consolidation

Goals:

- Make Settings the home for system configuration and governance.
- Organize Settings into clear sections.
- Separate Archive from Trash.
- Keep Audit technical and admin-focused.

Deliverables:

- Settings information architecture.
- Admin-only access patterns.
- Clear recovery and compliance flows.

### Phase 6: Release Candidate UX QA

Goals:

- Verify every visible action works or has a clear V1 message.
- Verify role-specific navigation.
- Verify no employee data leakage.
- Verify no raw payloads or technical labels in daily views.
- Verify responsive behavior.

Deliverables:

- Navigation QA report.
- Role QA report.
- Module UX QA report.
- Final V1 release readiness decision.
