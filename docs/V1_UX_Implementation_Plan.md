# V1 UX Simplification Implementation Plan - Version 3

## Purpose

This document converts the approved IT Command Center V1 Product Blueprint into a seven-sprint implementation roadmap for Codex.

Version 3 introduces the approved UX philosophy of Workspace Identity.

This plan does not change product scope. It does not add features. It defines sequencing and acceptance criteria for future UX implementation.

Implementation must preserve:

- Existing APIs
- RBAC
- Database structure
- Workflows
- Notifications
- Audit
- Timeline
- Business logic

## Implementation Strategy

The seven sprints move from structure to identity to experience to release readiness:

1. Product Structure
2. Workspace Identity
3. Dashboard Experience
4. Workspace Standardization
5. Forms Simplification
6. Employee Experience
7. Polish & Release Candidate

This order is intentional:

- Product Structure establishes where modules belong.
- Workspace Identity defines what each module should emphasize before any broad workspace standard is applied.
- Dashboard Experience follows because Command Center is the operational entry point.
- Workspace Standardization then applies shared patterns without flattening every page into the same hierarchy.
- Forms Simplification happens after workspace identity and structure are clear.
- Employee Experience is verified after global structure and forms are stable.
- Polish & Release Candidate comes last.

## Sprint 1: Product Structure

### Objective

Simplify the product's information architecture so users understand where work belongs.

This sprint reorganizes navigation and module placement without changing workflows or data.

### Includes

- Navigation
- Sidebar
- Information Architecture
- Settings restructuring
- Attachments relocation
- Lifecycle merge into Assets
- Documents architecture
- Vendors/Contracts architecture

### Modules Affected

- Sidebar
- Header navigation
- Settings
- Attachments
- Assets
- Lifecycle
- Documents
- Form Templates
- Vendors
- Contracts
- User Accounts
- Roles
- Audit Feed
- Archive Center
- Trash Bin

### Why This Sprint Exists

The current product exposes too many modules at the same level. Some are daily workspaces, while others are system tools or record context. This sprint establishes the correct mental model before workspace identity and layout decisions begin.

### Expected User Value

- Users understand the product faster.
- Daily work is easier to find.
- Administrative tools no longer distract from operations.
- Record context appears where users expect it.
- Settings becomes the home for system administration.

### Regression Risks

- Authorized users may temporarily have trouble finding moved modules.
- Direct navigation links could break if route aliases are not preserved.
- IT Staff may lose visible access if role-specific navigation is too restrictive.
- Dashboard cards may point to moved modules if destinations are not updated.
- Attachments or Lifecycle may become less discoverable if record-level access is incomplete.

### Manual QA Checklist

- Login as System Admin.
- Login as IT Manager.
- Login as IT Staff.
- Login as Employee.
- Verify daily sidebar modules match approved role expectations.
- Verify Settings contains administration modules.
- Verify Attachments are accessible from records.
- Verify Lifecycle is accessible through Assets.
- Verify Documents still opens.
- Verify Form Templates are accessible to authorized users from their new location.
- Verify Vendors and Contracts remain findable.
- Verify hidden modules are still protected by RBAC.
- Verify direct routes do not expose unauthorized pages.
- Verify no sidebar link is broken.

### Acceptance Criteria

- Main navigation contains only approved daily modules.
- Administration modules are grouped under Settings/Admin.
- Attachments are no longer treated as a daily workspace.
- Lifecycle is merged into the Assets experience.
- Documents, Templates, and Attachments have clear separation.
- Vendors and Contracts remain logically placed.
- Employee navigation remains restricted.

### Definition of Done

- Navigation is role-specific and understandable.
- No authorized workflow is lost.
- No unauthorized workflow becomes visible.
- All moved modules have a clear destination.
- No broken sidebar routes remain.

### Success Metrics

- Navigation can be understood within one minute by a new IT Manager.
- No duplicated modules appear in the sidebar.
- No database concepts are exposed in main navigation.
- Settings contains all administration modules.
- Employees see only employee-facing modules.
- IT Manager can still reach every operational tool.

