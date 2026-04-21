import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewSocialLink } from "@/db/schema";
import { socialLinks } from "@/db/schema";

export async function getSocialLinks() {
  return db.select().from(socialLinks).orderBy(socialLinks.order);
}

export async function getSocialLinkById(id: number) {
  const result = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createSocialLink(data: NewSocialLink) {
  const result = await db.insert(socialLinks).values(data).returning();
  return result[0];
}

export async function updateSocialLink(
  id: number,
  data: Partial<NewSocialLink>,
) {
  const result = await db
    .update(socialLinks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(socialLinks.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteSocialLink(id: number) {
  return db.delete(socialLinks).where(eq(socialLinks.id, id));
}

export async function reorderSocialLinks(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(socialLinks)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(socialLinks.id, id)),
      ),
    );
  });
}
