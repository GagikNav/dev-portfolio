import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewCertification } from "@/db/schema";
import { certifications } from "@/db/schema";

export async function getCertifications() {
  return db.select().from(certifications).orderBy(certifications.order);
}

export async function getCertificationById(id: number) {
  const result = await db
    .select()
    .from(certifications)
    .where(eq(certifications.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createCertification(data: NewCertification) {
  const result = await db.insert(certifications).values(data).returning();
  return result[0];
}

export async function updateCertification(
  id: number,
  data: Partial<NewCertification>,
) {
  const result = await db
    .update(certifications)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(certifications.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteCertification(id: number) {
  return db.delete(certifications).where(eq(certifications.id, id));
}
