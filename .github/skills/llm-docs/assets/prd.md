---
title: "{{TITLE}}"
type: prd
status: Draft
date: {{YYYY-MM-DD}}
owner: "{{OWNER}}"
---

## Problem Statement

{{2–3 sentences. What user pain or business gap this addresses. Who experiences it and how often.}}

## Goals

- {{Goal 1 — measurable where possible}}
- {{Goal 2}}
- {{Goal 3}}

## Non-Goals

- {{Explicitly out of scope}}
- {{Explicitly out of scope}}

## User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|-----------|
| US-1 | {{role}} | {{action}} | {{benefit}} |
| US-2 | {{role}} | {{action}} | {{benefit}} |
| US-3 | {{role}} | {{action}} | {{benefit}} |

## Functional Requirements

| # | Requirement | Priority | Linked Story |
|---|------------|----------|--------------|
| FR-1 | {{Requirement — specific, testable}} | Must / Should / Could | US-{{n}} |
| FR-2 | {{Requirement}} | Must / Should / Could | US-{{n}} |
| FR-3 | {{Requirement}} | Must / Should / Could | US-{{n}} |

## Non-Functional Requirements

| # | Requirement | Target |
|---|------------|--------|
| NFR-1 | Performance | {{e.g. page load < 2s on 4G}} |
| NFR-2 | Accessibility | {{e.g. WCAG 2.1 AA}} |
| NFR-3 | Security | {{e.g. no PII in logs}} |

## Success Metrics

| Metric | Baseline | Target | Measurement method |
|--------|---------|--------|-------------------|
| {{Metric 1}} | {{current value or "unknown"}} | {{goal value}} | {{how to measure}} |
| {{Metric 2}} | {{current value or "unknown"}} | {{goal value}} | {{how to measure}} |

## Documentation

| # | Type | Audience | Description | Owner |
|---|------|----------|-------------|-------|
| D-1 | API reference | Developers | {{e.g. REST endpoints, request/response schemas}} | {{owner}} |
| D-2 | User guide | End users | {{e.g. step-by-step walkthrough of the feature}} | {{owner}} |
| D-3 | Developer guide | Contributors | {{e.g. local setup, architecture overview, contribution notes}} | {{owner}} |
| D-4 | Runbook | Ops / on-call | {{e.g. deployment steps, rollback procedure, alert responses}} | {{owner}} |
| D-5 | Changelog entry | All | {{e.g. public-facing release note summarising changes}} | {{owner}} |

> Remove rows that do not apply. Add rows for any additional doc types (e.g. data dictionary, migration guide, ADR, RFC).

## Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | {{Question}} | {{owner}} | {{date or "—"}} |
