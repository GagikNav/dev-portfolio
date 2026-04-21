import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewHobby } from "@/db/schema";
import { hobbies } from "@/db/schema";

export async function getHobbies() {
  return db.select().from(hobbies).orderBy(hobbies.order);
}

export async function getHobbyById(id: number) {
  const result = await db
    .select()
    .from(hobbies)
    .where(eq(hobbies.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createHobby(data: NewHobby) {
  const result = await db.insert(hobbies).values(data).returning();
  return result[0];
}

export async function updateHobby(id: number, data: Partial<NewHobby>) {
  const result = await db
    .update(hobbies)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(hobbies.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteHobby(id: number) {
  return db.delete(hobbies).where(eq(hobbies.id, id));
}
