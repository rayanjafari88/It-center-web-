# IT Command Center V1 Workspace Standard

Status: Official V1 reference

Purpose: This document defines the workspace standard for all remaining IT Command Center V1 workspaces, based on the completed Tickets and Assets workspaces and the approved Product Blueprint, Workspace Design System, and Workspace Identity model.

This is a product and UX standard only. It does not define new features, APIs, permissions, database changes, or workflow changes.

## 1. Executive Decision

Tickets and Assets now represent the official V1 direction, but they should not be copied literally.

The official standard is:

- Use a consistent enterprise shell and workspace structure.
- Preserve each module's unique identity.
- Put the workspace's primary job above the fold.
- Keep the primary content/action area dominant.
- Move secondary context into tabs, context panels, or lower sections.
- Avoid generic CRUD layouts.
- Avoid turning every workspace into a mini-dashboard.

Tickets is the reference for conversation-first workspaces.

Assets is the reference for lifecycle-first operational workspaces.

Future workspaces must follow the same design discipline, not the same exact layout.

## 2. Tickets Workspace Evaluation

Workspace identity: Conversation-first

Primary user: IT Manager and IT Staff handling support requests

Primary job: Understand the request, communicate, change status/assignment, and preserve activity history.

### Strengths

- The workspace is clearly conversation-first.
- The selected ticket title is now shown once, avoiding duplicated subject display.
- The ticket list is compact and scannable.
- The main workspace keeps conversation, reply, and operational actions close together.
- Tabs are limited to useful daily sections:
  - Conversation
  - Details
  - Files
  - Timeline
- The right context panel keeps secondary information available without dominating the workspace.
- Primary actions are focused:
  - Reply
  - Assign
  - Change Status
- Secondary actions are grouped under More.
- Internal notes remain part of the IT conversation model without being employee-facing.
- Timeline is separated from daily conversation and remains available for history.
- The workspace avoids broad KPI cards that belong in Command Center.

### Remaining UX Debt

- The action bar still contains several management controls in a tight horizontal area.
- Save/change confirmation flow may need more refinement in a later release for heavy ticket volume.
- Files are available as a tab and through upload actions, but the long-term attachment experience should become more unified.
- The right context panel can become dense when tickets have many relationships.
- Watchers, vendor linking, contract linking, print, and export are visible as future actions rather than full V1 workflows.
- Timeline readability is acceptable for V1 but should be made more narrative and event-grouped in V1.1.

### Anything That Should NOT Be Copied

- Do not copy the conversation-dominant layout to every module.
- Do not force every workspace to use the same tabs as Tickets.
- Do not copy ticket-specific action density into simpler workspaces.
- Do not place reply/comment composers in modules where communication is not the primary job.
- Do not make every right panel as relationship-heavy as Tickets unless the module requires it.
- Do not use ticket status workflow patterns for assets, documents, contracts, or people.

### Patterns That SHOULD Become the Official Standard

- Compact left list with search and filters.
- Clear selected state in the left list.
- One visible primary title for the selected record.
- Primary actions visible near the selected record.
- Secondary actions under More.
- Context panel for secondary information.
- Tabs limited to daily-use sections.
- Timeline as user-readable history, not raw audit.
- No duplicated title/status/requester blocks across multiple sections.
- No broad dashboard KPI strip inside the workspace.

### V1 Decisions to Freeze

- Tickets remains conversation-first.
- Conversation is the default tab.
- Tabs remain:
  - Conversation
  - Details
  - Files
  - Timeline
- Audit is not a daily primary tab for ticket handling.
- Internal notes remain IT-only.
- Files remain accessible but do not dominate the main workspace.
- More menu contains non-primary actions.
- Command Center owns broad ticket metrics.

### Items Intentionally Postponed to V1.1

- Full watcher management.
- Vendor and contract linking as complete workflows.
- Print and export workflows.
- Advanced SLA timeline visualization.
- More advanced attachment management and versioning.
- Bulk ticket operations.
- Advanced queue views.
- More refined status-change interaction for high-volume support teams.

## 3. Assets Workspace Evaluation

Workspace identity: Lifecycle-first

Primary user: IT Manager and IT Staff managing physical and financial asset custody

Primary job: Understand asset state, custody, holder, location, attention level, and perform lifecycle workflows.

### Strengths

- The workspace now clearly prioritizes lifecycle state above the fold.
- The first visible information answers:
  - What asset is this?
  - What lifecycle state is it in?
  - Who is responsible?
  - Who currently holds it?
  - Where is it?
  - Does it need attention?
- Lifecycle actions are grouped together in one operational area.
- The separate Assignment tab was removed, reducing duplication.
- Tabs now reflect the asset job more clearly:
  - Overview
  - Lifecycle
  - Maintenance
  - Tickets
  - Documents
  - Timeline
