# IT Command Center V1 Workspace Design System

## Purpose

This document is the official UI/UX design rulebook for IT Command Center V1.

It is not a frontend component library, implementation guide, CSS file, or code standard. It is a product design specification that every future implementation sprint must follow.

This design system complements:

- `IT_Command_Center_V1_Product_Blueprint.md`
- `V1_UX_Implementation_Plan.md`

The goal is to make every workspace feel like part of one enterprise SaaS product while preserving each workspace's approved identity.

## 1. Design Philosophy

IT Command Center V1 should feel calm, operational, and professional.

### Simplicity

Every screen should make the next useful action obvious. Simplicity does not mean hiding power. It means showing the right amount of information for the current role, workflow, and decision.

### Operational Clarity

The user should always understand:

- What this screen is for.
- What needs attention.
- What action can be taken.
- What happened previously.
- What is related.

### Calm Interface

The product should reduce visual stress. Avoid heavy borders, excessive cards, crowded dashboards, and noisy colors. Use structure, spacing, and hierarchy instead of decoration.

### Progressive Disclosure

Show the common path first. Reveal advanced fields, system metadata, dangerous actions, audit details, and secondary context only when needed.

### One Primary Action at a Time

Each screen or section should have one obvious primary action. More than one primary action creates decision noise.

### Reduce Cognitive Load

Do not force users to interpret database fields, raw IDs, payloads, or technical action names. Use business language and readable labels.

### Consistency Without Identical Workspaces

The product should share one design language, but each workspace must keep its own center of gravity:

- Command Center is not Tickets.
- Tickets is not Assets.
- Knowledge Base is not Tasks.
- Settings is not Dashboard.

Consistency is about predictable behavior. Identity is about emphasizing the right work.

## 2. Global Layout Rules

### Header

The global header should remain compact and utility-focused.

It may include:

- Breadcrumb
- Global search
- Create action
- Notifications
- Language switch
- Theme switch
- User profile

It should not include module-specific clutter unless that action is globally relevant.

### Workspace Title

Every workspace should have a clear title. The title should describe the workspace, not the implementation.

Examples:

- Command Center
- Tickets
- Tasks
- People
- Assets
- Documents
- Knowledge Base
- Contracts
- Vendors
- Settings

### Subtitle

Use subtitles to explain the workspace purpose briefly. Avoid marketing copy and long help text.

Good:

- "Prioritize requests, assignments, and conversations."
- "Manage custody, lifecycle, warranty, and asset attention."

Avoid:

- Long feature descriptions.
- Basic instructions the UI already makes obvious.

### Status Badges

Status badges should be compact and readable. They should indicate state, not decorate the page.

Badges should be used for:

- Ticket status
- Priority
- Task status
- Asset status
- Contract health
- Vendor health
- Document status
- Knowledge status

### Primary Actions

Primary actions should be visible, few, and role-appropriate.

Rules:

- Maximum of three visible primary actions in a workspace header.
- Prefer one primary action when possible.
- Secondary actions belong in More.
- Dangerous actions never appear as the primary default action.

### More Menu

The More menu contains secondary, occasional, or destructive actions.

Examples:

- Archive
- Delete
- Export
- Print
- Link record
- Upload file if not central to the current workflow

### Spacing

Spacing should be consistent and calm:

- Use enough spacing to separate concepts.
- Avoid large empty areas that push work below the fold.
- Avoid dense clusters of unrelated actions.
- Lists and operational pages should be compact.
- Reading pages should have more breathing room.

### Section Hierarchy

Use clear section hierarchy:

1. Workspace title and primary action.
2. Above-the-fold primary content.
3. Secondary context.
4. Supporting history and metadata.

### Maximum Content Width

Workspaces should avoid stretching content indefinitely on large monitors.

Guidance:

- Dashboard: can use wider layouts for executive overview.
- Split workspaces: should use controlled column widths.
- Reading workspaces: should limit article/document body width for readability.
- Tables: should remain readable without forcing horizontal scrolling.

### Desktop Behavior

IT Manager and IT Staff workspaces are desktop-first. They should prioritize scanning, context, and workflow speed.

### Scrolling Behavior

Use independent scrolling where it improves workflow:

- Left record list can scroll independently.
- Center workspace can scroll independently.
- Right context panel can scroll independently.

