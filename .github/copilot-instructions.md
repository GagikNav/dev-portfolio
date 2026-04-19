# Copilot Instructions

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
