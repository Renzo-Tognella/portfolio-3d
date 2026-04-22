"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  illustration: ReactNode;
  accentDot: string;
  projectAccent: string;       // color for glow / border accents
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: "TheSearch",
    description:
      "Plataforma de busca e agregação de dados com arquitetura distribuída e pipeline de processamento em tempo real.",
    tech: ["TypeScript", "Next.js", "AWS", "Docker"],
    github: "https://github.com/Renzo-Tognella/TheSearch",
    live: "#",
    illustration: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 60"
        fill="none"
        className="h-14 w-14 text-accent/70"
      >
        <rect x="4" y="8" width="52" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
        <polyline points="16,28 24,22 16,16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="30" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="18" y1="44" x2="18" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="44" x2="42" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    accentDot: "bg-indigo-400",
    projectAccent: "#818cf8",
    featured: true,
  },
  {
    title: "EvoArena",
    description:
      "Simulação evolutiva em Unity com algoritmos genéticos e neuroevolution. Benchmarks de stress com 10K+ épocas.",
    tech: ["C#", "Unity", "Python", "ML-Agents"],
    github: "https://github.com/Renzo-Tognella/EvoArena",
    live: "#",
    illustration: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 60"
        fill="none"
        className="h-14 w-14 text-emerald-400/70"
      >
        <rect x="8" y="14" width="44" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="22" cy="28" r="2" fill="currentColor" />
        <circle cx="30" cy="28" r="2" fill="currentColor" />
        <circle cx="38" cy="28" r="2" fill="currentColor" />
        <path d="M14 42 L14 48 Q14 52 18 52 L42 52 Q46 52 46 48 L46 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="48" x2="20" y2="52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="48" x2="40" y2="52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accentDot: "bg-emerald-400",
    projectAccent: "#34d399",
  },
  {
    title: "Hermes Agent",
    description:
      "Sistema de engenharia de software com IA — doc-first, multi-agent, governance. Profile SE-Chief.",
    tech: ["TypeScript", "Python", "Docker", "MCP"],
    github: "https://github.com/Renzo-Tognella/TheSearch",
    live: "#",
    illustration: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 60"
        fill="none"
        className="h-14 w-14 text-amber-400/70"
      >
        <rect x="14" y="6" width="32" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="16" r="2.5" fill="currentColor" />
        <circle cx="36" cy="16" r="2.5" fill="currentColor" />
        <path d="M10 26 L14 26 Q14 32 20 32 L40 32 Q46 32 46 26 L50 26 Q54 26 54 30 L54 42 Q54 52 44 52 L16 52 Q6 52 6 42 L6 30 Q6 26 10 26Z" stroke="currentColor" strokeWidth="2" />
        <line x1="24" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    accentDot: "bg-amber-400",
    projectAccent: "#fbbf24",
  },
];

/* ────────────────────────────────────────────
   GitHub SVG icon
   ──────────────────────────────────────────── */

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   Arrow icon (animated)
   ──────────────────────────────────────────── */

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   Project Card — Discovery Timeline style
   ──────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={cardRef}
      data-reveal
      style={{ "--stagger": `${index * 150}ms` } as React.CSSProperties}
      className={`
        project-card group/card relative flex flex-col md:flex-row
        items-start md:items-center gap-6 md:gap-10
        rounded-2xl border border-border bg-surface
        p-6 md:p-8 lg:p-10
        transition-all duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]
        hover:-translate-y-1
        hover:border-accent/30
        hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.15)]
        ${project.featured ? "ring-1 ring-accent/10" : ""}
      `}
    >
      {/* ── Featured glow background ── */}
      {project.featured && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.04]"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${project.projectAccent}, transparent 70%)`,
          }}
        />
      )}

      {/* ── Hover radial gradient overlay ── */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
        <div
          className="absolute -top-20 left-1/3 h-40 w-2/3 rounded-full blur-3xl opacity-[0.06]"
          style={{ background: project.projectAccent }}
        />
      </div>

      {/* ── LEFT: Number watermark + SVG illustration ── */}
      <div className="relative flex shrink-0 flex-col items-center gap-2 md:w-48">
        {/* Large faded number */}
        <span
          data-reveal-number
          className="project-number pointer-events-none select-none font-mono text-7xl md:text-8xl font-bold leading-none text-accent/[0.06] transition-all duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)]"
          aria-hidden="true"
        >
          {num}
        </span>

        {/* SVG illustration */}
        <div className="mt-1 transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover/card:scale-110 group-hover/card:-translate-y-0.5">
          {project.illustration}
        </div>
      </div>

      {/* ── RIGHT: Content ── */}
      <div className="relative min-w-0 flex-1">
        {/* Title row */}
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {project.title}
          </h3>
          {project.featured && (
            <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
              Featured
            </span>
          )}
          {/* Animated arrow */}
          <span
            className="ml-auto inline-flex items-center transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover/card:-translate-y-1 group-hover/card:translate-x-1"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-5 w-5 text-muted/40" />
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span
              key={t}
              data-reveal-pill
              style={{ "--stagger": `${index * 150 + 200 + i * 50}ms` } as React.CSSProperties}
              className={`
                project-pill inline-flex items-center gap-1.5
                rounded-full border border-border/60
                bg-background/50 px-3 py-1 font-mono text-[11px] text-muted
                transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)]
                group-hover/card:border-accent/30 group-hover/card:text-foreground
              `}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${project.accentDot}`}
              />
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-2 rounded-lg border border-border/60
              bg-background/40 px-3.5 py-2 text-xs font-medium text-muted
              transition-all duration-300
              hover:border-accent/50 hover:bg-accent/10 hover:text-foreground
            `}
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={project.live}
            className={`
              inline-flex items-center gap-1.5 text-xs font-medium text-accent
              transition-all duration-300
              hover:text-accent-secondary
              group/link
            `}
          >
            Live Demo
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────
   Section
   ──────────────────────────────────────────── */

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const elements = section.querySelectorAll("[data-reveal]");
    const numbers = section.querySelectorAll("[data-reveal-number]");
    const pills = section.querySelectorAll("[data-reveal-pill]");

    if (prefersReduced) {
      // Just make everything visible immediately
      elements.forEach((el) => el.classList.add("is-visible"));
      numbers.forEach((el) => el.classList.add("is-visible"));
      pills.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    numbers.forEach((el) => observer.observe(el));
    pills.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      {/* ── Section heading ── */}
      <div className="mb-14">
        <h2
          data-reveal
          className="project-card font-mono text-sm font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Projetos
        </h2>
        <div
          data-reveal
          className="project-card mt-3 h-px w-full overflow-hidden bg-border"
          style={{ "--stagger": "50ms" } as React.CSSProperties}
        >
          <div
            className="h-full w-1/3 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500"
            style={{
              animation: "shimmer 3s ease-in-out infinite alternate",
            }}
          />
        </div>
        <p
          data-reveal
          className="project-card mt-4 max-w-lg text-sm leading-relaxed text-muted"
          style={{ "--stagger": "100ms" } as React.CSSProperties}
        >
          Uma seleção de projetos que demonstram experiência em sistemas
          distribuídos, IA e engenharia de software moderna.
        </p>
      </div>

      {/* ── Cards list with group-hover dimming ── */}
      <div className="group/list flex flex-col gap-6">
        {PROJECTS.map((project, i) => (
          <div
            key={project.title}
            className="transition-opacity duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover/list:opacity-40 hover:!opacity-100"
          >
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
