import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  }).default("open"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: text("icon", {
    enum: ["github", "linkedin", "email", "x", "custom"],
  }).notNull(),
  order: integer("order").notNull().default(0),
});

export const skillCategories = sqliteTable("skill_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => skillCategories.id, { onDelete: "cascade" }),
  order: integer("order").notNull().default(0),
});

export const experiences = sqliteTable("experiences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  company: text("company").notNull(),
  companyUrl: text("company_url"),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  highlights: text("highlights", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  order: integer("order").notNull().default(0),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tech: text("tech", { mode: "json" }).$type<string[]>().notNull().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  description: text("description"),
  order: integer("order").notNull().default(0),
});

export const certifications = sqliteTable("certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  credentialUrl: text("credential_url"),
  order: integer("order").notNull().default(0),
});

export const hobbies = sqliteTable("hobbies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category", {
    enum: ["creative", "technical", "physical", "social", "other"],
  }).default("other"),
  order: integer("order").notNull().default(0),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  author: text("author").notNull(),
  role: text("role"),
  company: text("company"),
  avatarUrl: text("avatar_url"),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  altText: text("alt_text"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
