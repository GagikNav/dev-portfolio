# Phase 4: Media Library and Polish

**Duration**: 1 week
**Goal**: Build media upload system, blog functionality, settings page, and UX improvements

---

## Task 4.1: Media Upload Infrastructure

**Estimated time**: 4 hours
**Dependencies**: Phase 1 complete

### Subtasks

- [ ] **4.1.1** Create `src/app/api/upload/route.ts` API endpoint
- [ ] **4.1.2** Create `public/uploads` directory with .gitkeep
- [ ] **4.1.3** Implement file validation (type, size limits)
- [ ] **4.1.4** Generate unique filenames (UUID + original extension)
- [ ] **4.1.5** Save file metadata to `media` table
- [ ] **4.1.6** Return upload result with URL
- [ ] **4.1.7** Add cleanup function for orphaned files

### Technical notes

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { db } from "@/db";
import { media } from "@/db/schema";
import { getSession } from "@/lib/auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  // Verify authentication
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large. Max size: ${MAX_SIZE / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filepath = join(uploadDir, filename);

  // Ensure upload directory exists
  await mkdir(uploadDir, { recursive: true });

  // Write file
  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  // Save metadata to database
  const url = `/uploads/${filename}`;
  await db.insert(media).values({
    filename: file.name,
    url,
    mimeType: file.type,
    size: file.size,
    createdAt: new Date(),
  });

  return NextResponse.json({ url, filename });
}
```

### Acceptance criteria

- Upload endpoint accepts multipart form data
- Only authenticated requests allowed
- File type validation (JPEG, PNG, GIF, WebP, MP4)
- File size validation (< 10MB)
- Unique filename generation
- File saved to `public/uploads`
- Metadata saved to database
- Returns URL for immediate use

---

## Task 4.2: Media Library Page

**Estimated time**: 5 hours
**Dependencies**: 4.1

### Subtasks

- [ ] **4.2.1** Create `src/app/admin/media/page.tsx`
- [ ] **4.2.2** Create media grid component with thumbnails
- [ ] **4.2.3** Create upload dropzone component
- [ ] **4.2.4** Create `src/app/admin/media/actions.ts` server actions
- [ ] **4.2.5** Implement upload progress indicator
- [ ] **4.2.6** Implement "Copy URL" button on each item
- [ ] **4.2.7** Implement media preview modal (full size)
- [ ] **4.2.8** Implement delete with usage warning
- [ ] **4.2.9** Add filter by file type
- [ ] **4.2.10** Add search by filename

### Technical notes

```typescript
// src/app/admin/media/components/upload-dropzone.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function UploadDropzone() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(((i + 1) / files.length) * 100);
    }
    setUploading(false);
    setProgress(0);
    router.refresh();
  }, [router]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center
        hover:border-accent transition-colors cursor-pointer"
    >
      {uploading ? (
        <div>
          <p>Uploading... {Math.round(progress)}%</p>
          <div className="w-full bg-border rounded h-2 mt-2">
            <div
              className="bg-accent h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-fg-muted">
          Drag and drop files here, or click to browse
        </p>
      )}
    </div>
  );
}
```

### Acceptance criteria

- Grid displays all uploaded media with thumbnails
- Drag-and-drop upload works
- File picker upload works
- Progress indicator during upload
- Click thumbnail to see full size
- "Copy URL" copies to clipboard
- Delete with confirmation
- Usage warning if media used in content
- Filter by type works
- Search by filename works

---

## Task 4.3: Media Picker Component

**Estimated time**: 3 hours
**Dependencies**: 4.2

### Subtasks

- [ ] **4.3.1** Create `src/app/admin/components/media-picker.tsx`
- [ ] **4.3.2** Implement as modal that opens from form fields
- [ ] **4.3.3** Show media grid with select functionality
- [ ] **4.3.4** Allow upload from within picker
- [ ] **4.3.5** Return selected URL to parent form
- [ ] **4.3.6** Support image preview in forms

### Technical notes

```typescript
// src/app/admin/components/media-picker.tsx
"use client";

import { useState } from "react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: "image" | "video" | "all";
}

