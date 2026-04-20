# Phase 2: Core Content Management

**Duration**: 1.5 weeks
**Goal**: Build admin interfaces for bio, social links, skills, experience, and projects

---

## Task 2.1: Admin UI Components Library

**Estimated time**: 4 hours
**Dependencies**: Phase 1 complete

### Subtasks

- [ ] **2.1.1** Create `src/app/admin/components/ui/button.tsx`
- [ ] **2.1.2** Create `src/app/admin/components/ui/input.tsx`
- [ ] **2.1.3** Create `src/app/admin/components/ui/textarea.tsx`
- [ ] **2.1.4** Create `src/app/admin/components/ui/select.tsx`
- [ ] **2.1.5** Create `src/app/admin/components/ui/label.tsx`
- [ ] **2.1.6** Create `src/app/admin/components/ui/card.tsx`
- [ ] **2.1.7** Create `src/app/admin/components/ui/toast.tsx` (or use native)
- [ ] **2.1.8** Create `src/app/admin/components/ui/modal.tsx`
- [ ] **2.1.9** Create `src/app/admin/components/ui/confirm-dialog.tsx`
- [ ] **2.1.10** Create `src/app/admin/components/form-field.tsx` wrapper

### Technical notes

```typescript
// src/app/admin/components/ui/input.tsx
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-bg border border-border rounded-md
            text-fg placeholder:text-fg-subtle
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : ""}
            ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
```

### Acceptance criteria

- All components follow minimal, developer-focused aesthetic
- Components are accessible (proper ARIA, focus states)
- Error states handled consistently
- Dark mode compatible (using CSS variables)

---

## Task 2.2: Bio Management Page

**Estimated time**: 4 hours
**Dependencies**: 2.1

### Subtasks

- [ ] **2.2.1** Create `src/app/admin/bio/page.tsx`
- [ ] **2.2.2** Create bio edit form with all fields
- [ ] **2.2.3** Create `src/app/admin/bio/actions.ts` server action
- [ ] **2.2.4** Add Zod validation schema for bio
- [ ] **2.2.5** Implement profile photo upload (placeholder for now)
- [ ] **2.2.6** Add availability status dropdown
- [ ] **2.2.7** Add success/error toast notifications
- [ ] **2.2.8** Test form submission and data persistence

### Technical notes

```typescript
// src/app/admin/bio/actions.ts
"use server";

import { z } from "zod";
import { updateBio } from "@/db/queries";
import { revalidatePath } from "next/cache";

const bioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().optional(),
  shortBio: z.string().optional(),
  longBio: z.string().optional(),
  availability: z.enum(["open", "not_available", "freelance"]),
});

export async function saveBio(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = bioSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await updateBio(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/bio");

  return { success: true };
}
```

### Acceptance criteria

- Form displays current bio data on load
- All fields validate correctly
- Save button triggers server action
- Success toast shown after save
- Changes visible on public site immediately
- Form shows inline validation errors

---

## Task 2.3: Social Links Management Page

**Estimated time**: 5 hours
**Dependencies**: 2.1

### Subtasks

- [ ] **2.3.1** Create `src/app/admin/social/page.tsx`
- [ ] **2.3.2** Create social links list component with drag handles
- [ ] **2.3.3** Create add/edit social link modal
- [ ] **2.3.4** Create `src/app/admin/social/actions.ts` server actions
- [ ] **2.3.5** Implement icon selector (GitHub, LinkedIn, Email, X, custom)
- [ ] **2.3.6** Implement drag-and-drop reordering
- [ ] **2.3.7** Add delete with confirmation
- [ ] **2.3.8** Add Zod validation schema

### Technical notes

```typescript
// Drag and drop can use native HTML5 drag or a library
// For simplicity, start with move up/down buttons

// src/app/admin/social/actions.ts
"use server";

import { z } from "zod";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks
} from "@/db/queries";
import { revalidatePath } from "next/cache";

const socialLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().url("Must be a valid URL"),
  icon: z.enum(["github", "linkedin", "email", "x", "custom"]),
});

export async function addSocialLink(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = socialLinkSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await createSocialLink(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/social");

  return { success: true };
}

export async function moveSocialLink(id: number, direction: "up" | "down") {
  await reorderSocialLinks(id, direction);
  revalidatePath("/");
  revalidatePath("/admin/social");
}

export async function removeSocialLink(id: number) {
  await deleteSocialLink(id);
  revalidatePath("/");
  revalidatePath("/admin/social");

  return { success: true };
}
```

