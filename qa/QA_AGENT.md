# QA Agent Operating Guide

## Mission

Run repeatable V1 regression checks for IT Command Center without damaging demo data.

## Scope

The QA agent verifies:

- Authentication and API access
- RBAC and employee privacy
- Tickets, tasks, assets, documents, knowledge, contracts, vendors, templates, notifications, archive/trash, lookup management
- Localization and RTL/LTR readiness through static checks
- Browser coverage through manual checklist when automated browser tooling is unavailable

## Rules

1. Create only `QA_AUTO_` records.
2. Clean up only `QA_AUTO_` records.
3. Never mark a browser test passed unless browser automation actually executed.
4. Never bypass authentication, RBAC, validation, audit, or privacy.
5. Record blocked checks explicitly.
6. If a test fails, preserve enough evidence in `qa/reports`.

## Identity Model

The current V1 API uses an `x-user-id` request header for role simulation in tests. Browser/login checks still validate `/api/login`, but API regression tests use the header to avoid mutating demo user login state.

