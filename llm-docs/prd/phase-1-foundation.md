# Phase 1: Foundation

**Duration**: 1 week
**Goal**: Set up database infrastructure, authentication, and migrate existing data

---

## Task 1.1: Database Schema Design

**Estimated time**: 4 hours
**Dependencies**: None

### Subtasks

- [ ] **1.1.1** Create `src/db/schema.ts` with Drizzle ORM table definitions
- [ ] **1.1.2** Define `bio` table (single row, site-wide settings)
- [ ] **1.1.3** Define `socialLinks` table with icon enum and ordering
- [ ] **1.1.4** Define `skillCategories` table with ordering
- [ ] **1.1.5** Define `skills` table with foreign key to categories
- [ ] **1.1.6** Define `experiences` table with highlights as JSON array
- [ ] **1.1.7** Define `projects` table with tech stack as JSON array
- [ ] **1.1.8** Define `education` table
- [ ] **1.1.9** Define `certifications` table
- [ ] **1.1.10** Define `hobbies` table with category enum
- [ ] **1.1.11** Define `testimonials` table with draft/published status
- [ ] **1.1.12** Define `blogPosts` table with markdown content
- [ ] **1.1.13** Define `media` table for asset tracking
- [ ] **1.1.14** Define `settings` table for site metadata

### Technical notes

```typescript
// Example schema structure for src/db/schema.ts
import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

export const bio = sqliteTable("bio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  shortBio: text("short_bio"),
  longBio: text("long_bio"),
  avatarUrl: text("avatar_url"),
  availability: text("availability", {
    enum: ["open", "not_available", "freelance"]
  }).default("open"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon", {
    enum: ["github", "linkedin", "email", "x", "custom"]
  }).notNull(),
  order: integer("order").notNull().default(0),
});

// ... additional tables
```

### Acceptance criteria

- All tables have proper primary keys and foreign key relationships
- Ordering columns exist on all list-type tables
- Timestamps (createdAt, updatedAt) on relevant tables
- Schema compiles without TypeScript errors

---

## Task 1.2: Drizzle Configuration

**Estimated time**: 2 hours
**Dependencies**: 1.1

### Subtasks

- [ ] **1.2.1** Create `drizzle.config.ts` for migrations
- [ ] **1.2.2** Create `src/db/index.ts` database client singleton
- [ ] **1.2.3** Add database URL to `.env.local` and `.env.example`
- [ ] **1.2.4** Generate initial migration with `bunx drizzle-kit generate`
- [ ] **1.2.5** Apply migration with `bunx drizzle-kit migrate`
- [ ] **1.2.6** Add db scripts to `package.json`

### Technical notes

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:local-db",
  },
});
```

```json
// package.json scripts
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

### Acceptance criteria

- `bun run db:generate` creates migration files
- `bun run db:migrate` applies migrations to SQLite
- `bun run db:studio` opens Drizzle Studio for debugging
- Database file created at `local-db`

---

## Task 1.3: Data Access Layer

**Estimated time**: 3 hours
**Dependencies**: 1.2

### Subtasks

- [ ] **1.3.1** Create `src/db/queries/bio.ts` - getBio, updateBio
- [ ] **1.3.2** Create `src/db/queries/social.ts` - CRUD + reorder
- [ ] **1.3.3** Create `src/db/queries/skills.ts` - categories + skills CRUD
- [ ] **1.3.4** Create `src/db/queries/experience.ts` - CRUD + reorder
- [ ] **1.3.5** Create `src/db/queries/projects.ts` - CRUD + reorder
- [ ] **1.3.6** Create `src/db/queries/education.ts` - CRUD
- [ ] **1.3.7** Create `src/db/queries/certifications.ts` - CRUD
- [ ] **1.3.8** Create `src/db/queries/hobbies.ts` - CRUD
- [ ] **1.3.9** Create `src/db/queries/testimonials.ts` - CRUD + publish
- [ ] **1.3.10** Create `src/db/queries/blog.ts` - CRUD + publish
- [ ] **1.3.11** Create `src/db/queries/media.ts` - CRUD
- [ ] **1.3.12** Create barrel export `src/db/queries/index.ts`