## Sprint 2: Workspace Identity

### Objective

Define a unique primary job and visual center of gravity for every major workspace before standardizing layouts.

This sprint is planning and structural guidance only. It should not redesign screens by itself.

### Includes

- Workspace identity rules
- Above-the-fold priorities
- KPI ownership by workspace
- Primary vs menu action decisions
- Visual emphasis guidance
- Expected user journeys

### Modules Affected

- Command Center
- Tickets
- Tasks
- Assets
- People
- Documents
- Knowledge Base
- Contracts
- Vendors
- Settings

### Why This Sprint Exists

Sprint 1 made navigation cleaner, but it also exposed that operational modules can feel too similar. Consistency is good, but every workspace needs a clear purpose. Tickets should not feel like Assets. Knowledge should not feel like Tasks. Settings should not feel like Command Center.

### Expected User Value

- Users understand the job of each workspace faster.
- Operational pages stop competing with dashboard-style KPI clutter.
- Content-heavy pages give more space to content.
- Action-heavy pages emphasize operational controls.
- The product feels more intentional and less generic.

### Regression Risks

- Workspace identity decisions may conflict with existing layout assumptions.
- Teams may over-specialize pages and reduce consistency too much.
- KPI relocation may make some users think information disappeared.
- Primary action choices may require Product Owner confirmation.

### Manual QA Checklist

This sprint is documentation/planning first. When implemented later, verify:

- Command Center emphasizes operational awareness.
- Tickets emphasize conversation.
- Tasks emphasize execution.
- Assets emphasize lifecycle.
- People emphasize profile context.
- Documents emphasize document reading/preview.
- Knowledge Base emphasizes article reading.
- Contracts emphasize renewal health.
- Vendors emphasize relationship context.
- Settings emphasizes configuration.
- No operational page becomes a mini-dashboard without purpose.

### Acceptance Criteria

- Each major workspace has a documented primary objective.
- Each workspace has documented above-the-fold information.
- Each workspace has documented KPI ownership.
- Each workspace has documented primary actions and menu actions.
- Workspace Standardization will use identity rules instead of flattening all pages.

### Definition of Done

- Workspace Identity is documented in the Product Blueprint.
- Sprint roadmap reflects Workspace Identity before Dashboard and Workspace Standardization.
- Product Owner can review module identities before UI implementation.

### Success Metrics

- Every workspace can be described in one phrase:
  - Operational awareness first
  - Conversation-first
  - Execution-first
  - Lifecycle-first
  - Profile-first
  - Document-first
  - Article-first
  - Renewal-first
  - Relationship-first
  - Configuration-first
- Each workspace has no more than one primary visual center of gravity.
- KPIs are assigned to the workspace where they help users act.
- No operational workspace is planned as a generic copy of another workspace.

## Sprint 3: Dashboard Experience

### Objective

Make the Dashboard / Command Center the clear operational awareness workspace for IT.

This sprint improves how dashboard information is organized and how dashboard elements navigate into filtered operational data.

### Includes

- Dashboard layout
- KPI cards
- Widgets
- Drilldowns
- Filter context
- Quick Actions

### Modules Affected

- Dashboard / Command Center
- Tickets
- Tasks
- Assets
- Contracts
- Vendors
- Activity
- Notifications

### Why This Sprint Exists

The Command Center is the only workspace that should feel like an executive operations dashboard. It must guide the IT Manager toward urgent work, not merely display metrics.

### Expected User Value

- IT Manager sees operational health quickly.
- Important work is easier to prioritize.
- KPI cards and widgets become useful navigation.
- Dashboard actions reduce time to triage.
- Users land in the correct filtered workspace instead of generic pages.

### Regression Risks

- Dashboard filters may persist incorrectly.
- Drilldowns may open the wrong module or wrong filter.
- Quick Actions may duplicate existing create actions.
- Dashboard widgets may show stale counts if filters are mismatched.
- Dashboard layout changes may affect responsive behavior.

