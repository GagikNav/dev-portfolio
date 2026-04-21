import * as legacyData from "@/app/lib/data";
import { db } from "@/db";
import {
  bio,
  experiences,
  projects,
  skillCategories,
  skills,
  socialLinks,
} from "@/db/schema";

async function migrate() {
  console.log("Starting data migration...");

  // Clear existing data in dependency order (children before parents)
  await db.delete(skills);
  await db.delete(skillCategories);
  await db.delete(socialLinks);
  await db.delete(experiences);
  await db.delete(projects);
  await db.delete(bio);

  // ── Bio ────────────────────────────────────────────────────────────────────
  await db.insert(bio).values({
    name: legacyData.bio.name,
    title: legacyData.bio.title,
    tagline: legacyData.bio.tagline,
    shortBio: legacyData.bio.shortBio,
    longBio: legacyData.bio.longBio,
    availability: "open",
    updatedAt: new Date(),
  });
  console.log("  ✓ bio inserted");

  // ── Social links ───────────────────────────────────────────────────────────
  for (let i = 0; i < legacyData.social.length; i++) {
    const link = legacyData.social[i];
    await db.insert(socialLinks).values({
      label: link.label,
      href: link.href,
      icon: link.icon,
      order: i,
    });
  }
  console.log(`  ✓ ${legacyData.social.length} social link(s) inserted`);

  // ── Skill categories & skills ──────────────────────────────────────────────
  for (
    let categoryIndex = 0;
    categoryIndex < legacyData.skills.length;
    categoryIndex++
  ) {
    const group = legacyData.skills[categoryIndex];

    const [inserted] = await db
      .insert(skillCategories)
      .values({ name: group.category, order: categoryIndex })
      .returning({ id: skillCategories.id });

    for (let skillIndex = 0; skillIndex < group.items.length; skillIndex++) {
      await db.insert(skills).values({
        categoryId: inserted.id,
        name: group.items[skillIndex],
        order: skillIndex,
      });
    }
  }
  console.log(`  ✓ ${legacyData.skills.length} skill category/ies inserted`);

  // ── Experiences ────────────────────────────────────────────────────────────
  for (let i = 0; i < legacyData.experience.length; i++) {
    const exp = legacyData.experience[i];
    await db.insert(experiences).values({
      role: exp.role,
      company: exp.company,
      companyUrl: exp.companyUrl,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate ?? null,
      highlights: exp.highlights,
      order: i,
    });
  }
  console.log(`  ✓ ${legacyData.experience.length} experience(s) inserted`);

  // ── Projects ───────────────────────────────────────────────────────────────
  for (let i = 0; i < legacyData.projects.length; i++) {
    const proj = legacyData.projects[i];
    await db.insert(projects).values({
      slug: proj.slug,
      title: proj.title,
      description: proj.description,
      techStack: proj.tech,
      liveUrl: proj.liveUrl,
      repoUrl: proj.repoUrl,
      imageUrl: proj.imageUrl,
      featured: proj.featured,
      order: i,
    });
  }
  console.log(`  ✓ ${legacyData.projects.length} project(s) inserted`);

  console.log("Migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
