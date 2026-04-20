# Phase 5: Testing and Launch

**Duration**: 0.5 weeks
**Goal**: Ensure quality, optimize performance, document the system, and deploy

---

## Task 5.1: End-to-End Testing

**Estimated time**: 4 hours
**Dependencies**: Phases 1-4 complete

### Subtasks

- [ ] **5.1.1** Test authentication flow (login, logout, session expiry)
- [ ] **5.1.2** Test bio management (edit, save, verify on public)
- [ ] **5.1.3** Test social links CRUD and reordering
- [ ] **5.1.4** Test skills and categories CRUD
- [ ] **5.1.5** Test experience CRUD and reordering
- [ ] **5.1.6** Test projects CRUD, featured toggle, reordering
- [ ] **5.1.7** Test education CRUD
- [ ] **5.1.8** Test certifications CRUD
- [ ] **5.1.9** Test hobbies CRUD
- [ ] **5.1.10** Test testimonials CRUD, publish/draft toggle
- [ ] **5.1.11** Test blog posts CRUD, publish/draft toggle
- [ ] **5.1.12** Test media upload, browse, delete
- [ ] **5.1.13** Test settings save
- [ ] **5.1.14** Test keyboard shortcuts
- [ ] **5.1.15** Test responsive layout

### Testing checklist template

```markdown
## Test Case: [Feature Name]

**Preconditions:**
- Admin is logged in
- Database has seed data

**Steps:**
1. Navigate to /admin/[section]
2. Perform action X
3. Verify result Y

**Expected Result:**
- Data persisted correctly
- UI updated
- Public site reflects changes

**Actual Result:**
- [ ] Pass / [ ] Fail

**Notes:**
```

### Acceptance criteria

- All CRUD operations work correctly
- Reordering persists properly
- Public site updates after admin changes
- No console errors
- No broken layouts

---

## Task 5.2: Performance Optimization

**Estimated time**: 3 hours
**Dependencies**: 5.1

### Subtasks

- [ ] **5.2.1** Audit database queries (avoid N+1)
- [ ] **5.2.2** Add database indexes for common queries
- [ ] **5.2.3** Implement proper caching strategy with revalidation
- [ ] **5.2.4** Optimize image loading (Next.js Image, lazy load)
- [ ] **5.2.5** Audit bundle size, remove unused dependencies
- [ ] **5.2.6** Test Lighthouse scores (aim for 90+ performance)
- [ ] **5.2.7** Test admin page load times (< 1s goal)
- [ ] **5.2.8** Test public page load times (< 2s goal)

### Technical notes

```typescript
// Database indexes - add to schema
// src/db/schema.ts
export const socialLinks = sqliteTable("social_links", {
  // ... columns
}, (table) => ({
  orderIdx: index("social_links_order_idx").on(table.order),
}));

export const experiences = sqliteTable("experiences", {
  // ... columns
}, (table) => ({
  orderIdx: index("experiences_order_idx").on(table.order),
}));

// Caching strategy for public pages
// src/app/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

// Or use on-demand revalidation in server actions
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateBio(data) {
  await db.update(bio).set(data);
  revalidateTag("bio");
  revalidatePath("/");
}
```

### Acceptance criteria

- No N+1 queries in common paths
- Database indexes on order columns
- Public pages cached appropriately
- Images lazy loaded
- Lighthouse performance > 90
- Admin loads in < 1 second
- Public site loads in < 2 seconds

---

## Task 5.3: Security Review

**Estimated time**: 2 hours
**Dependencies**: Phases 1-4 complete

### Subtasks

- [ ] **5.3.1** Verify all admin routes protected by middleware
- [ ] **5.3.2** Verify server actions check authentication
- [ ] **5.3.3** Verify file upload validates type and size
- [ ] **5.3.4** Verify no sensitive data in client bundles
- [ ] **5.3.5** Verify CSRF protection (SameSite cookies)
- [ ] **5.3.6** Verify XSS protection (no dangerouslySetInnerHTML)
- [ ] **5.3.7** Verify SQL injection protection (parameterized queries)
- [ ] **5.3.8** Add rate limiting to upload endpoint (optional)

### Security checklist

```markdown
## Security Audit

### Authentication
- [ ] /admin/* routes redirect to login without session
- [ ] Session cookie is HTTP-only
- [ ] Session cookie has SameSite=Lax
- [ ] Password not logged or exposed

### Server Actions
- [ ] All mutations verify session before executing
- [ ] Zod validates all inputs
- [ ] Error messages don't leak sensitive info

### File Uploads
- [ ] Only allowed MIME types accepted
- [ ] File size limited to 10MB
- [ ] Filenames sanitized (UUID generation)
- [ ] Upload directory not executable

### Data Access
- [ ] All queries use Drizzle ORM (parameterized)
- [ ] No raw SQL with user input
- [ ] Draft content not accessible publicly
```

### Acceptance criteria

- All admin routes require authentication
- All server actions verify session
- File uploads properly validated
- No XSS vulnerabilities
- No SQL injection vectors
- Sensitive data not exposed

---

## Task 5.4: Documentation

**Estimated time**: 2 hours
**Dependencies**: 5.1-5.3

### Subtasks

- [ ] **5.4.1** Update README.md with CMS documentation
- [ ] **5.4.2** Document environment variables needed
- [ ] **5.4.3** Document database setup and migration commands
- [ ] **5.4.4** Document admin panel usage
- [ ] **5.4.5** Document deployment process
- [ ] **5.4.6** Add inline code comments for complex logic