### Manual QA Checklist

- Verify Dashboard loads for IT Manager.
- Verify Dashboard loads for IT Staff if permitted.
- Verify Open Tickets card opens filtered Tickets.
- Verify Overdue Tasks opens filtered Tasks.
- Verify Renewals opens filtered Contracts.
- Verify Asset signals open filtered Assets.
- Verify chart rows drill into meaningful filtered data.
- Verify widget links preserve filter context.
- Verify Quick Actions work and do not duplicate conflicting actions.
- Verify no unwanted page jump after drilldown.
- Verify dashboard works at 1920, 1600, 1440, 1366, and 1280 widths.

### Acceptance Criteria

- Command Center emphasizes operational awareness first.
- Every clickable dashboard card has a logical destination.
- Every chart drilldown opens meaningful filtered data.
- Filters are understandable and removable.
- Dashboard hierarchy shows urgent information first.
- No dashboard action silently fails.

### Definition of Done

- Dashboard navigation audit passes.
- Dashboard filters work consistently.
- Dashboard remains compact and readable.
- No console errors appear during dashboard use.

### Success Metrics

- IT Manager can identify urgent work within 30 seconds.
- 100% of dashboard cards/widgets have working destinations.
- No dashboard item opens a generic page when filtered data is possible.
- Dashboard remains usable at 1280px width.
- No duplicate primary actions appear in the dashboard header.

## Sprint 4: Workspace Standardization

### Objective

Create one consistent workspace system while preserving each module's unique Workspace Identity.

This sprint aligns shared layout behavior, but does not make every page visually identical.

### Includes

- Tickets
- Tasks
- People
- Assets
- Documents
- Knowledge
- Contracts
- Vendors where needed

### Modules Affected

- Tickets
- Tasks
- People
- Assets
- Documents
- Knowledge Base
- Contracts
- Vendors

### Why This Sprint Exists

Different modules currently feel like separate products, but making them identical would create a new problem. This sprint creates a shared design system with module-specific hierarchy.

### Expected User Value

- Users learn one interaction model.
- Users still understand the distinct purpose of each workspace.
- Records are easier to scan.
- Actions are easier to find.
- Context panels reduce tab clutter.
- Detail pages feel calmer and more operational.

### Regression Risks

- Record selection could break in split workspaces.
- Search focus could regress.
- Context panels may duplicate or hide important data.
- Tabs could hide information users expect.
- Module-specific workflows could be flattened too much.
- Workspace identity may be lost if shared components dominate the page.

### Manual QA Checklist

- Verify each workspace loads.
- Verify search works and keeps focus.
- Verify filters work.
- Verify record selection opens detail.
- Verify active selected state is clear.
- Verify primary actions are visible.
- Verify secondary actions are in More where appropriate.
- Verify right context panels show useful summary.
- Verify Timeline is still accessible.
- Verify Attachments remain accessible from records.
- Verify no raw payloads appear in daily views.
- Verify each workspace's primary identity is visible above the fold.

### Acceptance Criteria

- Main workspaces follow a shared list/detail/context pattern.
- Each module preserves its unique workspace identity.
- Each module still preserves its operational workflow.
- No module feels like a legacy CRUD page.
- No duplicated metadata blocks appear without purpose.
- Timeline and related records remain available.

### Definition of Done

- Tickets, Tasks, People, Assets, Documents, Knowledge, Contracts, and Vendors follow the workspace standard.
- Each workspace keeps its approved center of gravity.
- Search, filters, details, and actions work in each module.
- No major workflow regression is found.

### Success Metrics

- A user can move between main workspaces without relearning controls.
- A user can still identify each workspace's unique job within 10 seconds.
- Search works consistently in all standardized workspaces.
- No workspace has more than three primary visible actions.
- Context panels reduce unnecessary Details tabs.
- No standard workspace exposes raw system payloads.

