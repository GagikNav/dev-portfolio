import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bio } from "@/db/schema";

export async function getBio() {
  const result = await db.select().from(bio).limit(1);
  return result[0] ?? null;
}

export async function updateBio(data: Partial<typeof bio.$inferInsert>) {
  const existing = await getBio();
  if (existing) {
    return db
      .update(bio)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bio.id, existing.id));
  }
  return db
    .insert(bio)
    .values({ ...data, updatedAt: new Date() } as typeof bio.$inferInsert);
}
