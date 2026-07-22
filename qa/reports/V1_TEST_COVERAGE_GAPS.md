# V1 Test Coverage Gaps

Generated during continuation of `qa/full-v1-regression`.

## Summary

The previous 22-test suite was a smoke baseline. It covered core API/security paths, but it did not execute real browser user flows. This document separates full coverage from partial or browser-only coverage.

Latest automated execution:

- Total tests: 42
- Passed: 42
- Failed: 0
- Blocked: 0
- Browser automation: Executed with Playwright Chromium
- Current recommendation: GO for automated QA evidence
- Fixed during this run: PW-013 mobile 390px horizontal overflow in the Employee Portal shell

| Area | Status | Reason |
| --- | --- | --- |
| Authentication | Covered by API + Browser | Login success/failure, logout, refresh persistence, employee admin visibility. |
| Users / Roles / Permissions | Partially covered | User create/update and RBAC checks covered. Full role editor UI and every permission toggle still need deeper browser coverage. |
| Employees / People | Partially covered | API create/edit covered. Browser onboarding form details are not fully exercised. |
| Assets | Covered for V1 critical flow | Browser/API create, edit, assign, employee visibility, duplicate serial. More lifecycle variants remain partial. |
| Tickets | Covered for V1 critical flow | Browser/API create, status, comments, internal note privacy, attachment, employee isolation. Full UI click-by-click ticket composer remains partial. |
| Tasks | Covered for V1 critical flow | Personal/work task creation, status transitions, personal privacy. Calendar view remains partial. |
| Contracts | Partially covered | API create relation covered. Renewal workflow browser coverage remains partial. |
| Vendors | Partially covered | API create/archive covered. Vendor contacts/performance tabs not fully covered. |
| Documents | Covered for basic V1 | Browser/API create/open/archive/restore. Binary preview/download remains partial. |
| Knowledge Base | Covered for critical privacy/publish | Browser/API draft privacy, publish, employee read. Governance/version compare remains partial. |
| Templates | Partially covered | API create covered. Browser template usage not fully covered. |
| Notifications | Partially covered | Notification side effects and state visibility covered. Bell dropdown browser flow remains partial. |
| Global Search | Not covered | Needs browser-level search assertions. |
| Archive Center | Partially covered | Archive/restore/trash state covered. Full center UI not covered. |
| Trash | Partially covered | Trash state covered. Permanent delete not executed for safety unless explicitly required. |
| Lookup Management | Partially covered | API create/edit covered. Sort/order and form propagation remain partial. |
| Quick Create | Browser-only partial | Header menu overlay smoke covered; individual quick-create workflows need more UI coverage. |
| Comments / Replies / Mentions | Partially covered | Comments/internal notes covered. Mentions and edit replies remain partial. |
| Attachments | Partially covered | Safe attachment upload covered. Disallowed/empty/long filename tests remain API TODO. |
| Localization RTL/LTR | Partially covered | Browser checks lang/dir persistence. Full label translation audit remains manual/visual. |
| Responsive | Covered smoke | 1440x900, 1024x768, 768x1024, and 390x844 passed after fixing the documented PW-013 mobile overflow defect. Detailed visual review remains manual. |

## Blocked or Manual Areas

- Pixel-level visual QA and screenshots are only collected on Playwright failure.
- Full accessibility audit is not automated.
- Deep workflow variants such as all contract/vendor governance flows are partial.
- Permanent deletion is intentionally not executed except where explicitly safe.

## Recommendation

Do not issue final V1 GO solely from automated tests until the remaining manual browser checklist has been executed and signed off. Automated coverage now includes real Playwright execution, so a future GO is possible after manual visual/accessibility gaps are closed or automated further.