## Sprint 5: Forms Simplification

### Objective

Simplify create/edit dialogs so users enter business information, not database fields.

Only apply Basic / Advanced grouping where the form truly needs it. Small forms should remain simple.

### Includes

- Basic vs Advanced
- Smart Forms
- Validation
- Pickers
- Create/Edit dialogs

### Modules Affected

- Tickets
- Tasks
- People
- Assets
- Contracts
- Vendors
- Documents
- Knowledge Base
- User Accounts
- Settings forms where needed

### Why This Sprint Exists

Forms are where users make mistakes. Simplifying forms reduces confusion, bad data, and training cost.

### Expected User Value

- Create/edit flows become faster.
- Required decisions are clearer.
- Technical fields are hidden unless needed.
- Dropdowns and pickers replace manual typing.
- Employees see only plain-language request fields.

### Regression Risks

- Required fields may be hidden accidentally.
- Existing APIs may receive incomplete payloads.
- Defaults may be wrong or missing.
- Advanced fields may not save correctly.
- Pickers may filter records incorrectly.
- Employee ticket flow could regress.

### Manual QA Checklist

- Verify Ticket create/edit.
- Verify Task create/edit.
- Verify People create/edit.
- Verify Asset create/edit.
- Verify Contract create/edit.
- Verify Vendor create/edit.
- Verify Document create/edit.
- Verify Knowledge create/edit.
- Verify User Account create/edit.
- Verify Basic fields are visible.
- Verify Advanced fields are accessible where needed.
- Verify small forms are not overcomplicated.
- Verify validation messages appear inline.
- Verify dropdowns use allowed values.
- Verify record pickers store correct IDs internally.

### Acceptance Criteria

- Forms expose only necessary fields by default.
- Advanced fields are hidden or grouped where appropriate.
- Small forms remain simple.
- No technical/database field is exposed without a clear user reason.
- Create/edit workflows still complete successfully.

### Definition of Done

- All target forms are reviewed.
- Complex forms have Basic and Advanced structure.
- Small forms remain direct and lightweight.
- Validation works.
- No create/edit regression remains.

### Success Metrics

- Common create forms can be completed without understanding database concepts.
- Required field errors are clear and actionable.
- Manual linked ID entry is removed or hidden where supported.
- Employee ticket creation remains non-technical.
- No form exposes unnecessary system fields in the default view.

## Sprint 6: Employee Experience

### Objective

Keep the employee-facing experience extremely simple, self-service oriented, and restricted.

This sprint verifies and refines the employee experience after product structure, workspace identity, workspace standards, and forms are stable.

### Includes

- Employee Dashboard
- My Assets
- My Tickets
- My Tasks
- Knowledge
- Documents

### Modules Affected

- Employee Dashboard
- Employee Tickets
- Employee Ticket Detail
- Employee Ticket Creation
- My Tasks
- My Assets if visible
- Company Documents
- Knowledge Base
- Notifications
- Profile menu

### Why This Sprint Exists

Employees should not experience the complexity of the IT Manager workspace. Their experience should answer: What do I need? What is my ticket status? Where can I find help?

### Expected User Value

- Employees can submit requests without technical language.
- Employees can track their own work and requests.
- Employees can read documents and knowledge articles.
- Employees are not exposed to admin modules or internal IT fields.
- Employee trust improves because the portal is focused and predictable.

### Regression Risks

- Employee may accidentally see admin modules.
- Employee may lose access to their own records.
- Internal notes may become visible.
- Company Documents may expose unpublished documents.
- Employee ticket creation may lose required payload fields.
- Employee task status or custom category behavior could regress.

### Manual QA Checklist

- Login as Employee.
- Verify Employee Dashboard loads.
- Verify employee navigation is limited.
- Verify Create Ticket works.
- Verify employee sees own tickets only.
- Verify employee cannot edit protected ticket fields.
- Verify internal notes are hidden.
- Verify employee can reply to own ticket.
- Verify employee can upload attachment to own ticket.
- Verify My Tasks works.
- Verify Company Documents show published documents only.
- Verify employee cannot edit documents.
- Verify Knowledge shows published articles only.
- Verify notifications are scoped to employee.
- Verify employee cannot access admin URLs.

