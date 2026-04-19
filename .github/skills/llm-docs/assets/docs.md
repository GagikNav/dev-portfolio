---
title: "{{TITLE}}"
type: docs
doc-kind: "{{README | runbook | api-reference | user-guide | developer-guide | changelog | migration-guide | how-to | other}}"
status: Draft
date: {{YYYY-MM-DD}}
author: "{{AUTHOR}}"
audience: "{{end-users | developers | contributors | ops | all}}"
---

## Purpose

{{One or two sentences. What this document explains, and why it exists.}}

## Scope

- **Covers**: {{what is included}}
- **Does not cover**: {{what is excluded — link to other docs if relevant}}
- **Prerequisite docs**: {{links or "none"}}

## Prerequisites

> Remove this section if not applicable.

- {{Tool / knowledge / access required before using this doc}}
- {{e.g. Node.js 20+, AWS access, familiarity with `{{Component}}`}}

## Overview

{{Short summary (3–5 bullets or a brief paragraph) of what the reader will learn or accomplish.}}

---

## {{Section 1: e.g. "Getting Started" / "Endpoints" / "Step-by-step"}}

{{Content for this section. Use numbered steps for procedures, tables for reference data, code blocks for commands/snippets.}}

```bash
# Example command
{{command}}
```

## {{Section 2}}

{{Content}}

## {{Section 3}}

{{Content}}

---

## Reference

> Use for quick-lookup tables (config options, flags, error codes, environment variables). Remove if not applicable.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `{{name}}` | `{{type}}` | `{{default}}` | {{description}} |

## Troubleshooting

> Common failure modes and fixes. Remove if not applicable.

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| {{Symptom}} | {{Cause}} | {{Fix or link}} |

## Related

- [{{Doc or file name}}]({{relative-path}}) — {{one-line description}}

## Changelog

| Date | Author | Change |
|------|--------|--------|
| {{YYYY-MM-DD}} | {{author}} | Initial draft |