### Acceptance criteria

- List shows all social links with icon, label, URL
- Add button opens modal with form
- Edit button opens modal with pre-filled form
- Delete button shows confirmation, then removes
- Up/down buttons reorder items
- Changes reflect on public site

---

## Task 2.4: Skills Management Page

**Estimated time**: 6 hours
**Dependencies**: 2.1

### Subtasks

- [ ] **2.4.1** Create `src/app/admin/skills/page.tsx`
- [ ] **2.4.2** Create skill categories list component
- [ ] **2.4.3** Create skills within category list (nested)
- [ ] **2.4.4** Create add/edit category modal
- [ ] **2.4.5** Create add/edit skill modal
- [ ] **2.4.6** Create `src/app/admin/skills/actions.ts` server actions
- [ ] **2.4.7** Implement category reordering
- [ ] **2.4.8** Implement skill reordering within category
- [ ] **2.4.9** Add delete with cascade warning for categories
- [ ] **2.4.10** Optional: Add proficiency level selector

### Technical notes

```typescript
// Two-level structure: categories contain skills
// UI: Accordion or expandable cards per category

// src/app/admin/skills/page.tsx
export default async function SkillsPage() {
  const categories = await getSkillCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <AddCategoryButton />
      </div>

      {categories.map((category) => (
        <CategoryCard key={category.id} category={category}>
          <SkillsList skills={category.skills} categoryId={category.id} />
        </CategoryCard>
      ))}
    </div>
  );
}
```

### Acceptance criteria

- Categories displayed with expandable skill lists
- Add category creates new category at end
- Add skill to category works
- Edit category/skill inline or via modal
- Delete category warns if skills exist
- Reordering works for both levels
- Changes reflect on public site

---

## Task 2.5: Experience Management Page

**Estimated time**: 6 hours
**Dependencies**: 2.1

### Subtasks

- [ ] **2.5.1** Create `src/app/admin/experience/page.tsx`
- [ ] **2.5.2** Create experience list component with cards
- [ ] **2.5.3** Create `src/app/admin/experience/new/page.tsx` add form
- [ ] **2.5.4** Create `src/app/admin/experience/[id]/page.tsx` edit form
- [ ] **2.5.5** Create `src/app/admin/experience/actions.ts` server actions
- [ ] **2.5.6** Implement date pickers for start/end dates
- [ ] **2.5.7** Implement "I currently work here" checkbox
- [ ] **2.5.8** Implement highlights editor (dynamic list of inputs)
- [ ] **2.5.9** Add company logo upload (placeholder)
- [ ] **2.5.10** Implement reordering
- [ ] **2.5.11** Add delete with confirmation

### Technical notes

```typescript
// Experience form with dynamic highlights
// src/app/admin/experience/components/highlights-editor.tsx
"use client";

import { useState } from "react";
import { Input } from "@/app/admin/components/ui/input";
import { Button } from "@/app/admin/components/ui/button";

interface HighlightsEditorProps {
  initial: string[];
  name: string;
}

export function HighlightsEditor({ initial, name }: HighlightsEditorProps) {
  const [highlights, setHighlights] = useState(initial);

  const addHighlight = () => setHighlights([...highlights, ""]);
  const removeHighlight = (index: number) =>
    setHighlights(highlights.filter((_, i) => i !== index));
  const updateHighlight = (index: number, value: string) =>
    setHighlights(highlights.map((h, i) => (i === index ? value : h)));

  return (
    <div className="space-y-2">
      {highlights.map((highlight, index) => (
        <div key={index} className="flex gap-2">
          <Input
            name={`${name}[${index}]`}
            value={highlight}
            onChange={(e) => updateHighlight(index, e.target.value)}
            placeholder="Achievement or responsibility..."
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeHighlight(index)}
          >
            ×
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addHighlight}>
        + Add highlight
      </Button>
    </div>
  );
}
```

### Acceptance criteria