### Documentation template

```markdown
# Portfolio CMS

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Set environment variables:
   - `DATABASE_URL` - SQLite database path
   - `ADMIN_PASSWORD` - Password for admin panel
4. Run migrations: `bun run db:migrate`
5. Seed data (optional): `bun run db:seed`
6. Start dev server: `bun run dev`
7. Access admin at http://localhost:3000/admin

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite connection string | Yes |
| `ADMIN_PASSWORD` | Admin panel password | Yes |

## Database Commands

- `bun run db:generate` - Generate migrations
- `bun run db:migrate` - Apply migrations
- `bun run db:studio` - Open Drizzle Studio
- `bun run db:seed` - Seed with initial data

## Admin Panel

Access the admin panel at `/admin`. Features:
- Bio management
- Social links
- Skills and categories
- Work experience
- Projects
- Education
- Certifications
- Hobbies
- Testimonials
- Blog posts
- Media library
- Site settings

## Deployment

1. Set environment variables in hosting platform
2. Run `bun run build`
3. Deploy to Vercel/Netlify/etc.
```

### Acceptance criteria

- README explains how to set up and run
- All environment variables documented
- Database commands documented
- Admin panel features documented
- Deployment process clear

---

## Task 5.5: Production Deployment

**Estimated time**: 2 hours
**Dependencies**: 5.1-5.4

### Subtasks

- [ ] **5.5.1** Configure production environment variables
- [ ] **5.5.2** Set up production database (LibSQL cloud or file)
- [ ] **5.5.3** Run production build locally to verify
- [ ] **5.5.4** Deploy to hosting platform (Vercel)
- [ ] **5.5.5** Test admin panel in production
- [ ] **5.5.6** Test public site in production
- [ ] **5.5.7** Set up monitoring/error tracking (optional)
- [ ] **5.5.8** Create backup strategy for database

### Deployment checklist

```markdown
## Pre-Deployment

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Build succeeds: `bun run build`
- [ ] Environment variables set in platform

## Deployment

- [ ] Push to main branch (triggers deploy)
- [ ] Or manual deploy via platform

## Post-Deployment

- [ ] Admin login works in production
- [ ] All admin CRUD operations work
- [ ] Public site displays content
- [ ] Images load correctly
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
```

### Acceptance criteria

- Site deployed to production URL
- Admin panel accessible and functional
- Public site displays all content
- Images and media served correctly
- No errors in production logs

---

## Task 5.6: Final Review and Handoff

**Estimated time**: 1 hour
**Dependencies**: 5.5

### Subtasks

- [ ] **5.6.1** Walk through all admin features
- [ ] **5.6.2** Verify all user stories completed
- [ ] **5.6.3** Note any known issues or limitations
- [ ] **5.6.4** Document future enhancement ideas
- [ ] **5.6.5** Archive PRD and task documents

### Final checklist

```markdown
## User Stories Verification

- [ ] GH-001: Admin authentication ✓
- [ ] GH-002: Admin logout ✓
- [ ] GH-003: View dashboard ✓
- [ ] GH-004: Edit bio information ✓
- [ ] GH-005: Manage social links ✓
- [ ] GH-006: Manage skill categories ✓
- [ ] GH-007: Manage skills within categories ✓
- [ ] GH-008: Add work experience ✓
- [ ] GH-009: Edit work experience ✓
- [ ] GH-010: Delete work experience ✓
- [ ] GH-011: Reorder work experience ✓
- [ ] GH-012: Add project ✓
- [ ] GH-013: Edit project ✓
- [ ] GH-014: Delete project ✓
- [ ] GH-015: Toggle project featured status ✓
- [ ] GH-016: Add education entry ✓
- [ ] GH-017: Manage certifications ✓
- [ ] GH-018: Add hobby or interest ✓
- [ ] GH-019: Manage testimonials ✓
- [ ] GH-020: Create blog post ✓
- [ ] GH-021: Edit blog post ✓
- [ ] GH-022: Upload media ✓
- [ ] GH-023: Browse media library ✓
- [ ] GH-024: Delete media ✓
- [ ] GH-025: Update site settings ✓
- [ ] GH-026: View public portfolio with CMS data ✓

## Known Limitations

- Authentication is password-only (upgrade to OAuth planned)
- Multi-language not supported (planned)
- Media stored locally (upgrade to cloud storage planned)
- No version history for content
- No scheduled publishing

## Future Enhancements

- OAuth authentication (GitHub, Google)
- Cloud media storage (Cloudflare R2, S3)
- Multi-language content support
- Content versioning and rollback
- Scheduled publishing for blog posts
- Analytics dashboard
- Contact form submissions management
- SEO tools and meta tag editor
```

### Acceptance criteria

- All 26 user stories verified complete
- Known limitations documented
- Future enhancements captured
- Documentation archived

---

## Phase 5 Checklist

- [ ] All features manually tested
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Security reviewed
- [ ] Documentation complete
- [ ] Production deployment successful
- [ ] Final review and signoff

**Phase 5 complete when**: CMS is deployed to production, fully tested, documented, and ready for daily use.

---

## Project Complete! 🎉

The Portfolio CMS is now ready for use. The admin can:
- Log in securely
- Manage all portfolio content
- Upload and organize media
- Write blog posts
- Update site settings
- See changes reflected immediately on the public site

Future iterations can add OAuth, cloud storage, multi-language support, and more.
