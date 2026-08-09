# V1 Full QA Report

- Date/time: 2026-08-09T11:51:52.853Z
- Git branch: feat/dev-code-display
- Git commit: 1b767c5
- Environment: Node v24.18.0 on win32
- Server URL: http://127.0.0.1:4317
- Test tools: Node.js API/security/regression runner, Playwright Chromium browser runner, syntax checks, static/manual checklist
- Total tests: 44
- Passed: 43
- Failed: 0
- Blocked: 1
- Not executed: 0
- Release recommendation: **CONDITIONAL GO**
- QA data cleanup result: PASSED - no QA_AUTO_ records remain

## Results

| ID | Suite | Module | Role | Status | Severity | Message |
| --- | --- | --- | --- | --- | --- | --- |
| API-AUTH-001 | api | Authentication | All | passed | Critical | Executed |
| API-STATE-001 | api | State | All | passed | Critical | Executed |
| API-USERS-001 | api | User Accounts | System Admin | passed | High | Executed |
| API-EMPLOYEES-001 | api | People | IT Manager | passed | High | Executed |
| API-CRUD-001 | api | Core Modules | IT Manager | passed | High | Executed |
| API-LOOKUP-001 | api | Lookup Management | IT Manager | passed | Medium | Executed |
| API-USERS-ROLES-002 | api | Users/Roles | System Admin | passed | High | Executed |
| API-ASSIGNMENT-GROUPS-001 | api | Assignment Groups | IT Manager/System Admin | passed | High | Executed |
| API-FORM-TEMPLATES-001 | api | Form Templates | IT Manager | passed | Medium | Executed |
| API-PREFERENCES-001 | api | Preferences | All | passed | Medium | Executed |
| API-TRANSFERS-001 | api | Transfers | IT Manager | passed | High | Executed |
| SEC-AUTH-001 | security | Authentication | Anonymous | passed | Blocker | Executed |
| SEC-AUTH-002 | security | Authentication | Anonymous | passed | Blocker | Executed |
| SEC-AUTH-003 | security | Authentication | All | passed | Critical | Executed |
| SEC-AUTH-004 | security | Authentication | All | passed | Critical | Executed |
| SEC-AUTH-005 | security | Authentication | All | passed | High | Executed |
| SEC-DEVCODE-001 | security | Sign-in | All | passed | Critical | Executed |
| UI-LOGIN-STEPS-001 | regression | Sign-in | All | passed | High | Executed |
| SEC-HEADERS-001 | security | Transport | All | passed | High | Executed |
| SEC-ERRORS-001 | security | Error handling | All | passed | Medium | Executed |
| PLAT-ATTACH-001 | regression | Attachments | IT Manager | passed | Critical | Executed |
| PLAT-MFA-001 | security | Two-step sign-in | System Admin | passed | High | Executed |
| SEC-EMPLOYEE-ISOLATION-001 | security | Tickets | Employee | passed | Critical | Executed |
| SEC-ASSET-ISOLATION-001 | security | Assets | Employee | passed | Critical | Executed |
| SEC-PERSONAL-TASK-001 | security | Tasks | Employee/IT | passed | Critical | Executed |
| SEC-TASK-FIELDS-001 | security | Tasks | Employee | passed | High | Executed |
| SEC-AUDIT-001 | security | Audit Feed | Employee | passed | Critical | Executed |
| SEC-KB-DOC-READONLY-001 | security | Knowledge/Documents | Employee | passed | High | Executed |
| SEC-COMMENTS-ATTACHMENTS-002 | security | Comments/Attachments | Employee/IT | passed | Critical | Executed |
| SEC-NOTIFICATIONS-002 | security | Notifications | Employee/IT Manager | passed | High | Executed |
| SEC-RBAC-PAGES-002 | security | RBAC | All Roles | passed | Critical | Executed |
| REG-TICKET-ROUTING-001 | regression | Ticket Assignment | IT Manager/Employee | passed | Critical | Executed |
| REG-TICKET-REROUTE-001 | regression | Ticket Assignment | IT Manager | passed | High | Executed |
| REG-TICKET-ONBEHALF-001 | regression | Tickets | IT Staff/Employee | passed | Critical | Executed |
| REG-TICKETS-001 | regression | Tickets | Employee/IT Manager | passed | Critical | Executed |
| REG-TASKS-001 | regression | Tasks | Employee/IT Manager | passed | Critical | Executed |
| REG-ASSETS-001 | regression | Assets | IT Manager | passed | High | Executed |
| REG-KNOWLEDGE-001 | regression | Knowledge Base | IT Manager/Employee | passed | High | Executed |
| REG-ARCHIVE-TRASH-001 | regression | Archive/Trash | IT Manager | passed | High | Executed |
| REG-VOLUME-001 | regression | Data Volume | IT Manager | passed | Medium | Executed |
| REG-SYNTAX-001 | regression | Build/Syntax | All | passed | Critical | Executed |
| REG-LOCALIZATION-001 | regression | Localization | All | passed | Medium | Executed |
| BROWSER-STATIC-001 | browser | Browser Readiness | All | passed | Medium | Executed |
| BROWSER-MANUAL-001 | browser | Manual Browser Checklist | All | blocked | Medium | Automated browser actions were not executed by the Node QA runner. Use V1_MANUAL_BROWSER_CHECKLIST.md. |