### Acceptance Criteria

- Employee Portal remains narrow and clear.
- Employee sees only authorized self-service modules.
- Employee ticket, task, document, and knowledge workflows work.
- Employee data isolation remains enforced.
- No IT/admin language leaks into employee views.

### Definition of Done

- Employee Portal QA passes.
- Employee permissions are verified server-side.
- Employee navigation and terminology match the blueprint.
- No employee-facing blocker remains.

### Success Metrics

- Employee can understand available actions within 30 seconds.
- Employee can create a ticket without seeing technical fields.
- Employee sees only own tickets, tasks, and permitted documents.
- Employee cannot access admin modules by sidebar or direct route.
- Published-only document and knowledge visibility is enforced.

## Sprint 7: Polish & Release Candidate

### Objective

Complete final UX QA, readability, responsive, accessibility, and Release Candidate readiness checks.

### Includes

- Timeline readability
- Audit separation
- Responsive
- Accessibility
- Final UX QA
- Release Candidate checklist

### Modules Affected

All modules.

### Why This Sprint Exists

This sprint ensures the simplified product is stable, readable, accessible, and ready for Release Candidate review.

### Expected User Value

- Product feels coherent and production-ready.
- Each workspace feels consistent but not identical.
- History is readable.
- Audit remains available for authorized users.
- Layout works across target widths.
- Visible actions are trustworthy.
- Release Candidate review can focus on final approval instead of unresolved UX confusion.

### Regression Risks

- Readability changes may accidentally hide technical audit information.
- Responsive changes may introduce layout overflow.
- Accessibility fixes may alter visual spacing.
- Final cleanup may remove placeholder actions that should remain visible as Coming Soon.
- Broad QA may uncover bugs that require targeted fixes.

### Manual QA Checklist

- Verify timeline events are readable.
- Verify audit is separate from daily timeline where appropriate.
- Verify no raw JSON appears in daily views.
- Verify no visible action does nothing silently.
- Verify each workspace identity remains visible.
- Verify Light mode.
- Verify Dark mode.
- Verify System mode.
- Verify 1920px width.
- Verify 1600px width.
- Verify 1440px width.
- Verify 1366px width.
- Verify 1280px width.
- Verify Employee Portal mobile smoke test.
- Verify keyboard focus states.
- Verify inputs have labels.
- Verify status badges are readable.
- Verify all main modules load.
- Verify no browser console errors.

### Acceptance Criteria

- No P0 UX or workflow blockers remain.
- No employee data isolation issues remain.
- No broken visible actions remain.
- No major horizontal overflow remains.
- Timeline is readable.
- Audit is available to authorized admins.
- Workspace identities remain clear.
- Release Candidate checklist is complete.

### Definition of Done

- Final UX QA report is complete.
- Release Candidate checklist passes.
- Remaining issues are classified as blocker, important, or future.
- Product Owner can review V1 Release Candidate.

### Success Metrics

- 100% of main modules load without console errors.
- 100% of visible V1 actions either work or clearly indicate future availability.
- No employee access regression is found.
- Product is usable at all target desktop widths.
- Timeline entries are readable in daily workflows.
- Audit remains available for authorized admin review.
- Every major workspace has a recognizable primary identity.

## Cross-sprint Dependencies

- Sprint 1 establishes navigation and structure for all later work.
- Sprint 2 depends on Sprint 1 because identity decisions need the approved module map.
- Sprint 3 depends on Sprint 1 and Sprint 2 because Command Center must stay awareness-first.
- Sprint 4 depends on Sprint 2 and Sprint 3 because shared workspace standards must preserve module identity.
- Sprint 5 depends on Sprint 4 because forms should match the workspace they belong to.
- Sprint 6 depends on Sprints 1 through 5 because employee views must remain simple after global changes.
- Sprint 7 depends on all previous sprints.