Avoid making the full browser page the only scroll area in dense operational workspaces.

## 3. Workspace Layout Rules

### Single Workspace

Use for simple pages where one primary content flow is enough.

Best for:

- Settings sections
- Simple employee views
- Document reader
- Knowledge article reader

### Split Workspace

Use when users select records from a list and work in a detail pane.

Best for:

- Tickets
- Tasks
- People
- Assets
- Contracts
- Vendors
- Documents where admin management is needed
- Knowledge admin workspace

### Three-column Workspace

Use when the workflow requires:

- Left record list
- Center primary work area
- Right context panel

Best for:

- Tickets
- Assets
- Contracts
- Vendors

Only use three columns when the right context panel provides meaningful operational value.

### Right Context Panel

Use for compact record context, not duplicated full details.

### Left Record List

Use for search, filtering, and record selection.

### Center Workspace

The center workspace should hold the primary work:

- Conversation in Tickets
- Execution details in Tasks
- Lifecycle actions in Assets
- Profile summary in People
- Document/Article content in Documents and Knowledge
- Renewal context in Contracts
- Relationship context in Vendors

## 4. Header Rules

### Maximum Visible Primary Actions

No workspace header should show more than three visible primary actions.

Preferred:

- One primary button
- One or two secondary buttons
- More menu

### Secondary Actions

Secondary actions should be visible only when they are used frequently.

### Danger Actions

Danger actions include:

- Delete
- Permanent delete
- Archive
- Disable account
- Cancel
- Dispose
- Mark lost/stolen

Danger actions require confirmation and should usually live inside More or a workflow-specific dialog.

### Button Priority

Use this hierarchy:

1. Primary button
2. Secondary button
3. Icon button
4. More menu item
5. Disabled Coming Soon item

### Header Metadata

Header metadata should be minimal.

Examples:

- Ticket number
- Status
- Priority
- Owner
- Renewal health
- Asset status

Avoid repeating the full detail panel in the header.

### Breadcrumb Behavior

Breadcrumbs should reflect product structure:

- IT Command Center / Daily Operations / Tickets
- IT Command Center / Settings / User Accounts
- IT Command Center / Assets / Laptop 024

Do not create a new breadcrumb system unless one already exists. Extend the existing one when possible.

## 5. KPI Rules

### Where KPIs Belong

KPIs belong where they help the user act.

The Command Center owns broad operational KPIs. Individual workspaces own only local KPIs that directly support the workspace job.

### Where KPIs Should Never Appear

Avoid KPI overload in:

- Ticket conversation area
- Knowledge article body
- Document reader
- Employee self-service pages
- Forms
- Modal dialogs

### Maximum KPI Count

Guidance:

- Command Center: up to 8 visible KPIs if compact and useful.
- Operational workspace header: 2 to 4 local indicators.
- Detail page context panel: 3 to 6 compact context metrics.
- Employee pages: only summary counts that help self-service.

### Large KPI

Use only for executive awareness or primary dashboard metrics.

### Small KPI

Use for local status/context.

Examples:

- SLA remaining
- Days remaining
- Open linked tickets
- Assigned assets

### Executive KPIs

Belong in Command Center:

- Open tickets
- Critical tickets
- Overdue tasks
- Renewals due
- SLA risk
- Assets needing attention

### Operational KPIs

Belong in the workspace where action happens:

- Tickets: SLA, priority, assignment state
- Tasks: overdue, due today, progress
- Assets: warranty, custody, attention
- Contracts: days remaining, renewal health, cost
- Vendors: open tickets, active contracts, response SLA

### Workspace KPIs by Module

Command Center:

- Operational health
- Open work
- Risk signals

Tickets:

- SLA remaining
- Priority
- Status
- Assignment

Tasks:

- Due today
- Overdue
- In progress
- Completion state

Assets:

- Pending return
- Temporary custody
- In repair
- Warranty expiring
- Lost/stolen

People:

- Assigned assets
- Open tickets
- Open tasks
- Account status

Documents:

- Published/draft status
- Last updated
- Attachment count

Knowledge Base:

- Views
- Helpful score
- Version
- Review status

Contracts:

- Days remaining
- Renewal health
- Monthly/annual cost
- Linked assets/licenses

Vendors:

- Vendor health
- Open tickets
- Active contracts
- Assets covered
- Response SLA

Settings:

