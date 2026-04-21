import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewTestimonial } from "@/db/schema";
import { testimonials } from "@/db/schema";

export async function getTestimonials() {
  return db.select().from(testimonials).orderBy(testimonials.order);
}

export async function getPublishedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "published"))
    .orderBy(testimonials.order);
}

export async function getTestimonialById(id: number) {
  const result = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createTestimonial(data: NewTestimonial) {
  const result = await db.insert(testimonials).values(data).returning();
  return result[0];
}

export async function updateTestimonial(
  id: number,
  data: Partial<NewTestimonial>,
) {
  const result = await db
    .update(testimonials)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteTestimonial(id: number) {
  return db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function publishTestimonial(id: number) {
  const result = await db
    .update(testimonials)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();
  return result[0] ?? null;
}

export async function unpublishTestimonial(id: number) {
  const result = await db
    .update(testimonials)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();
  return result[0] ?? null;
}

export async function reorderTestimonials(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(testimonials)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(testimonials.id, id)),
      ),
    );
  });
}
