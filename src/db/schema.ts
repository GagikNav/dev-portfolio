import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Current Unix timestamp in seconds, for SQLite default expressions. */
const now = sql`(strftime('%s', 'now'))`;

// ─── Bio ──────────────────────────────────────────────────────────────────────

/**
 * Single-row table storing the site owner's biographical information and
 * availability status.  Only one row should ever exist; the application
 * upserts against id = 1.
 */
export const bio = sqliteTable("bio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  shortBio: text("short_bio"),
  longBio: text("long_bio"),
  avatarUrl: text("avatar_url"),
  availability: text("availability", {
    enum: ["open", "not_available", "freelance"],
  })
    .notNull()
    .default("open"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Bio = typeof bio.$inferSelect;
export type NewBio = typeof bio.$inferInsert;

// ─── Social Links ─────────────────────────────────────────────────────────────

export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon", {
    enum: ["github", "linkedin", "email", "x", "custom"],
  }).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type SocialLink = typeof socialLinks.$inferSelect;
export type NewSocialLink = typeof socialLinks.$inferInsert;

// ─── Skill Categories ─────────────────────────────────────────────────────────

export const skillCategories = sqliteTable("skill_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export const skillCategoriesRelations = relations(
  skillCategories,
  ({ many }) => ({
    skills: many(skills),
  }),
);

export type SkillCategory = typeof skillCategories.$inferSelect;
export type NewSkillCategory = typeof skillCategories.$inferInsert;

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => skillCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  proficiency: text("proficiency", {
    enum: ["beginner", "intermediate", "expert"],
  }),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

// ─── Experiences ──────────────────────────────────────────────────────────────

/**
 * Work experience entries.  `highlights` is stored as a JSON-encoded string
 * array, e.g. `'["Led team of 5","Shipped feature X"]'`.
 */
export const experiences = sqliteTable("experiences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  company: text("company").notNull(),
  companyUrl: text("company_url"),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  /** JSON-encoded `string[]` */
  highlights: text("highlights", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Portfolio projects.  `techStack` is stored as a JSON-encoded string array.
 */
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  /** JSON-encoded `string[]` */
  techStack: text("tech_stack", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// ─── Education ────────────────────────────────────────────────────────────────

export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  location: text("location"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

// ─── Certifications ───────────────────────────────────────────────────────────

export const certifications = sqliteTable("certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  credentialUrl: text("credential_url"),
  credentialId: text("credential_id"),
  badgeUrl: text("badge_url"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;

// ─── Hobbies ──────────────────────────────────────────────────────────────────

export const hobbies = sqliteTable("hobbies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  category: text("category", {
    enum: ["sports", "creative", "tech", "travel", "other"],
  })
    .notNull()
    .default("other"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Hobby = typeof hobbies.$inferSelect;
export type NewHobby = typeof hobbies.$inferInsert;

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"),
  company: text("company"),
  quote: text("quote").notNull(),
  avatarUrl: text("avatar_url"),
  linkedinUrl: text("linkedin_url"),
  date: text("date"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  /** Full markdown content */
  content: text("content"),
  /** JSON-encoded `string[]` of tag names */
  tags: text("tags", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  featuredImageUrl: text("featured_image_url"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

// ─── Media ────────────────────────────────────────────────────────────────────

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  /** File size in bytes */
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(now),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

// ─── Settings ─────────────────────────────────────────────────────────────────

/**
 * Key/value store for site-wide metadata and configuration.
 * Keys are unique strings; values are plain text (cast to the appropriate
 * type in application code).
 */
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(now),
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