export function MediaPicker({ value, onChange, accept = "image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Selected"
            className="w-32 h-32 object-cover rounded"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="absolute top-1 right-1"
          >
            ×
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Select Image
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Select Media">
        {/* Media grid with selection */}
        <MediaGrid
          filter={accept}
          onSelect={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
```

### Acceptance criteria

- Picker opens as modal from form field
- Shows filtered media (images/videos/all)
- Click to select, modal closes
- Upload available within picker
- Selected image preview in form
- Clear button removes selection

---

## Task 4.4: Integrate Media Picker into Forms

**Estimated time**: 2 hours
**Dependencies**: 4.3

### Subtasks

- [ ] **4.4.1** Update bio form with avatar picker
- [ ] **4.4.2** Update projects form with thumbnail picker
- [ ] **4.4.3** Update certifications form with badge picker
- [ ] **4.4.4** Update hobbies form with image picker
- [ ] **4.4.5** Update testimonials form with avatar picker

### Acceptance criteria

- All image fields use MediaPicker component
- Selected images save correctly
- Image URLs stored in database
- Images display on public site

---

## Task 4.5: Blog Posts Management Page

**Estimated time**: 6 hours
**Dependencies**: 4.3

### Subtasks

- [ ] **4.5.1** Create `src/app/admin/blog/page.tsx`
- [ ] **4.5.2** Create blog posts list component
- [ ] **4.5.3** Create `src/app/admin/blog/new/page.tsx` add form
- [ ] **4.5.4** Create `src/app/admin/blog/[id]/page.tsx` edit form
- [ ] **4.5.5** Create `src/app/admin/blog/actions.ts` server actions
- [ ] **4.5.6** Implement markdown editor with preview
- [ ] **4.5.7** Implement tag input component
- [ ] **4.5.8** Implement draft/published status
- [ ] **4.5.9** Calculate and display reading time
- [ ] **4.5.10** Add featured image with media picker
- [ ] **4.5.11** Implement slug auto-generation
- [ ] **4.5.12** Add delete with confirmation

### Technical notes

```typescript
// src/db/schema.ts - blog posts table
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // Markdown
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  featuredImageUrl: text("featured_image_url"),
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  readingTime: integer("reading_time"), // minutes
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Reading time calculation
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Markdown editor - use a simple textarea with preview
// Can upgrade to a rich editor later (e.g., Monaco, CodeMirror)
```

### Acceptance criteria

- List shows all blog posts with status
- Add form with markdown editor
- Live preview of markdown
- Tags as removable chips
- Reading time auto-calculated
- Draft/publish toggle
- Slug auto-generated from title
- Featured image selection
- Delete with confirmation
- Only published posts visible on public site (if blog section added)

---

## Task 4.6: Settings Page

**Estimated time**: 3 hours
**Dependencies**: 4.3

### Subtasks

- [ ] **4.6.1** Create `src/app/admin/settings/page.tsx`
- [ ] **4.6.2** Create settings form component
- [ ] **4.6.3** Create `src/app/admin/settings/actions.ts` server actions
- [ ] **4.6.4** Add site title and description fields
- [ ] **4.6.5** Add default OG image with media picker
- [ ] **4.6.6** Add contact email field
- [ ] **4.6.7** Add resume/CV PDF upload
- [ ] **4.6.8** Implement settings save

### Technical notes

```typescript
// src/db/schema.ts - settings table
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
});

// Settings keys
const SETTINGS_KEYS = {
  SITE_TITLE: "site_title",
  SITE_DESCRIPTION: "site_description",
  OG_IMAGE: "og_image",
  CONTACT_EMAIL: "contact_email",
  RESUME_URL: "resume_url",
};

// Helper to get all settings as object
export async function getAllSettings() {
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

// Helper to update settings
export async function updateSettings(data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value },
      });
  }
}
```

### Acceptance criteria

- Settings form with all fields
- OG image selection via media picker
- PDF upload for resume
- Save persists all settings
- Settings used in public site metadata
- Changes reflect immediately

---

## Task 4.7: UX Polish and Keyboard Shortcuts

**Estimated time**: 4 hours
**Dependencies**: 4.1-4.6

### Subtasks

- [ ] **4.7.1** Add toast notification system
- [ ] **4.7.2** Add unsaved changes warning on navigation
- [ ] **4.7.3** Add Cmd+S keyboard shortcut for save
- [ ] **4.7.4** Add loading states for all actions
- [ ] **4.7.5** Add empty state illustrations/messages
- [ ] **4.7.6** Add optimistic UI updates
- [ ] **4.7.7** Add error boundaries
- [ ] **4.7.8** Polish responsive design for tablet

### Technical notes

```typescript
// src/app/admin/components/keyboard-shortcuts.tsx
"use client";

import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        // Find and click the save button
        const saveButton = document.querySelector<HTMLButtonElement>(
          'button[data-save-button]'
        );
        saveButton?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}

// Unsaved changes hook
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
```

### Acceptance criteria

- Toast notifications for success/error
- Browser warning when leaving with unsaved changes
- Cmd+S triggers form save
- Loading spinners during async operations
- Empty states guide user to add content
- Optimistic updates for toggles (featured, publish)
- Error boundaries prevent full page crashes
- Admin usable on tablet devices

---

## Phase 4 Checklist

- [ ] Media upload API working
- [ ] Media library page complete
- [ ] Media picker integrated into forms
- [ ] Blog posts management working
- [ ] Settings page working
- [ ] Toast notifications working
- [ ] Keyboard shortcuts working
- [ ] Unsaved changes warning working
- [ ] Loading states throughout
- [ ] Empty states designed
- [ ] Responsive on tablet

**Phase 4 complete when**: Admin can upload and manage media, create blog posts, update site settings, and the UX is polished with keyboard shortcuts and feedback.