- Overview is now less repetitive and focuses on identity, operational context, and financial/disposal detail.
- Lifecycle is the visual center of gravity.
- Warning states such as Pending Return, Temporary Custody, Disposed, Lost, and Stolen have a clear place in the hierarchy.
- The workspace avoids dashboard-like metrics and shows operational context instead.

### Remaining UX Debt

- Lifecycle actions are still numerous and may need grouping into primary and secondary action clusters in V1.1.
- Some actions such as Print Label and Create Ticket may eventually belong in a More menu if action density grows.
- Maintenance is represented through lifecycle records, but a richer maintenance model may be needed later.
- Documents remain record-linked, but document preview/upload patterns should be standardized across modules.
- Financial and disposal information is visible, but future finance/HR approval workflows are not part of V1.
- Asset history depends on transfer/lifecycle records; older records may have uneven detail quality.

### Anything That Should NOT Be Copied

- Do not copy the lifecycle action grid into non-lifecycle modules.
- Do not use status/custody cards as the primary area for documents, knowledge, people, or tickets.
- Do not copy asset attention indicators into modules where attention is not operationally meaningful.
- Do not overload future workspaces with many workflow buttons unless those actions are truly the daily job.
- Do not make every workspace lifecycle-first.

### Patterns That SHOULD Become the Official Standard

- Above-the-fold content must answer the workspace's primary operational question.
- Operational actions must be grouped and clearly labeled.
- Tabs should remove duplicated information and represent actual work areas.
- Warning states should be visually clear but not decorative.
- Overview should summarize identity and context, not repeat every field.
- Timeline should show readable lifecycle events.
- Record-specific actions should preserve history and avoid manual field editing where workflows exist.
- Supporting records such as tickets and documents should be available without becoming the main focus.

### V1 Decisions to Freeze

- Assets is lifecycle-first.
- The standalone Lifecycle navigation remains merged into Assets.
- Tabs remain:
  - Overview
  - Lifecycle
  - Maintenance
  - Tickets
  - Documents
  - Timeline
- Asset lifecycle actions stay grouped above the tabs.
- Manual operational ownership edits should remain minimized.
- Dashboard-level asset metrics belong in Command Center, not inside the asset detail workspace.
- Asset timeline should remain readable and lifecycle-oriented.

### Items Intentionally Postponed to V1.1

- Grouped action menu for lower-frequency lifecycle actions.
- Advanced maintenance records.
- Label printing implementation depth.
- Disposal approval and settlement workflows.
- Asset depreciation and financial controls.
- Bulk asset operations.
- More advanced document handling for invoices, photos, approvals, and receipts.
- Enhanced lifecycle visualization with stage/progress indicators.

## 4. Official V1 Workspace Pattern

Every major V1 workspace should use this pattern unless the Product Owner approves an exception.

### Left Area: List and Filtering

Purpose: Find and select records quickly.

Standard:

- Search at the top.
- Important filters below search.
- Compact record cards or rows.
- Clear selected state.
- Show only the minimum identifying information.
- Avoid large cards in the list.
- Preserve search focus.

Do:

- Show record number/name/title.
- Show one or two status/context badges.
- Show one short secondary line.

Do not:

- Show full descriptions in the list.
- Duplicate all detail-panel fields.
- Add dashboard metrics to the list.

### Main Area: Workspace Center of Gravity

Purpose: Support the module's primary job.

Standard:

- One clear selected-record title.
- One primary visual focus.
- Primary actions visible.
- Important state/context above tabs.
- Tabs or sections below the primary area.

Workspace centers of gravity:

- Tickets: conversation and reply.
- Assets: lifecycle state and custody actions.
- Tasks: execution state, checklist, status, due work.
- People: person profile and linked access/relationships.
- Documents: document reading/preview/download.
- Knowledge: article content and governance state.
- Contracts: renewal health, dates, owner, vendor, cost.
- Vendors: relationship health, contacts, contracts, tickets.
- Settings: configuration sections and save states.

### Right Area: Context Panel

Purpose: Keep supporting information visible without distracting from the primary job.

Use for:

- Related records.
- Ownership/assignment context.
- Counts and compact summaries.
- Secondary links.
- Support details.

Do not use for:

- Another copy of the main content.
- Broad dashboard metrics.
- Raw IDs unless no human label exists.
- Large tables.

### Tabs

Purpose: Separate work areas without hiding the primary job.

Rules:

- Tabs should be few and meaningful.
- Default tab must match workspace identity.
- Avoid duplicated tabs.
- Do not expose Audit as a daily tab unless the workspace is explicitly administrative.
- Timeline means readable history.
- Audit means technical/compliance history and should remain admin-focused.

### Actions

Rules:

- No more than three primary visible actions.
- Secondary actions go into More.
- Disabled/future actions must be clearly marked.
- No silent placeholder actions.
- Destructive actions require confirmation.
- Workflow actions should preserve history.