### Technical notes

```typescript
// src/db/queries/bio.ts
import { db } from "@/db";
import { bio } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getBio() {
  const result = await db.select().from(bio).limit(1);
  return result[0] ?? null;
}

export async function updateBio(data: Partial<typeof bio.$inferInsert>) {
  const existing = await getBio();
  if (existing) {
    return db.update(bio).set({ ...data, updatedAt: new Date() }).where(eq(bio.id, existing.id));
  }
  return db.insert(bio).values({ ...data, updatedAt: new Date() });
}
```

### Acceptance criteria

- All query functions are type-safe with Drizzle inference
- Reorder functions update order column atomically
- Queries handle empty results gracefully

---

## Task 1.4: Authentication System

**Estimated time**: 4 hours
**Dependencies**: None (can parallel with 1.1-1.3)

### Subtasks

- [ ] **1.4.1** Add `ADMIN_PASSWORD` to `.env.local` and `.env.example`
- [ ] **1.4.2** Create `src/lib/auth.ts` with password verification and session utilities
- [ ] **1.4.3** Create `src/app/admin/login/page.tsx` login form
- [ ] **1.4.4** Create `src/app/admin/login/actions.ts` server action for login
- [ ] **1.4.5** Create `src/middleware.ts` to protect `/admin/*` routes
- [ ] **1.4.6** Create logout server action
- [ ] **1.4.7** Add session cookie with 7-day expiry

### Technical notes

