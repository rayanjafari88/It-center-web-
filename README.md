# IT Command Center V1

IT Command Center V1 is an enterprise IT operations prototype for managing employee requests, tickets, tasks, people, assets, documents, knowledge base content, contracts, vendors, notifications, audit history, archive/trash flows, and an employee self-service portal.

## Key Capabilities

- Employee Portal for requests, tickets, tasks, assets, documents, and knowledge articles
- IT Manager Command Center for operational awareness and priority work
- Ticket workspace with conversation, status, assignment, attachments, timeline, and audit support
- Task workspace with execution-focused task management
- Asset lifecycle and custody tracking
- People and user account administration
- Documents, forms, and knowledge base management
- Contracts and vendors workspaces
- Notifications, audit feed, archive center, trash bin, roles, and settings
- English/Arabic localization with LTR/RTL support
- Light, dark, and system appearance modes

## Demo Accounts

| Role | Username | Password |
| --- | --- | --- |
| System Admin | `admin` | `admin123` |
| IT Manager | `manager` | `manager123` |
| IT Staff | `staff` | `staff123` |
| Employee | `employee` | `admin123` |

## Getting Started

```bash
npm install
npm start
```

By default, the app runs on:

```text
http://localhost:4173
```

You can run on a custom port:

```powershell
$env:PORT='4206'; npm start
```

## Project Structure

```text
public/        Frontend application files
data/db.json   Demo data store
docs/          Product, UX, and QA documentation
server.js      Node.js HTTP server and API
package.json   Runtime scripts
```

## Validation

Run syntax checks before release:

```bash
node --check public/app.js
node --check server.js
```

## Notes

This repository contains the V1 prototype/demo implementation. Preserve RBAC, workflow behavior, audit, timeline, notifications, and demo data integrity when making future changes.
