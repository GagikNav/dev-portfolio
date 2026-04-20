# Phase 3: Extended Content

**Duration**: 1 week
**Goal**: Build admin interfaces for education, certifications, hobbies, and testimonials

---

## Task 3.1: Education Management Page

**Estimated time**: 4 hours
**Dependencies**: Phase 2 complete

### Subtasks

- [ ] **3.1.1** Create `src/app/admin/education/page.tsx`
- [ ] **3.1.2** Create education list component
- [ ] **3.1.3** Create add/edit education form (modal or page)
- [ ] **3.1.4** Create `src/app/admin/education/actions.ts` server actions
- [ ] **3.1.5** Add Zod validation schema
- [ ] **3.1.6** Implement "In progress" checkbox (no end year)
- [ ] **3.1.7** Add description/notes field
- [ ] **3.1.8** Implement reordering
- [ ] **3.1.9** Add delete with confirmation

### Technical notes

```typescript
// src/db/schema.ts - education table
export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  degree: text("degree").notNull(),
  field: text("field"), // e.g., "Computer Science"
  institution: text("institution").notNull(),
  institutionUrl: text("institution_url"),
  location: text("location"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"), // null = in progress
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Zod schema
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  institutionUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  startYear: z.coerce.number().min(1900).max(2100),
  endYear: z.coerce.number().min(1900).max(2100).optional().nullable(),
  description: z.string().optional(),
});
```

### Acceptance criteria

- List shows all education entries
- Add/edit form with all fields
- "In progress" sets end year to null
- Delete with confirmation
- Reordering works
- Changes reflect on public site

---

## Task 3.2: Certifications Management Page

**Estimated time**: 4 hours
**Dependencies**: Phase 2 complete

### Subtasks

- [ ] **3.2.1** Create `src/app/admin/certifications/page.tsx`
- [ ] **3.2.2** Create certifications grid/list component
- [ ] **3.2.3** Create add/edit certification form
- [ ] **3.2.4** Create `src/app/admin/certifications/actions.ts` server actions
- [ ] **3.2.5** Add Zod validation schema
- [ ] **3.2.6** Implement expiry date handling (optional, with visual indicator)
- [ ] **3.2.7** Add badge image upload (placeholder)
- [ ] **3.2.8** Add credential URL field
- [ ] **3.2.9** Implement reordering
- [ ] **3.2.10** Add delete with confirmation

### Technical notes

```typescript
// src/db/schema.ts - certifications table
export const certifications = sqliteTable("certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issuerUrl: text("issuer_url"),
  issueDate: text("issue_date").notNull(), // "YYYY-MM"
  expiryDate: text("expiry_date"), // null = no expiry
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  badgeUrl: text("badge_url"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Helper to check if expired
export function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  const [year, month] = expiryDate.split("-").map(Number);
  const expiry = new Date(year, month - 1);
  return expiry < new Date();
}
```

### Acceptance criteria

- List shows all certifications with issuer and dates
- Expired certifications marked visually (strikethrough or badge)
- Add/edit form with all fields
- Credential URL opens in new tab
- Badge image displays if uploaded
- Delete with confirmation
- Reordering works
- Changes reflect on public site

---

## Task 3.3: Hobbies and Interests Management Page

**Estimated time**: 5 hours
**Dependencies**: Phase 2 complete

### Subtasks

- [ ] **3.3.1** Create `src/app/admin/hobbies/page.tsx`
- [ ] **3.3.2** Create hobbies grid component (card-based)
- [ ] **3.3.3** Create add/edit hobby form
- [ ] **3.3.4** Create `src/app/admin/hobbies/actions.ts` server actions
- [ ] **3.3.5** Add Zod validation schema
- [ ] **3.3.6** Implement category selector (Sports, Creative, Tech, Travel, Other)
- [ ] **3.3.7** Implement emoji/icon picker (simple input for now)
- [ ] **3.3.8** Add related links field (array of URLs)
- [ ] **3.3.9** Add cover image upload (placeholder)
- [ ] **3.3.10** Implement reordering
- [ ] **3.3.11** Add delete with confirmation

### Technical notes

```typescript
// src/db/schema.ts - hobbies table
export const hobbies = sqliteTable("hobbies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["sports", "creative", "tech", "travel", "other"],
  }).notNull().default("other"),
  emoji: text("emoji"), // e.g., "🎸", "⛷️"
  imageUrl: text("image_url"),
  relatedLinks: text("related_links", { mode: "json" }).$type<string[]>(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Category display names
const hobbyCategories = {
  sports: "Sports & Fitness",
  creative: "Creative & Arts",
  tech: "Tech & Gaming",
  travel: "Travel & Outdoors",
  other: "Other",
};
```

