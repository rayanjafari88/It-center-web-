# V1 Coverage Priorities

Generated from V1_FUNCTION_INVENTORY.md and latest automated QA results.

## Execution Summary

- Total tests: 52
- Passed: 52
- Failed: 0
- Blocked: 0
- Recommendation: GO

## Coverage Classification Summary

| Classification | Count |
| --- | ---: |
| Partial automation | 50 |
| Manual V1 check | 3 |
| API/security automation | 26 |
| Future version | 5 |

## Remaining Uncovered Classification

| Classification | Count |
| --- | ---: |
| Manual V1 check | 3 |
| Future version | 5 |

## Function Priorities

| Function ID | Module | Role | Current coverage | Risk | V1 importance | Proposed test | Automation feasibility | Final classification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INV-0001 | Tickets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-EMPLOYEE-ISOLATION-001, REG-TICKETS-001, PW-024 | Already automated or partially automated | Partial automation |
| INV-0002 | Timeline | Role-based | Not covered | Medium | Needs visual/detail inspection but not a release-blocking privacy path | Manual checklist item with role, language, viewport, and expected behavior | Partially automatable; manual visual confirmation remains better for V1 | Manual V1 check |
| INV-0003 | Assets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0004 | Knowledge Base | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0005 | Tasks | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-PERSONAL-TASK-001, SEC-TASK-FIELDS-001, REG-TASKS-001, PW-022, PW-023 | Already automated or partially automated | Partial automation |
| INV-0006 | Assets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0007 | Contracts | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0008 | Vendors | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0009 | Knowledge | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-KB-DOC-READONLY-001, REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0010 | Notification Preferences | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | API-PREFERENCES-001 | Already automated or partially automated | API/security automation |
| INV-0011 | People | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | API-EMPLOYEES-001, PW-014 | Already automated or partially automated | Partial automation |
| INV-0012 | User Accounts | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | API-USERS-ROLES-002 | Already automated or partially automated | API/security automation |
| INV-0013 | Employee Tickets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-EMPLOYEE-ISOLATION-001, REG-TICKETS-001, PW-024 | Already automated or partially automated | Partial automation |
| INV-0014 | Employee Assets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0015 | Employee Asset | Role-based | Not covered | Medium | Needs visual/detail inspection but not a release-blocking privacy path | Manual checklist item with role, language, viewport, and expected behavior | Partially automatable; manual visual confirmation remains better for V1 | Manual V1 check |
| INV-0016 | Employee Tasks | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-PERSONAL-TASK-001, SEC-TASK-FIELDS-001, REG-TASKS-001, PW-022, PW-023 | Already automated or partially automated | Partial automation |
| INV-0017 | Employee Archived Tasks | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-PERSONAL-TASK-001, SEC-TASK-FIELDS-001, REG-TASKS-001, PW-022, PW-023 | Already automated or partially automated | Partial automation |
| INV-0018 | Employee Documents | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | PW-008 | Already automated or partially automated | Partial automation |
| INV-0019 | Employee Knowledge Base | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0020 | Manager Tickets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-EMPLOYEE-ISOLATION-001, REG-TICKETS-001, PW-024 | Already automated or partially automated | Partial automation |
| INV-0021 | Tasks | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-PERSONAL-TASK-001, SEC-TASK-FIELDS-001, REG-TASKS-001, PW-022, PW-023 | Already automated or partially automated | Partial automation |
| INV-0022 | Roles | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | API-USERS-ROLES-002 | Already automated or partially automated | API/security automation |
| INV-0023 | Settings | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-019, PW-020, PW-021 | Already automated or partially automated | Partial automation |
| INV-0024 | Archive | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | REG-ARCHIVE-TRASH-001 | Already automated or partially automated | API/security automation |
| INV-0025 | Knowledge Base Article | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0026 | Employee Document | Role-based | Not covered | Medium | Needs visual/detail inspection but not a release-blocking privacy path | Manual checklist item with role, language, viewport, and expected behavior | Partially automatable; manual visual confirmation remains better for V1 | Manual V1 check |
| INV-0027 | Assets | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0028 | Tickets | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-EMPLOYEE-ISOLATION-001, REG-TICKETS-001, PW-024 | Already automated or partially automated | Partial automation |
| INV-0029 | Documents | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-KB-DOC-READONLY-001, PW-008 | Already automated or partially automated | Partial automation |
| INV-0030 | Contracts | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0031 | Vendors | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0032 | Knowledge Base | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0033 | Employee S | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | API-EMPLOYEES-001, PW-014 | Already automated or partially automated | Partial automation |
| INV-0034 | Users | Permitted users | Automated API/security covered | High | V1 covered by executed automated evidence | API-USERS-ROLES-002 | Already automated or partially automated | API/security automation |
| INV-0035 | Tasks | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-PERSONAL-TASK-001, SEC-TASK-FIELDS-001, REG-TASKS-001, PW-022, PW-023 | Already automated or partially automated | Partial automation |
| INV-0036 | Lookup Items | Permitted users | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-LOOKUP-001 | Already automated or partially automated | API/security automation |
| INV-0037 | Assign | Permitted users | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-TRANSFERS-001 | Already automated or partially automated | API/security automation |
| INV-0038 | Transfer | Permitted users | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-TRANSFERS-001 | Already automated or partially automated | API/security automation |
| INV-0039 | Return | Permitted users | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-TRANSFERS-001 | Already automated or partially automated | API/security automation |
| INV-0040 | Repair | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0041 | Renew | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0042 | Upload Document | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-KB-DOC-READONLY-001, PW-008 | Already automated or partially automated | Partial automation |
| INV-0043 | Export | Permitted users | Not covered | Low | Not required for V1 release | Add when feature is promoted from roadmap/placeholder | Automate later when workflow is active | Future version |
| INV-0044 | Terminate | Permitted users | Not covered | Low | Secondary workflow; current V1 behavior may be placeholder/confirmation-based | Workflow-specific Playwright test after V1.1 activation | Future automation | Future version |
| INV-0045 | Ticket | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-EMPLOYEE-ISOLATION-001, REG-TICKETS-001, PW-024 | Already automated or partially automated | Partial automation |
| INV-0046 | Link Assets | Permitted users | Automated browser covered | High | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0047 | Link Licenses | Permitted users | Not covered | Low | Not required for V1 release | Add when feature is promoted from roadmap/placeholder | Automate later when workflow is active | Future version |
| INV-0048 | Portal | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-009, PW-010 | Already automated or partially automated | Partial automation |
| INV-0049 | Contract | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0050 | Add Contact | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0051 | Publish | Permitted users | Automated browser covered | Medium | V1 covered by executed automated evidence | REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0052 | Duplicate | Permitted users | Not covered | Low | Not required for V1 release | Add when feature is promoted from roadmap/placeholder | Automate later when workflow is active | Future version |
| INV-0053 | Schedule Review | Permitted users | Not covered | Low | Not required for V1 release | Add when feature is promoted from roadmap/placeholder | Automate later when workflow is active | Future version |
| INV-0054 | Upload Attachment | Permitted users | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-COMMENTS-ATTACHMENTS-002 | Already automated or partially automated | API/security automation |
| INV-0055 | Archive | Permitted users | Automated API/security covered | Medium | V1 covered by executed automated evidence | REG-ARCHIVE-TRASH-001 | Already automated or partially automated | API/security automation |
| INV-0056 | Assignment Groups | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-ASSIGNMENT-GROUPS-001 | Already automated or partially automated | API/security automation |
| INV-0057 | Knowledge Base | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | REG-KNOWLEDGE-001, PW-011 | Already automated or partially automated | Partial automation |
| INV-0058 | Form Templates | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-FORM-TEMPLATES-001 | Already automated or partially automated | API/security automation |
| INV-0059 | Tasks | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-PERSONAL-TASK-001, SEC-TASK-FIELDS-001, REG-TASKS-001, PW-022, PW-023 | Already automated or partially automated | Partial automation |
| INV-0060 | Users | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | API-USERS-ROLES-002 | Already automated or partially automated | API/security automation |
| INV-0061 | Roles | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | API-USERS-ROLES-002 | Already automated or partially automated | API/security automation |
| INV-0062 | Attachments | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-COMMENTS-ATTACHMENTS-002 | Already automated or partially automated | API/security automation |
| INV-0063 | Comments | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-COMMENTS-ATTACHMENTS-002 | Already automated or partially automated | API/security automation |
| INV-0064 | Notifications | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-NOTIFICATIONS-002, PW-019, PW-020, PW-021 | Already automated or partially automated | Partial automation |
| INV-0065 | Lookup Items | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-LOOKUP-001 | Already automated or partially automated | API/security automation |
| INV-0066 | Audit Logs | Role-based | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-AUDIT-001 | Already automated or partially automated | API/security automation |
| INV-0067 | Employee S | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | API-EMPLOYEES-001, PW-014 | Already automated or partially automated | Partial automation |
| INV-0068 | Tickets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-EMPLOYEE-ISOLATION-001, REG-TICKETS-001, PW-024 | Already automated or partially automated | Partial automation |
| INV-0069 | Assets | Role-based | Automated browser covered | High | V1 covered by executed automated evidence | SEC-ASSET-ISOLATION-001, REG-ASSETS-001, PW-004 | Already automated or partially automated | Partial automation |
| INV-0070 | Login | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | API-AUTH-001, PW-005, PW-006 | Already automated or partially automated | Partial automation |
| INV-0071 | State | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-STATE-001 | Already automated or partially automated | API/security automation |
| INV-0072 | Preferences | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-PREFERENCES-001 | Already automated or partially automated | API/security automation |
| INV-0073 | People | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | API-EMPLOYEES-001, PW-014 | Already automated or partially automated | Partial automation |
| INV-0074 | Contracts | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0075 | Vendors | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-007 | Already automated or partially automated | Partial automation |
| INV-0076 | Settings | Role-based | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-019, PW-020, PW-021 | Already automated or partially automated | Partial automation |
| INV-0077 | Transfers | Role-based | Automated API/security covered | Medium | V1 covered by executed automated evidence | API-TRANSFERS-001 | Already automated or partially automated | API/security automation |
| INV-0078 | RBAC | System Admin | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-RBAC-PAGES-002 | Already automated or partially automated | API/security automation |
| INV-0079 | RBAC | IT Manager | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-RBAC-PAGES-002 | Already automated or partially automated | API/security automation |
| INV-0080 | RBAC | IT Staff | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-RBAC-PAGES-002 | Already automated or partially automated | API/security automation |
| INV-0081 | RBAC | Employee | Automated API/security covered | High | V1 covered by executed automated evidence | SEC-RBAC-PAGES-002 | Already automated or partially automated | API/security automation |
| INV-0082 | Localization | All | Automated browser covered | Medium | V1 covered by executed automated evidence | REG-LOCALIZATION-001, PW-012 | Already automated or partially automated | Partial automation |
| INV-0083 | Responsive | All | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-015, PW-016, PW-017, PW-018 | Already automated or partially automated | Partial automation |
| INV-0084 | Accessibility | All | Automated browser covered | Medium | V1 covered by executed automated evidence | PW-001 | Already automated or partially automated | Partial automation |