- Configuration health only if useful
- Active assignment groups
- Active lookup values

## 6. Cards Rules

### Card Spacing

Cards should have enough spacing to distinguish records but not so much that lists become slow to scan.

### Card Density

Density should match the task:

- Dashboard cards: compact and executive.
- Ticket cards: compact and scannable.
- Document cards: slightly more descriptive.
- Knowledge cards: readable and content-oriented.
- Asset cards: state and lifecycle focused.

### Information Hierarchy

Each card should have:

- Primary label/title
- One or two status indicators
- One concise secondary line
- Optional action only if needed

### Hover

Clickable cards should have a subtle hover state.

### Selected State

Selected records must be obvious in split workspaces.

Use:

- Stronger border
- Subtle background
- Clear active indicator

### Clickable Cards

Clickable cards should behave consistently: clicking the card opens the record or applies the filter.

### Static Cards

Static cards should not look clickable.

### Dashboard Cards

Dashboard cards must navigate to meaningful filtered data.

### Record Cards

Record cards should prioritize record identity and status, not every field.

## 7. Tables & Lists

### Cards

Use cards when records need context, status, or human scanning.

Best for:

- Employee tickets
- Employee documents
- Knowledge articles
- Asset summary cards

### Table

Use tables when users compare many structured records.

Best for:

- Ticket queue
- Contracts list
- Vendor related tickets
- Admin records

### Board

Use boards only when status movement is the primary workflow.

Do not use boards for employee ticket lists.

### Timeline

Use timeline for chronological events and history.

### Calendar

Use calendar for time-based task planning.

### List

Use lists for compact record selection.

### Tree

Use trees only for hierarchical content such as categories, knowledge structure, or future CMDB-like relationships.

### Selection Behavior

Selecting a record should not cause unexpected page jumps.

### Sorting

Sorting should be visible and predictable.

### Filtering

Filters should be easy to see, clear, and remove.

### Search

Search should preserve focus while typing.

## 8. Context Panel Rules

### Purpose

The context panel answers:

- Who owns this?
- What state is it in?
- What is related?
- What risk exists?
- What metadata matters now?

### Maximum Information

Context panels should stay compact. They should not become duplicate detail pages.

### Related Records

Related records belong here when they provide operational context:

- Requester
- Asset
- Vendor
- Contract
- Employee
- Knowledge suggestion

### Metadata

Metadata belongs here if it helps decision-making.

### Assignment

Assignment belongs in the context panel and/or action area.

### SLA

SLA belongs in Tickets and vendor-related ticket context.

### Renewal

Renewal belongs in Contracts and Command Center signals.

### Warranty

Warranty belongs in Assets and contract-related asset sections.

### Status

Status belongs in header and context panel, but avoid repeating it excessively.

### What Belongs Here

- Status
- Owner
- Assignee
- Related records
- SLA/renewal/warranty context
- Attachments count
- Watchers/stakeholders where relevant

### What Should Never Appear Here

- Raw JSON
- Full audit payloads
- Long comments
- Full article/document body
- Large tables
- Unrelated KPIs
- Duplicate dashboard summaries

## 9. Tabs Rules

### Maximum Number of Tabs

Most workspaces should use 3 to 5 tabs.

More than 5 tabs requires strong justification.

### Common Tabs

Use where appropriate:

- Overview
- Conversation or Notes
- Attachments or Documents
- Timeline

### Module-specific Tabs

Allowed when they match workspace identity:

- Tickets: Conversation, History
- Tasks: Overview, Notes, Attachments, Timeline
- Assets: Overview, Lifecycle, Documents, Timeline
- People: Overview, Assets, Tickets, Tasks, Documents, User Account
- Contracts: Overview, Renewals, Vendor, Assets, Documents, Costs, Timeline
- Vendors: Overview, Contacts, Contracts, Assets, Tickets, Documents, Performance, Timeline
- Knowledge Base: Content, Related Records, Versions, Review, Analytics, Timeline

### When Tabs Should Become Sections

Use sections instead of tabs when:

- Content is short.
- The user needs to compare information at once.
- Tab switching hides essential context.
- The page is employee-facing and should be simple.

## 10. Actions Rules

### Primary Action

The primary action is the most likely next action.

Examples:

