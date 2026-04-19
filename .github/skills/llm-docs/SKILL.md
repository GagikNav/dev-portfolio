---
name: llm-docs
description: >
  Generate structured markdown files optimized for LLM consumption.
  Use when asked to: write a plan, create an implementation plan, draft a PRD,
  write a product requirements document, create a feature spec, document architecture,
  write a system design doc, create a technical spec, write an architecture document,
  create a document, write a spec, plan a feature, design a system,
  write documentation, create a README, write a runbook, write an API reference,
  write a user guide, write a developer guide, create a changelog, write a migration guide.
  Produces Plans, Architecture docs, PRDs, and Documentation files saved to docs/ folder.
argument-hint: "plan | architecture | prd | docs"
user-invocable: true
---

# LLM Docs Skill

Generates structured markdown documents (Plans, Architecture docs, PRDs, Documentation) optimized for LLM consumption — terse, flat, machine-parseable.

## Document Types

| Keyword(s) in request | Doc type | Template |
|---|---|---|
| plan, implementation plan, task breakdown, phases | Plan | [./assets/plan.md](./assets/plan.md) |
| architecture, system design, component design, technical design | Architecture | [./assets/architecture.md](./assets/architecture.md) |
| PRD, product requirements, feature spec, requirements document | PRD | [./assets/prd.md](./assets/prd.md) |
| documentation, README, runbook, API reference, user guide, developer guide, changelog, migration guide, how-to, guide | Documentation | [./assets/docs.md](./assets/docs.md) |

## Procedure

1. **Identify doc type** from the user's request using the table above. If ambiguous, ask one clarifying question.
2. **Gather codebase context** — use search tools to find relevant files, components, and existing docs in the workspace. Skip if the request is purely greenfield.
3. **Load the matching template** from `./assets/<type>.md`.
4. **Populate the template** using the LLM-optimization rules below. Do not leave placeholder sections blank — infer reasonable content from context or mark as `TODO` on a single line.
5. **Determine output filename**: `docs/<type>-<kebab-slug-from-title>.md` (e.g. `docs/plan-homepage-redesign.md`).
6. **Create `docs/` folder** at the project root if it does not exist.
7. **Save the file** using file creation tools.
8. **Report** the file path to the user.

## LLM-Optimization Rules

Apply these to all documents you produce:

- **No filler prose**: never write "In order to...", "It is worth noting that...", "This section describes...". Start every bullet with the actual content.
- **Flat structure**: prefer numbered lists and bullets over nested paragraphs. Max 2 levels of nesting.
- **Explicit H2 headers**: every section uses `##`. Never omit a template section — write `TODO` if genuinely unknown.
- **Dates**: ISO-8601 only (`YYYY-MM-DD`).
- **Status field**: always one of `Draft | Review | Approved | Deprecated`. Default to `Draft`.
- **Code symbols**: wrap in backticks (e.g. `UserService`, `auth/login`).
- **File paths**: use relative paths as markdown links (e.g. [src/app/page.tsx](../src/app/page.tsx)).
- **Decisions**: state the chosen option first, then rationale. Keep it to 2 sentences max.
- **Mermaid diagrams**: use `flowchart TD` for Plans and Architecture. Use `sequenceDiagram` for Architecture data-flow when appropriate. Always place diagrams in fenced code blocks labeled `mermaid`.
