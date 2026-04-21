import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewBlogPost } from "@/db/schema";
import { blogPosts } from "@/db/schema";

export async function getBlogPosts() {
  return db.select().from(blogPosts).orderBy(blogPosts.order);
}

export async function getPublishedBlogPosts() {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(blogPosts.order);
}

export async function getBlogPostById(id: number) {
  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getBlogPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function createBlogPost(data: NewBlogPost) {
  const result = await db.insert(blogPosts).values(data).returning();
  return result[0];
}

export async function updateBlogPost(id: number, data: Partial<NewBlogPost>) {
  const result = await db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteBlogPost(id: number) {
  return db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function publishBlogPost(id: number) {
  const result = await db
    .update(blogPosts)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
    .returning();
  return result[0] ?? null;
}

export async function unpublishBlogPost(id: number) {
  const result = await db
    .update(blogPosts)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return result[0] ?? null;
}

export async function reorderBlogPosts(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(blogPosts)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(blogPosts.id, id)),
      ),
    );
  });
}
