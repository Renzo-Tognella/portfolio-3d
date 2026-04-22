import type { ReactNode } from "react";

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  icon: ReactNode;
  gradient: string;          // top-bar gradient
  accentDot: string;         // tech-pill dot colour per project
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
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    accentDot: "bg-indigo-400",
    featured: true,
  },
  {
    title: "EvoArena",
    description:
      "Simulação evolutiva em Unity com algoritmos genéticos e neuroevolution. Benchmarks de stress com 10K+ épocas.",
    tech: ["C#", "Unity", "Python", "ML-Agents"],
    github: "https://github.com/Renzo-Tognella/EvoArena",
    live: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
        <path d="M8 18v2M16 18v2" />
      </svg>
    ),
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    accentDot: "bg-emerald-400",
  },
  {
    title: "Hermes Agent",
    description:
      "Sistema de engenharia de software com IA — doc-first, multi-agent, governance. Profile SE-Chief.",
    tech: ["TypeScript", "Python", "Docker", "MCP"],
    github: "https://github.com/Renzo-Tognella/TheSearch",
    live: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M16 11a4 4 0 0 1 4 4v5H4v-5a4 4 0 0 1 4-4" />
        <circle cx="9" cy="7" r="0.5" fill="currentColor" />
        <circle cx="15" cy="7" r="0.5" fill="currentColor" />
      </svg>
    ),
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    accentDot: "bg-amber-400",
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
   Arrow icon
   ──────────────────────────────────────────── */

function ArrowIcon({ className }: { className?: string }) {
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
   Project Card
   ──────────────────────────────────────────── */

function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.featured ? "article" : "article";
  const spanClass = project.featured ? "md:col-span-2" : "";

  return (
    <Wrapper
      className={`group relative overflow-hidden rounded-2xl border border-border
        bg-surface transition-all duration-500
        hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10
        hover:border-accent/40 ${spanClass}`}
    >
      {/* ── Gradient top accent strip ── */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${project.gradient} transition-all duration-500 group-hover:h-1.5`}
      />

      {/* ── Subtle radial glow on hover ── */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className={`absolute -top-20 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-r ${project.gradient} blur-3xl opacity-[0.08]`}
        />
      </div>

      <div className="relative p-6 md:p-8">
        {/* ── Icon + Title row ── */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
              bg-gradient-to-br ${project.gradient} bg-clip-text text-transparent
              ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110`}
            style={{ color: "var(--foreground)" }}
          >
            {/* Render icon with accent colour on hover via the group */}
            <span className="text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
              {project.icon}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {project.title}
              {project.featured && (
                <span className="ml-3 inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
                  Featured
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* ── Description ── */}
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {/* ── Tech pills ── */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60
                bg-background/50 px-3 py-1 font-mono text-[11px] text-muted
                transition-colors duration-300 group-hover:border-accent/30 group-hover:text-foreground"
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${project.accentDot}`}
              />
              {t}
            </span>
          ))}
        </div>

        {/* ── Links ── */}
        <div className="mt-6 flex items-center gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60
              bg-background/40 px-3.5 py-2 text-xs font-medium text-muted
              transition-all duration-300
              hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
          >
            <GitHubIcon className="h-4 w-4" />
            Source
          </a>
          <a
            href={project.live}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent
              transition-all duration-300 hover:text-accent-secondary"
          >
            Live Demo
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </Wrapper>
  );
}

/* ────────────────────────────────────────────
   Section
   ──────────────────────────────────────────── */

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      {/* ── Section heading with animated gradient line ── */}
      <div className="mb-12">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Projetos
        </h2>
        <div className="mt-3 h-px w-full overflow-hidden bg-border">
          <div
            className="h-full w-1/3 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500"
            style={{
              animation: "shimmer 3s ease-in-out infinite alternate",
            }}
          />
        </div>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Uma seleção de projetos que demonstram experiência em sistemas
          distribuídos, IA e engenharia de software moderna.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