### Acceptance criteria

- Grid shows hobbies with emoji, name, category
- Filter by category (optional)
- Add/edit form with all fields
- Emoji input works (native or picker)
- Related links as editable list
- Delete with confirmation
- Reordering works
- Changes reflect on public site

---

## Task 3.4: Testimonials Management Page

**Estimated time**: 5 hours
**Dependencies**: Phase 2 complete

### Subtasks

- [ ] **3.4.1** Create `src/app/admin/testimonials/page.tsx`
- [ ] **3.4.2** Create testimonials list component
- [ ] **3.4.3** Create add/edit testimonial form
- [ ] **3.4.4** Create `src/app/admin/testimonials/actions.ts` server actions
- [ ] **3.4.5** Add Zod validation schema
- [ ] **3.4.6** Implement draft/published status toggle
- [ ] **3.4.7** Implement featured flag for homepage
- [ ] **3.4.8** Add avatar upload (placeholder)
- [ ] **3.4.9** Add LinkedIn profile URL field
- [ ] **3.4.10** Filter by status (draft/published)
- [ ] **3.4.11** Implement reordering
- [ ] **3.4.12** Add delete with confirmation

### Technical notes

```typescript
// src/db/schema.ts - testimonials table
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"), // e.g., "Senior Engineer"
  authorCompany: text("author_company"),
  authorAvatarUrl: text("author_avatar_url"),
  authorLinkedIn: text("author_linkedin"),
  quote: text("quote").notNull(),
  relationship: text("relationship"), // e.g., "Former Manager", "Colleague"
  date: text("date"), // "YYYY-MM"
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Query for public site - only published
export async function getPublishedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "published"))
    .orderBy(testimonials.order);
}

// Query for featured testimonials (homepage)
export async function getFeaturedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(
      and(
        eq(testimonials.status, "published"),
        eq(testimonials.featured, true)
      )
    )
    .orderBy(testimonials.order);
}
```

### Acceptance criteria

- List shows all testimonials with status badge
- Draft testimonials marked visually
- Featured flag toggle in list
- Add/edit form with all fields
- Publish/unpublish toggle
- Only published testimonials on public site
- Filter by status works
- Delete with confirmation
- Reordering works
- Changes reflect on public site

---

## Task 3.5: Update Public Site for New Sections

**Estimated time**: 4 hours
**Dependencies**: 3.1-3.4

### Subtasks

- [ ] **3.5.1** Add Education section to public homepage
- [ ] **3.5.2** Add Certifications section to public homepage
- [ ] **3.5.3** Add Hobbies/Interests section to public homepage
- [ ] **3.5.4** Add Testimonials section to public homepage
- [ ] **3.5.5** Update data queries to fetch new content types
- [ ] **3.5.6** Style new sections to match existing design
- [ ] **3.5.7** Handle empty states gracefully

### Technical notes

```typescript
// src/app/page.tsx - add new sections
import {
  getEducation,
  getCertifications,
  getHobbies,
  getFeaturedTestimonials
} from "@/db/queries";

export default async function Home() {
  const [education, certifications, hobbies, testimonials] = await Promise.all([
    getEducation(),
    getCertifications(),
    getHobbies(),
    getFeaturedTestimonials(),
  ]);

  return (
    <>
      {/* ... existing sections ... */}

      {education.length > 0 && (
        <SectionContainer id="education">
          <h2>Education</h2>
          {/* Education cards */}
        </SectionContainer>
      )}

      {certifications.length > 0 && (
        <SectionContainer id="certifications">
          <h2>Certifications</h2>
          {/* Certification badges */}
        </SectionContainer>
      )}

      {hobbies.length > 0 && (
        <SectionContainer id="hobbies">
          <h2>Beyond Code</h2>
          {/* Hobbies grid */}
        </SectionContainer>
      )}

      {testimonials.length > 0 && (
        <SectionContainer id="testimonials">
          <h2>What People Say</h2>
          {/* Testimonial cards */}
        </SectionContainer>
      )}
    </>
  );
}
```

### Acceptance criteria

- Education section displays if data exists
- Certifications section displays if data exists
- Hobbies section displays with personality
- Testimonials section shows featured quotes
- Sections hidden if no data (no empty states on public)
- Design consistent with existing sections

---

## Phase 3 Checklist

- [ ] Education CRUD working
- [ ] Certifications CRUD working
- [ ] Hobbies CRUD working
- [ ] Testimonials CRUD with draft/publish working
- [ ] Public site updated with new sections
- [ ] All new sections styled consistently

**Phase 3 complete when**: Admin can manage education, certifications, hobbies, and testimonials, and all published content displays on the public site.
