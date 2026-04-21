import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewEducation } from "@/db/schema";
import { education } from "@/db/schema";

export async function getEducation() {
  return db.select().from(education).orderBy(education.order);
}

export async function getEducationById(id: number) {
  const result = await db
    .select()
    .from(education)
    .where(eq(education.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createEducation(data: NewEducation) {
  const result = await db.insert(education).values(data).returning();
  return result[0];
}

export async function updateEducation(id: number, data: Partial<NewEducation>) {
  const result = await db
    .update(education)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(education.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteEducation(id: number) {
  return db.delete(education).where(eq(education.id, id));
}