## Global Regression Risks

- Role-specific navigation may conflict with existing RBAC expectations.
- Moving modules may confuse users unless labels and destinations are clear.
- Settings may become too broad if not sectioned well.
- Workspace identity may become too custom and reduce consistency.
- Workspace standardization may become too generic and erase identity.
- Dashboard filter state may leak between modules.
- Form simplification may hide required fields.
- Employee Portal may inherit IT/Admin components unintentionally.
- Record-level attachments must remain discoverable after sidebar removal.
- Audit and Timeline separation must not remove compliance information.
- Responsive changes must not break split workspaces.

## Required Smoke Tests After Every Sprint

After every implementation sprint:

- Run `node --check public/app.js`.
- Run `node --check server.js`.
- Login as IT Manager.
- Login as Employee.
- Open Dashboard.
- Open Tickets.
- Open Tasks.
- Open Documents.
- Open Knowledge Base.
- Verify Employee cannot access admin pages.
- Verify browser console has no new errors.

If the sprint touches admin structure:

- Login as System Admin.
- Open Settings.
- Verify User Accounts.
- Verify Roles.
- Verify Archive.
- Verify Trash.
- Verify Audit.
- Verify Lookup Management.

If the sprint touches record context:

- Test comments.
- Test attachments.
- Test timeline.
- Test archive/restore.

If the sprint touches workspace identity:

- Verify Command Center remains operational awareness-first.
- Verify Tickets remain conversation-first.
- Verify Tasks remain execution-first.
- Verify Assets remain lifecycle-first.
- Verify People remain profile-first.
- Verify Documents remain document-first.
- Verify Knowledge Base remains article-first.
- Verify Contracts remain renewal-first.
- Verify Vendors remain relationship-first.
- Verify Settings remain configuration-first.

## Final Release Candidate Checklist

### Navigation

- Main navigation contains approved daily modules.
- Admin/system modules live under Settings/Admin.
- Employee navigation is restricted and simple.
- No duplicate sidebar modules remain.
- No broken routes remain.

### Workspace Identity

- Command Center is operational awareness-first.
- Tickets are conversation-first.
- Tasks are execution-first.
- Assets are lifecycle-first.
- People is profile-first.
- Documents are document-first.
- Knowledge Base is article-first.
- Contracts are renewal-first.
- Vendors are relationship-first.
- Settings is configuration-first.
- No operational workspace has unnecessary dashboard-style KPI overload.

### Dashboard

- Dashboard shows clear operational hierarchy.
- Dashboard cards drill into filtered data.
- Charts drill into meaningful filtered views.
- Quick Actions work and do not duplicate conflicting primary actions.

### Workspaces

- Main workspaces follow consistent list/detail/context patterns.
- Shared patterns do not erase module identity.
- Search retains focus.
- Filters preserve context.
- Selected state is obvious.
- No horizontal overflow at target widths.

### Forms

- Basic fields are visible.
- Advanced fields are hidden only where appropriate.
- Small forms remain simple.
- Validation is clear.
- Technical fields are hidden from normal users.

### Employee Experience

- Employee Portal remains self-service focused.
- Employee sees only authorized modules.
- Employee cannot access other employee data.
- Employee cannot see internal notes.
- Employee sees only published documents and knowledge.

### Timeline / Audit

- Timeline is readable.
- Audit remains available to authorized admins.
- No raw payloads appear in daily views.

### Permissions

- Employee restrictions pass.
- IT Staff permissions pass.
- IT Manager permissions pass.
- System Admin access passes.
- Server-side RBAC remains enforced.

### Release Decision

V1 Release Candidate can proceed only when:

- No P0 blockers remain.
- No employee data isolation issue remains.
- No visible V1 action silently fails.
- No major workflow is broken.
- Workspace identities are clear.
- Product Owner has approved open naming and module-placement decisions.

