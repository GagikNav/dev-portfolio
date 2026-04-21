import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { NewProject } from "@/db/schema";
import { projects } from "@/db/schema";

export async function getProjects() {
  return db.select().from(projects).orderBy(projects.order);
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(projects.order);
}

export async function getProjectById(id: number) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getProjectBySlug(slug: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function createProject(data: NewProject) {
  const result = await db.insert(projects).values(data).returning();
  return result[0];
}

export async function updateProject(id: number, data: Partial<NewProject>) {
  const result = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteProject(id: number) {
  return db.delete(projects).where(eq(projects.id, id));
}

export async function reorderProjects(orderedIds: number[]) {
  return db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx
          .update(projects)
          .set({ order: index, updatedAt: new Date() })
          .where(eq(projects.id, id)),
      ),
    );
  });
}