- Tickets: Reply
- Tasks: Create Task or Change Status
- Assets: Assign/Transfer/Return
- Documents: Upload/Publish
- Contracts: Renew
- Vendors: Create Ticket or Add Contact

### Secondary Action

Secondary actions support the workflow but are less frequent.

### Danger Action

Danger actions require confirmation and should be visually distinct.

### More Menu

Use More for:

- Archive
- Delete
- Export
- Print
- Link record
- Future actions

### Quick Actions

Quick Actions should be global only when they create common records.

### Floating Actions

Avoid floating actions unless needed on mobile or long reading surfaces.

### Toolbar

Toolbars should not become button walls. Use grouping and More menus.

### Context Actions

Context actions belong near the object they affect.

Example:

- Attachment preview/download on file card.
- Promote to primary contact on contact card.
- Restore on archived record.

## 11. Forms Rules

### Basic Fields

Basic fields are needed for the common workflow.

### Advanced Fields

Advanced fields are less common, administrative, technical, or conditional.

### Required Fields

Required fields must be visible before save.

### Validation

Use inline validation with clear messages.

### Dropdowns

Use dropdowns for controlled values.

### Pickers

Use record pickers for linked records.

Do not ask users to type linked IDs.

### Sections

Group related fields:

- General
- Assignment
- Schedule
- Financial
- Documents
- Advanced

### Confirmation Dialogs

Use confirmation dialogs for:

- Archive
- Delete
- Permanent delete
- Complete/cancel important tasks
- Dispose assets
- Terminate contracts
- Disable accounts

### Create vs Edit Behavior

Create forms should be shorter than edit forms.

Edit forms may expose more fields if the user is authorized.

## 12. Status System

### Badge Hierarchy

Badges should communicate state quickly:

- Neutral
- Information
- Success
- Warning
- Danger
- Critical

### Priority Colors

- Low: soft blue or gray
- Medium: soft orange/blue depending context
- High: orange/red
- Critical: dark red

### Health Colors

- Healthy: green
- Attention: yellow/orange
- Critical: red
- Inactive: gray

### Lifecycle Colors

Lifecycle colors should be subdued and state-based.

Examples:

- Available: green
- Assigned: blue
- In Repair: orange
- Pending Return: red/orange
- Lost/Stolen: critical red
- Retired/Disposed: gray

### Approval Colors

- Draft: gray
- Pending Review/In Review: blue
- Approved/Published: green
- Changes Requested: orange
- Rejected: red
- Archived/Retired: gray

### Archive

Archive means inactive but retained.

### Draft

Draft means not yet published or finalized.

### Published

Published means visible to intended readers.

### Expired

Expired means past its valid date.

### Attention

Attention means the user should review.

### Critical

Critical means the user must act.

## 13. Timeline Rules

### Readable Language

Timeline entries must use human language.

Good:

- Status changed to In Progress.
- Assigned to Omar IT Staff.
- Attachment uploaded.
- Asset returned to IT Storage.

Bad:

- status_change
- PATCH payload
- entityId updated

### Human Sentences

Use complete, understandable messages.

### Grouping

Group repetitive events when appropriate.

### Icons

Use subtle icons to support meaning, not decorate.

### Chronological Order

Newest first for activity feeds. Oldest to newest for story-like lifecycle where appropriate.

### Avoid Technical Payloads

Do not show raw JSON or internal payloads in daily timeline views.

Audit can retain technical details for authorized admins.

## 14. Empty States

### Illustration Rules

Use simple, subtle illustrations only when they help. Do not use large decorative artwork in operational screens.

### Call-to-action

Empty states should offer the next useful action when allowed.

### Helpful Guidance

Explain what will appear here.

### Permission Messages

If access is restricted, say so clearly and calmly.

### No Data

Example:

- No tickets yet.
- No documents available.
- No linked assets.

### No Search Result

Example:

- No results found.
- Try a different keyword or clear filters.

## 15. Loading States

### Skeletons

Use skeletons for lists, cards, and detail panels.

### Loading Indicators

Use small indicators for short loading.

### Refreshing

Do not blank the entire page during refresh if existing content can remain visible.

### Saving

Use clear save states:

- Saving...
- Saved
- Unsaved changes

### Background Loading

Background loading should not block the whole workspace unless required.

## 16. Responsive Rules

### 1920

Use available width, but avoid over-stretching content.

### 1600

Primary desktop target for IT Manager workspaces.

