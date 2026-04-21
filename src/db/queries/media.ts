import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewMedia } from "@/db/schema";
import { media } from "@/db/schema";

export async function getMediaFiles() {
  return db.select().from(media).orderBy(media.createdAt);
}

export async function getMediaById(id: number) {
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createMedia(data: NewMedia) {
  const result = await db.insert(media).values(data).returning();
  return result[0];
}

export async function updateMedia(id: number, data: Partial<NewMedia>) {
  const result = await db
    .update(media)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(media.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteMedia(id: number) {
  return db.delete(media).where(eq(media.id, id));
}