- List shows all experiences in order
- Add form creates new experience
- Edit form updates existing experience
- "Currently work here" sets end date to null
- Highlights can be added/removed/reordered
- Delete with confirmation
- Reorder via drag or up/down buttons
- Changes reflect on public site

---

## Task 2.6: Projects Management Page

**Estimated time**: 6 hours
**Dependencies**: 2.1

### Subtasks

- [ ] **2.6.1** Create `src/app/admin/projects/page.tsx`
- [ ] **2.6.2** Create projects grid/list component
- [ ] **2.6.3** Create `src/app/admin/projects/new/page.tsx` add form
- [ ] **2.6.4** Create `src/app/admin/projects/[id]/page.tsx` edit form
- [ ] **2.6.5** Create `src/app/admin/projects/actions.ts` server actions
- [ ] **2.6.6** Implement tech stack tag input
- [ ] **2.6.7** Implement slug auto-generation from title
- [ ] **2.6.8** Implement featured toggle
- [ ] **2.6.9** Add project thumbnail upload (placeholder)
- [ ] **2.6.10** Implement reordering
- [ ] **2.6.11** Add delete with confirmation
- [ ] **2.6.12** Add filter by featured status

### Technical notes

```typescript
// Tech stack tag input component
// src/app/admin/projects/components/tech-input.tsx
"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/app/admin/components/ui/input";

interface TechInputProps {
  initial: string[];
  name: string;
}

export function TechInput({ initial, name }: TechInputProps) {
  const [tags, setTags] = useState(initial);
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-accent/10 text-accent rounded text-sm flex items-center gap-1"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add..."
      />
    </div>
  );
}
```

### Acceptance criteria

- List/grid shows all projects
- Featured projects marked visually
- Add form with slug auto-generation
- Edit form with all fields
- Tech stack as tags (add/remove)
- Featured toggle updates immediately
- Delete with confirmation
- Reordering works
- Filter toggle for featured only
- Changes reflect on public site

---

## Task 2.7: Dashboard with Content Overview

**Estimated time**: 3 hours
**Dependencies**: 2.2-2.6

### Subtasks

- [ ] **2.7.1** Update `src/app/admin/page.tsx` dashboard
- [ ] **2.7.2** Add count cards for each content type
- [ ] **2.7.3** Add "last updated" timestamps
- [ ] **2.7.4** Add quick action buttons (Add new, View all)
- [ ] **2.7.5** Add recent activity list (optional)

### Technical notes

```typescript
// src/app/admin/page.tsx
import {
  getBio,
  countSocialLinks,
  countSkillCategories,
  countExperiences,
  countProjects
} from "@/db/queries";

export default async function AdminDashboard() {
  const [bio, socialCount, skillsCount, expCount, projectsCount] = await Promise.all([
    getBio(),
    countSocialLinks(),
    countSkillCategories(),
    countExperiences(),
    countProjects(),
  ]);

  const cards = [
    { label: "Social Links", count: socialCount, href: "/admin/social" },
    { label: "Skill Categories", count: skillsCount, href: "/admin/skills" },
    { label: "Experiences", count: expCount, href: "/admin/experience" },
    { label: "Projects", count: projectsCount, href: "/admin/projects" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Bio summary card */}
      <div className="p-4 border border-border rounded-lg">
        <h2 className="font-medium mb-2">Bio</h2>
        <p className="text-fg-muted">{bio?.name} — {bio?.title}</p>
        <a href="/admin/bio" className="text-accent text-sm">Edit →</a>
      </div>

      {/* Count cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="p-4 border border-border rounded-lg hover:border-accent transition-colors"
          >
            <p className="text-3xl font-semibold">{card.count}</p>
            <p className="text-fg-muted text-sm">{card.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
```

### Acceptance criteria

- Dashboard shows counts for all content types
- Cards link to respective management pages
- Bio summary with edit link
- Clean, scannable layout

---

## Phase 2 Checklist

- [ ] Admin UI component library complete
- [ ] Bio management working
- [ ] Social links CRUD + reordering working
- [ ] Skills categories + skills CRUD working
- [ ] Experience CRUD + reordering working
- [ ] Projects CRUD + reordering working
- [ ] Dashboard showing content overview

**Phase 2 complete when**: Admin can fully manage bio, social links, skills, experience, and projects through the admin panel, and all changes reflect on the public site.
