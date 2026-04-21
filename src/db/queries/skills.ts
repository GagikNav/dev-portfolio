import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewSkill, NewSkillCategory } from "@/db/schema";
import { skillCategories, skills } from "@/db/schema";

// ─── Skill Categories ─────────────────────────────────────────────────────────

export async function getSkillCategories() {
  return db.select().from(skillCategories).orderBy(skillCategories.order);
}

export async function getSkillCategoryById(id: number) {
  const result = await db
    .select()
    .from(skillCategories)
    .where(eq(skillCategories.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createSkillCategory(data: NewSkillCategory) {
  const result = await db.insert(skillCategories).values(data).returning();
  return result[0];
}

export async function updateSkillCategory(
  id: number,
  data: Partial<NewSkillCategory>,
) {
  const result = await db
    .update(skillCategories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(skillCategories.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteSkillCategory(id: number) {
  return db.delete(skillCategories).where(eq(skillCategories.id, id));
}

export async function reorderSkillCategories(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(skillCategories)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(skillCategories.id, id)),
      ),
    );
  });
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function getSkills(categoryId?: number) {
  if (categoryId !== undefined) {
    return db
      .select()
      .from(skills)
      .where(eq(skills.categoryId, categoryId))
      .orderBy(skills.order);
  }
  return db.select().from(skills).orderBy(skills.order);
}

export async function getSkillById(id: number) {
  const result = await db
    .select()
    .from(skills)
    .where(eq(skills.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createSkill(data: NewSkill) {
  const result = await db.insert(skills).values(data).returning();
  return result[0];
}

export async function updateSkill(id: number, data: Partial<NewSkill>) {
  const result = await db
    .update(skills)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(skills.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteSkill(id: number) {
  return db.delete(skills).where(eq(skills.id, id));
}

export async function reorderSkills(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(skills)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(skills.id, id)),
      ),
    );
  });
}

export async function getSkillsWithCategories() {
  return db.query.skillCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.order)],
    with: {
      skills: {
        orderBy: (s, { asc }) => [asc(s.order)],
      },
    },
  });
}
