# V1 Automated QA Test Plan

## Architecture Summary

IT Command Center V1 is a Node.js HTTP application. `server.js` serves static files from `public/` and exposes `/api/*` endpoints backed by `data/db.json`. The frontend in `public/app.js` calls same-origin APIs. RBAC is role-based and enforced server-side through shared permission helpers and record visibility checks.

Important systems covered by the QA harness:

- Authentication: `/api/login`
- State loading: `/api/state`
- Generic CRUD: `/api/:resource`
- Archive/trash/restore: `/api/:resource/:id/archive`, `/trash`, `/restore`
- Workflow endpoints: tickets, tasks, assets/transfers, contracts, vendors, knowledge base, users, assignment groups, settings
- Employee privacy: ticket/requester visibility, assigned assets, personal tasks, internal notes, audit access
- Audit/timeline/notifications: generated as side effects of creates, updates, comments, attachments, and workflows

## Automated Coverage

1. API smoke and CRUD
2. Security and RBAC matrix
3. Regression workflows
4. Browser-readiness and manual browser checklist generation
5. Localization static smoke
6. Data-volume smoke with safe limits
7. Cleanup verification

## Manual Browser Coverage

Browser tests are not faked. If browser automation is unavailable, use `qa/reports/V1_MANUAL_BROWSER_CHECKLIST.md`.

