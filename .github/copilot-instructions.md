# Copilot Instructions

## Branches & Issues

- Always create a descriptive branch name based on the issue or feature description.
- Branch names **must** start with the issue number, followed by a dash and a concise, kebab-case summary. Example: `123-fix-navbar-overlap`
- For feature work not tied to an issue, use a short, clear summary. Example: `feature-landing-page-redesign`
- Always reference the issue number in the branch name if one exists.

**Workflow:**
- When starting work on an issue, create a new branch from `main` using the naming convention above.
- Push your branch and open a pull request referencing the issue.

**Examples:**
- Issue #42: `42-add-contact-form`
- Issue #108: `108-fix-footer-links`

## Package Manager
- Use **Bun** exclusively. Never suggest `npm`, `npx`, `yarn`, or `pnpm`.
- Install deps: `bun add <pkg>` / `bun add -d <pkg>`
- Run scripts: `bun run <script>`
- Execute binaries: `bunx <bin>`

## Dev Commands
- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run lint` — lint with Biome
- `bun run format` — format with Biome

## Stack
- **Next.js 16** (App Router) — read `node_modules/next/dist/docs/` before writing Next.js code; APIs may differ from older versions
  - **This is NOT the Next.js you know**
    This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
- **React 19** with React Compiler enabled (`reactCompiler: true` in `next.config.ts`) — do NOT add `useMemo`/`useCallback` manually; the compiler handles memoization
- **TypeScript** strict mode
- **Tailwind CSS v4** — PostCSS-based, no `tailwind.config.js` needed
- **Biome 2** — linter and formatter; no ESLint, no Prettier

## Key Dependencies
- `resend` — transactional email
- `zod` v4 — runtime validation and schema definitions

## Project Structure
```
src/
  app/          # App Router pages and layouts (Next.js)
  components/   # Shared UI components
  lib/          # Utilities, data, and helpers
.github/
  instructions/ # Per-filetype Copilot instruction files
  skills/       # Copilot skill definitions
```

## Conventions
- Server Components by default; add `"use client"` only when needed
- Co-locate types with their usage; use Zod for external/boundary validation
- Biome enforces code style — match its formatting (2-space indent, double quotes disabled per biome.json)
- No `console.log` left in committed code