```typescript
// src/lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function verifyPassword(password: string): Promise<boolean> {
  return password === process.env.ADMIN_PASSWORD;
}

export async function createSession() {
  const token = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
  });
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
}
```

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
```

### Acceptance criteria

- `/admin` redirects to `/admin/login` without session
- Correct password sets cookie and redirects to `/admin`
- Incorrect password shows error, no redirect
- `/admin/login` redirects to `/admin` if already authenticated
- Logout clears cookie and redirects to login

---

## Task 1.5: Admin Layout and Navigation

**Estimated time**: 3 hours
**Dependencies**: 1.4

### Subtasks

- [ ] **1.5.1** Create `src/app/admin/layout.tsx` with sidebar navigation
- [ ] **1.5.2** Create `src/app/admin/components/sidebar.tsx`
- [ ] **1.5.3** Create `src/app/admin/components/header.tsx` with logout button
- [ ] **1.5.4** Define admin navigation items (Dashboard, Bio, Social, Skills, etc.)
- [ ] **1.5.5** Add active state styling for current route
- [ ] **1.5.6** Create `src/app/admin/page.tsx` dashboard placeholder

### Technical notes

```typescript
// Navigation items
const navItems = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Bio", href: "/admin/bio", icon: "user" },
  { label: "Social Links", href: "/admin/social", icon: "link" },
  { label: "Skills", href: "/admin/skills", icon: "code" },
  { label: "Experience", href: "/admin/experience", icon: "briefcase" },
  { label: "Projects", href: "/admin/projects", icon: "folder" },
  { label: "Education", href: "/admin/education", icon: "graduation" },
  { label: "Certifications", href: "/admin/certifications", icon: "award" },
  { label: "Hobbies", href: "/admin/hobbies", icon: "heart" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "quote" },
  { label: "Blog", href: "/admin/blog", icon: "edit" },
  { label: "Media", href: "/admin/media", icon: "image" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
```

### Acceptance criteria

- Sidebar visible on all admin pages
- Current page highlighted in navigation
- Logout button in header
- Responsive layout (sidebar collapses on mobile)
- Consistent styling with minimal developer aesthetic

---

## Task 1.6: Data Migration Script

**Estimated time**: 2 hours
**Dependencies**: 1.2, 1.3

### Subtasks

- [ ] **1.6.1** Create `scripts/migrate-data.ts`
- [ ] **1.6.2** Import data from `src/app/lib/data.ts`
- [ ] **1.6.3** Transform and insert bio data
- [ ] **1.6.4** Transform and insert social links with ordering
- [ ] **1.6.5** Transform and insert skill categories and skills
- [ ] **1.6.6** Transform and insert experiences
- [ ] **1.6.7** Transform and insert projects
- [ ] **1.6.8** Add `db:seed` script to package.json
- [ ] **1.6.9** Make script idempotent (safe to run multiple times)

### Technical notes

```typescript
// scripts/migrate-data.ts
import { db } from "@/db";
import { bio, socialLinks, skillCategories, skills, experiences, projects } from "@/db/schema";
import * as legacyData from "@/app/lib/data";

async function migrate() {
  console.log("Starting data migration...");

  // Clear existing data (for idempotency)
  await db.delete(skills);
  await db.delete(skillCategories);
  await db.delete(socialLinks);
  await db.delete(experiences);
  await db.delete(projects);
  await db.delete(bio);

  // Migrate bio
  await db.insert(bio).values({
    name: legacyData.bio.name,
    title: legacyData.bio.title,
    tagline: legacyData.bio.tagline,
    shortBio: legacyData.bio.shortBio,
    longBio: legacyData.bio.longBio,
    availability: "open",
    updatedAt: new Date(),
  });

  // Migrate social links
  for (let i = 0; i < legacyData.social.length; i++) {
    const s = legacyData.social[i];
    await db.insert(socialLinks).values({
      label: s.label,
      href: s.href,
      icon: s.icon,
      order: i,
    });
  }

  // ... continue for other data types

  console.log("Migration complete!");
}

migrate().catch(console.error);
```

### Acceptance criteria

- Script runs without errors: `bun run db:seed`
- All existing hardcoded data appears in database
- Ordering preserved for lists
- Script can run multiple times safely

---

## Task 1.7: Update Public Pages to Use Database

**Estimated time**: 3 hours
**Dependencies**: 1.3, 1.6

### Subtasks

- [ ] **1.7.1** Update `src/app/page.tsx` to fetch from database
- [ ] **1.7.2** Update `src/app/lib/data.ts` to export database queries instead of static data
- [ ] **1.7.3** Add revalidation strategy (on-demand or time-based)
- [ ] **1.7.4** Test all public sections render correctly
- [ ] **1.7.5** Verify build works with database dependency

### Technical notes

```typescript
// Option A: Update data.ts to fetch from DB
// src/app/lib/data.ts
import { getBio, getSocialLinks, getSkills, getExperiences, getProjects } from "@/db/queries";

// Re-export types
export type { Bio, SocialLink, SkillGroup, Experience, Project } from "@/db/schema";

// Export async getters
export { getBio, getSocialLinks, getSkills, getExperiences, getProjects };

// Option B: Keep types, add getData function
export async function getPortfolioData() {
  const [bio, social, skills, experience, projects] = await Promise.all([
    getBio(),
    getSocialLinks(),
    getSkills(),
    getExperiences(),
    getProjects(),
  ]);
  return { bio, social, skills, experience, projects };
}
```

### Acceptance criteria

- Public homepage renders with database data
- No TypeScript errors
- Page load time not significantly impacted
- Build succeeds in production mode

---

## Phase 1 Checklist

- [ ] Database schema designed and migrated
- [ ] Drizzle configured with scripts
- [ ] Data access layer complete
- [ ] Authentication working (login/logout)
- [ ] Admin layout with navigation
- [ ] Legacy data migrated to database
- [ ] Public pages using database

**Phase 1 complete when**: Admin can log in, see the dashboard, and public site displays migrated data from the database.
