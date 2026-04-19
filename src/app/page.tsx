import Image from "next/image";
import { SectionContainer } from "@/components/section-container";
import { bio, social } from "@/lib/data";

export default function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-dvh flex items-center pt-16"
        aria-label="Introduction"
      >
        <div className="mx-auto max-w-5xl px-6 w-full py-24">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-12">
            {/* Text */}
            <div className="max-w-xl">
              <p className="text-sm font-mono text-accent uppercase tracking-widest mb-4">
                Available for new projects
              </p>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-fg mb-6">
                {bio.name}
                <span className="block text-fg-muted font-normal mt-1">
                  {bio.title}
                </span>
              </h1>
              <p className="text-lg text-fg-muted leading-relaxed mb-8 max-w-lg">
                {bio.shortBio}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-lg text-sm font-medium hover:bg-accent-hi transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Get in touch
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-fg rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  View projects
                </a>
              </div>
              {/* Social links */}
              <div className="flex items-center gap-4 mt-8">
                {social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    aria-label={s.label}
                    target={s.icon !== "email" ? "_blank" : undefined}
                    rel={s.icon !== "email" ? "noopener noreferrer" : undefined}
                    className="text-xs font-mono text-fg-subtle hover:text-accent transition-colors duration-200"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Portrait */}
            <div className="relative shrink-0">
              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden ring-1 ring-border">
                <Image
                  src="/assets/Gagik-portrait-250px.jpg"
                  alt={`Portrait of ${bio.name}`}
                  fill
                  sizes="(max-width: 768px) 160px, 224px"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Accent decoration */}
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-accent/30 -z-10"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-fg-subtle"
          aria-hidden="true"
        >
          <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-fg-subtle to-transparent" />
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <SectionContainer id="about" className="border-t border-border">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <h2 className="font-display text-4xl font-semibold text-fg">About</h2>
          <div className="space-y-4 text-fg-muted leading-relaxed">
            <p>{bio.longBio}</p>
          </div>
        </div>
      </SectionContainer>

      {/* ── Skills ───────────────────────────────────────────── */}
      <SectionContainer id="skills" className="bg-bg-subtle">
        <h2 className="font-display text-4xl font-semibold text-fg mb-12">Skills</h2>
        <p className="text-fg-subtle font-mono text-sm">Coming in Phase 2…</p>
      </SectionContainer>

      {/* ── Projects ─────────────────────────────────────────── */}
      <SectionContainer id="projects">
        <h2 className="font-display text-4xl font-semibold text-fg mb-12">Projects</h2>
        <p className="text-fg-subtle font-mono text-sm">Coming in Phase 2…</p>
      </SectionContainer>

      {/* ── Experience ───────────────────────────────────────── */}
      <SectionContainer id="experience" className="bg-bg-subtle">
        <h2 className="font-display text-4xl font-semibold text-fg mb-12">Experience</h2>
        <p className="text-fg-subtle font-mono text-sm">Coming in Phase 2…</p>
      </SectionContainer>

      {/* ── Contact ──────────────────────────────────────────── */}
      <SectionContainer id="contact">
        <h2 className="font-display text-4xl font-semibold text-fg mb-12">Contact</h2>
        <p className="text-fg-subtle font-mono text-sm">Coming in Phase 2…</p>
      </SectionContainer>
    </>
  );
}
