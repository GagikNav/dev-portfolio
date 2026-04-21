import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewExperience } from "@/db/schema";
import { experiences } from "@/db/schema";

export async function getExperiences() {
  return db.select().from(experiences).orderBy(experiences.order);
}

export async function getExperienceById(id: number) {
  const result = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createExperience(data: NewExperience) {
  const result = await db.insert(experiences).values(data).returning();
  return result[0];
}

export async function updateExperience(
  id: number,
  data: Partial<NewExperience>,
) {
  const result = await db
    .update(experiences)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(experiences.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteExperience(id: number) {
  return db.delete(experiences).where(eq(experiences.id, id));
}

export async function reorderExperiences(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(experiences)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(experiences.id, id)),
      ),
    );
  });
}
