// Single source of truth for all portfolio content.
// Use `satisfies` to get type-checking without widening inferred literal types.

// ─── Types ───────────────────────────────────────────────────────────────────

export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
};

export type Experience = {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string; // "YYYY-MM"
  endDate: string | null; // null = present
  highlights: string[];
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email" | "x";
};

// ─── Content ─────────────────────────────────────────────────────────────────

export const social = [
  { label: 'GitHub', href: 'https://github.com/GagikNav', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gagik-n/', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:hello@gagiknav.dev', icon: 'email' },
] satisfies SocialLink[]

export const skills = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Radix UI"],
  },
  {
    category: "Backend",
    items: ["Node.js", "tRPC", "REST", "GraphQL", "Prisma", "PostgreSQL"],
  },
  {
    category: "Tooling",
    items: ["Git", "Vercel", "Docker", "Biome", "Vitest", "Playwright"],
  },
] satisfies SkillGroup[];

export const experience = [
  {
    role: "Senior Software Engineer",
    company: "Your Company",
    companyUrl: "https://example.com",
    location: "Remote",
    startDate: "2023-01",
    endDate: null,
    highlights: [
      "Led development of a customer-facing dashboard serving 50 k+ users, improving load time by 40 % through RSC and edge caching.",
      "Migrated a monolithic Express API to a tRPC + Prisma service, reducing type-safety bugs by 60 %.",
      "Mentored two junior engineers and established a code-review culture that halved review cycle time.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Previous Company",
    companyUrl: "https://example.com",
    location: "Remote",
    startDate: "2021-03",
    endDate: "2022-12",
    highlights: [
      "Built and shipped a real-time collaboration feature using WebSockets and CRDT, adopted by 80 % of active teams.",
      "Owned the design-system component library, cutting design-to-code time by 30 %.",
    ],
  },
] satisfies Experience[];

export const projects = [
  {
    slug: "project-one",
    title: "Project One",
    description:
      "A short, punchy description of the project. What problem does it solve? Who uses it?",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/GagikNav/project-one",
    imageUrl: undefined,
    featured: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    description:
      "Another project description. Keep it focused on impact and outcomes.",
    tech: ["React", "Node.js", "tRPC", "Prisma"],
    repoUrl: "https://github.com/GagikNav/project-two",
    imageUrl: undefined,
    featured: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    description:
      "A third project — tools, CLIs, open-source libraries, or experiments all count.",
    tech: ["TypeScript", "Vitest", "Node.js"],
    repoUrl: "https://github.com/GagikNav/project-three",
    imageUrl: undefined,
    featured: false,
  },
] satisfies Project[];

export const bio = {
  name: "Gagik",
  title: "Full-Stack Developer",
  tagline: "I build fast, accessible, well-crafted web products.",
  shortBio:
    "Full-stack developer with a focus on React and the modern web platform. I care deeply about developer experience, performance, and the details that make software feel right.",
  longBio:
    "I'm a full-stack developer with several years of experience building web applications from idea to production. My day-to-day lives at the intersection of frontend craft, backend pragmatism, and a genuine obsession with developer tooling. When I'm not shipping features, I'm contributing to open source, reading about compilers, or tweaking my editor config.",
} as const;
