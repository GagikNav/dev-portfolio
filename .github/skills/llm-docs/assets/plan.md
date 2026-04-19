---
title: "{{TITLE}}"
type: plan
status: Draft
date: {{YYYY-MM-DD}}
author: "{{AUTHOR}}"
---

## Goal

{{One or two sentences. What will exist or work when this plan is complete that does not today.}}

## Constraints

- {{Constraint 1 — time, budget, tech, team size, etc.}}
- {{Constraint 2}}

## Out of Scope

- {{Thing explicitly not addressed}}
- {{Thing explicitly not addressed}}

## Phase Diagram

```mermaid
flowchart TD
  P1[Phase 1: {{name}}] --> P2[Phase 2: {{name}}]
  P2 --> P3[Phase 3: {{name}}]
```

## Phases

### Phase 1: {{Name}}

**Goal**: {{What this phase achieves.}}
**Dependencies**: none

| # | Step | Owner | Output |
|---|------|-------|--------|
| 1.1 | {{Step description}} | {{owner}} | {{artifact or state change}} |
| 1.2 | {{Step description}} | {{owner}} | {{artifact or state change}} |

### Phase 2: {{Name}}

**Goal**: {{What this phase achieves.}}
**Dependencies**: Phase 1 complete

| # | Step | Owner | Output |
|---|------|-------|--------|
| 2.1 | {{Step description}} | {{owner}} | {{artifact or state change}} |

### Phase 3: {{Name}}

**Goal**: {{What this phase achieves.}}
**Dependencies**: Phase 2 complete

| # | Step | Owner | Output |
|---|------|-------|--------|
| 3.1 | {{Step description}} | {{owner}} | {{artifact or state change}} |

## Verification

- [ ] {{Acceptance criterion 1 — observable, testable}}
- [ ] {{Acceptance criterion 2}}
- [ ] {{Acceptance criterion 3}}

## Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | {{Question}} | {{owner}} | {{date or "—"}} |
