# IT Command Center Automated QA

This folder contains the permanent V1 QA system for IT Command Center.

The QA system is intentionally lightweight:

- No external test dependency is required.
- Tests exercise the real `server.js` HTTP API.
- QA records use the `QA_AUTO_` prefix.
- Cleanup removes only QA-owned records and leaves demo data intact.
- Browser automation is not marked passed unless it actually runs. V1 currently generates a manual browser checklist for browser-only coverage.

## Commands

```bash
npm run test:api
npm run test:security
npm run test:regression
npm run test:browser
npm run test:all
npm run qa:seed
npm run qa:cleanup
npm run qa:report
```

## QA Credentials

`qa:seed` creates QA-only users for:

- System Admin
- IT Manager
- IT Staff
- Employee A
- Employee B

The password is configured by `QA_AUTO_PASSWORD`. If it is omitted, the scripts use a generated QA-only default. Reports do not print the password.

## Safety Rules

- Work only inside this project.
- Do not use production or demo records for destructive tests.
- Use `QA_AUTO_` for all created records.
- Run `npm run qa:cleanup` after interrupted tests.
- Do not weaken RBAC or privacy rules to make tests pass.