### 1440

All operational workspaces must remain comfortable.

### 1366

Split workspaces must remain usable.

### 1280

Minimum practical desktop width for IT workspaces. Avoid horizontal overflow.

### Tablet

Use simplified stacking where needed.

### Employee Mobile

Employee Portal should work well on mobile:

- Single column
- Compact cards
- Touch-friendly buttons
- Simple forms

### IT Desktop

IT workspaces are desktop-first:

- High scanning speed
- Context panel where useful
- Compact lists
- No oversized headers

## 17. Accessibility Rules

### WCAG AA

Aim for WCAG AA contrast and interaction standards.

### Keyboard Navigation

Menus, tabs, dialogs, and forms should be keyboard accessible.

### Focus States

Focus states must be visible.

### Contrast

Text, badges, and buttons must remain readable in light and dark modes.

### Labels

Every input needs a label.

### Error Messages

Errors must be clear, visible, and close to the field.

### Touch Targets

Interactive targets should not be too small, especially in employee mobile views.

## 18. Visual Consistency Rules

### Typography

Use consistent heading, body, label, and metadata styles.

### Spacing

Use consistent spacing scales. Avoid random gaps.

### Icons

Use consistent icon style. Icons should support recognition.

### Badges

Badges should use consistent sizing and tone.

### Buttons

Button hierarchy must be consistent.

### Cards

Cards should have consistent radius, spacing, and elevation.

### Sections

Section headers should be predictable.

### Borders

Use subtle borders. Avoid heavy boxes.

### Corner Radius

Use consistent radius across cards, modals, buttons, and inputs.

### Shadows

Use soft shadows only where elevation is meaningful.

### Density

Density should match the workspace task:

- Dashboard: compact executive density.
- Tickets: dense conversation operations.
- Knowledge/Documents: readable content density.
- Settings: structured form density.

## 19. Workspace Identity Preservation

Every workspace must preserve its approved identity.

### Command Center = Operational Awareness

The Command Center should prioritize health, signals, and drilldowns.

### Tickets = Conversation

Tickets should prioritize the conversation and reply flow.

### Tasks = Execution

Tasks should prioritize status, due work, checklist, and progress.

### Assets = Lifecycle

Assets should prioritize custody, status, lifecycle actions, and history.

### People = Profile

People should prioritize identity, role, contact, access, and relationships.

### Documents = Document

Documents should prioritize reading, preview, download, and publish state.

### Knowledge = Article

Knowledge should prioritize article content, structure, feedback, and review state.

### Contracts = Renewal

Contracts should prioritize renewal health, dates, cost, vendor, and documents.

### Vendors = Relationship

Vendors should prioritize contacts, health, contracts, tickets, assets, and support context.

### Settings = Configuration

Settings should prioritize sections, forms, save states, and admin clarity.

Consistency must never erase these identities.

## 20. Anti-Patterns

Avoid:

- Too many KPIs.
- KPI cards inside every module.
- Duplicate information in header, context panel, tabs, and cards.
- Too many visible buttons.
- Multiple primary actions.
- Dashboard-style pages for every module.
- Generic CRUD pages.
- Database terminology.
- Raw IDs as primary labels.
- Raw technical payloads.
- Long ungrouped forms.
- Hidden navigation with no alternate path.
- Dead buttons.
- Silent placeholders.
- Overly decorative visuals.
- Heavy borders.
- Excessive empty whitespace.
- Tables where cards or conversations would be clearer.
- Cards where tables are needed for comparison.
- Employee-facing technical fields.
- Internal notes visible to employees.
- Audit details shown as daily user history.

## 21. Definition of Done

Every future UX/UI sprint must comply with this document.

A sprint is not done unless:

- It follows the Product Blueprint.
- It follows the V1 UX Implementation Plan.
- It preserves Workspace Identity.
- It uses the shared design system rules.
- It avoids listed anti-patterns.
- It preserves RBAC and role-specific visibility.
- It preserves existing workflows unless a bug fix is explicitly required.
- It keeps employee views simple.
- It keeps admin/configuration views separated from daily operations.
- It passes the sprint-specific QA checklist.
- It passes smoke tests for affected modules.
- It introduces no visible dead actions.
- It introduces no raw payloads in daily views.

This document is the official UI/UX rulebook for IT Command Center V1.

