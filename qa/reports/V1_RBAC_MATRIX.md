# V1 RBAC Matrix

| Test | System Admin | IT Manager | IT Staff | Employee |
| --- | --- | --- | --- | --- |
| API visibility and direct access | Covered | Covered | Covered | Covered |
| Employee A cannot see Employee B tickets/assets/tasks/notifications | N/A | N/A | N/A | Passed |
| IT roles cannot see employee personal tasks | Passed | Passed | Passed | Owner only |
| Employees cannot access audit logs | N/A | N/A | N/A | Passed |

See V1_TEST_RESULTS.json for evidence.