## 5. Workspace Identity Standards

### Command Center: Operational Awareness First

Above the fold:

- Operational health.
- Priority signals.
- Work requiring attention.

Do not copy Tickets or Assets layout.

### Tickets: Conversation First

Above the fold:

- Subject.
- Requester.
- Status/priority/assignee.
- Conversation.
- Reply composer.

### Tasks: Execution First

Above the fold:

- Task title.
- Status.
- Due date.
- Priority.
- Checklist/progress.
- Fast status update.

### Assets: Lifecycle First

Above the fold:

- Asset identity.
- Lifecycle state.
- Custody.
- Current holder.
- Location.
- Attention.
- Lifecycle actions.

### People: Profile First

Above the fold:

- Person identity.
- Department/job title/status.
- Contact.
- User account state.
- Key relationships.

### Documents: Document First

Above the fold:

- Document title.
- Description/status.
- Preview/download.
- Attachment/document body.

### Knowledge: Article First

Above the fold:

- Article title.
- Status/version.
- Body/content.
- Author/review metadata.

### Contracts: Renewal First

Above the fold:

- Renewal health.
- Days remaining.
- Vendor.
- Owner.
- Cost.
- Renewal actions.

### Vendors: Relationship First

Above the fold:

- Vendor name.
- Status/criticality.
- Primary contact.
- Open contracts/tickets.
- Relationship health.

### Settings: Configuration First

Above the fold:

- Settings section.
- Purpose.
- Configuration form.
- Save state.

## 6. V1 Decisions to Freeze Across Workspaces

- Workspace Identity is mandatory.
- Consistency must not erase module purpose.
- Each workspace gets one primary visual center of gravity.
- Dashboard-level KPIs stay in Command Center.
- Daily operational tabs stay user-readable.
- Audit remains technical/admin-oriented.
- Related records should be accessible but not duplicated everywhere.
- Attachments should be record-level unless a user is explicitly in attachment administration.
- Primary actions should be obvious and limited.
- More menu is the home for secondary and future actions.
- No raw payloads in daily workspaces.
- No generic CRUD detail pages as the final V1 pattern.

## 7. Patterns to Avoid in Future Workspaces

Do not copy:

- Ticket conversation layout into non-conversation modules.
- Asset lifecycle state cards into non-lifecycle modules.
- Large identity strips that duplicate the selected record title.
- Multiple sections showing the same status, owner, requester, or holder.
- Repeated tabs with empty or near-duplicate content.
- Dashboard-like KPI rows inside every operational page.
- More than three primary visible actions.
- Silent placeholders.
- Raw technical labels or payloads.
- Overly tall headers that push work below the fold.
- Forms that expose database structure instead of user intent.

## 8. Official Patterns to Reuse

Reuse:

- Compact searchable left list.
- Strong selected state.
- One title in the detail header.
- Primary state above tabs.
- Primary actions grouped near the record.
- Secondary actions under More.
- Context panel for related/supporting information.
- Readable timeline cards.
- Friendly empty states.
- Compact status/priority/attention badges.
- Section labels that explain user purpose, not database structure.
- Responsive collapse rules that preserve the primary job.

## 9. V1.1 Backlog Shared Across Workspaces

The following improvements are intentionally postponed:

- Bulk operations.
- Advanced exports.
- Print workflows.
- Full watcher/follower systems.
- Advanced attachment versioning.
- Advanced approval chains beyond existing V1 governance.
- More advanced timeline grouping.
- Cross-workspace relationship graph views.
- Advanced SLA/asset/contract visualizations.
- Deep reporting dashboards outside Command Center.
- Heavy customization of workspace layouts.

## 10. Acceptance Criteria for Remaining Workspace Updates

A workspace meets the V1 standard when:

- Its identity is obvious within five seconds.
- The above-the-fold area answers the module's primary question.
- The primary action path is visible.
- Secondary actions are available but not noisy.
- There is no duplicated title/status/owner information.
- Tabs match the user's work areas.
- Timeline is readable.
- Audit is not exposed as a daily work surface unless appropriate.
- Search and selection remain fast.
- RBAC and role visibility are preserved.
- Employee-facing screens remain simpler than IT/admin workspaces.
- No visible button does nothing silently.
- The workspace passes `node --check public/app.js` and `node --check server.js` after implementation.

## 11. Final Product Owner Ruling

Tickets and Assets are approved as directional V1 standards.

They are not identical templates.

Tickets proves the conversation-first standard.

Assets proves the lifecycle-first standard.

The remaining workspaces should now be modernized by identity:

- Tasks should become execution-first.
- People should become profile-first.
- Documents should become document-first.
- Knowledge should become article-first.
- Contracts should become renewal-first.
- Vendors should become relationship-first.
- Settings should remain configuration-first.

The standard is now frozen for V1 unless a usability blocker is discovered.
