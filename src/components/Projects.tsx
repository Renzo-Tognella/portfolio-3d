"use client";

import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────
   Project Data — Real projects from resume
   ──────────────────────────────────────────── */

interface Project {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tech: string[];
  github?: string;
  link?: string;
  linkLabel: string;
  accent: string;
  accentDot: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

const PROJECTS: Project[] = [
  {
    title: "Tradener",
    subtitle: "Sistema de Faturamento & Gestão de Risco",
    description:
      "Soluções backend para cobrança, faturamento, portal do cliente e gestão de risco no setor energético. APIs para cálculo de faturas, rating, crédito e exposição ao PLD.",
    highlights: [
      "Sistema de multas/juros que reduziu rotina de 30h para 5min",
      "Integração Salesforce ↔ Protheus ↔ serviços internos",
      "APIs de faturamento, rating e exposição ao PLD",
      "Lead interino por 3 meses — code reviews e padrões",
    ],
    tech: ["Ruby on Rails", "PostgreSQL", "Redis", "Docker"],
    accent: "#818cf8",
    accentDot: "bg-indigo-400",
    gradientFrom: "#312e81",
    gradientVia: "#1e1b4b",
    gradientTo: "#0c4a6e",
    github: undefined,
    link: undefined,
    linkLabel: "Projeto interno",
  },
  {
    title: "Modulus",
    subtitle: "Plataforma SaaS para Engenharia",
    description:
      "Centralização de propostas e serviços com pipeline de LLMs para extração de dados, analytics e rastreamento operacional.",
    highlights: [
      "~50 propostas/dia processadas, 10+ usuários ativos",
      "Pipeline LLM com validação human-in-the-loop",
      "Analytics de conversão e rentabilidade",
      "Substituiu controles em planilha por fluxo rastreável",
    ],
    tech: ["Ruby on Rails", "Python", "LLMs", "PostgreSQL"],
    accent: "#34d399",
    accentDot: "bg-emerald-400",
    gradientFrom: "#064e3b",
    gradientVia: "#065f46",
    gradientTo: "#115e59",
    github: undefined,
    link: undefined,
    linkLabel: "Freelance",
  },
  {
    title: "IEEE Research",
    subtitle: "Estimação 3D com Kinect RGB-D",
    description:
      "Pesquisa em visão computacional para estimação de centro 3D usando sensor Kinect, com algoritmos em C++ e Python. Publicado no IEEE LARS/SBR 2023.",
    highlights: [
      "Coautor — IEEE LARS/SBR 2023",
      "Algoritmos C++/Python para estimação de centro 3D",
      "NLP, embeddings e análise de sentimentos aplicados",
      "Integração visão computacional + eficiência algorítmica",
    ],
    tech: ["C++", "Python", "Computer Vision", "NLP"],
    accent: "#fbbf24",
    accentDot: "bg-amber-400",
    gradientFrom: "#78350f",
    gradientVia: "#7c2d12",
    gradientTo: "#9a3412",
    link: "https://doi.org/10.1109/LARS/SBR54043.2023",
    linkLabel: "Publicação IEEE",
  },
];

/* ────────────────────────────────────────────
   Icons
   ──────────────────────────────────────────── */

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   Visual Placeholders — CSS gradient compositions
   ──────────────────────────────────────────── */

function TradenerVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #312e81 0%, #1e1b4b 40%, #0c4a6e 100%)` }} />

      {/* Grid pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 400 300" preserveAspectRatio="none">
        <defs>
          <pattern id="tradener-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#818cf8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#tradener-grid)" />
      </svg>

      {/* Flowing sine wave */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M0,150 C50,80 100,220 150,150 C200,80 250,220 300,150 C350,80 400,220 450,150" fill="none" stroke="#818cf8" strokeWidth="2">
          <animate attributeName="d" dur="6s" repeatCount="indefinite" values="
            M0,150 C50,80 100,220 150,150 C200,80 250,220 300,150 C350,80 400,220 450,150;
            M0,150 C50,220 100,80 150,150 C200,220 250,80 300,150 C350,220 400,80 450,150;
            M0,150 C50,80 100,220 150,150 C200,80 250,220 300,150 C350,80 400,220 450,150
          " />
        </path>
        <path d="M0,170 C50,100 100,240 150,170 C200,100 250,240 300,170 C350,100 400,240 450,170" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5">
          <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
            M0,170 C50,100 100,240 150,170 C200,100 250,240 300,170 C350,100 400,240 450,170;
            M0,170 C50,240 100,100 150,170 C200,240 250,100 300,170 C350,240 400,100 450,170;
            M0,170 C50,100 100,240 150,170 C200,100 250,240 300,170 C350,100 400,240 450,170
          " />
        </path>
      </svg>

      {/* Central mockup card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm" style={{ width: "65%", maxWidth: 260 }}>
          <div className="mb-3 flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400/70" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <div className="h-2 w-2 rounded-full bg-green-400/70" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded bg-indigo-400/30" />
            <div className="flex gap-2">
              <div className="h-8 w-1/3 rounded bg-indigo-500/20" />
              <div className="h-8 w-1/3 rounded bg-cyan-500/20" />
              <div className="h-8 w-1/3 rounded bg-indigo-500/20" />
            </div>
            <div className="h-2 w-1/2 rounded bg-cyan-400/20" />
            <div className="h-2 w-2/3 rounded bg-indigo-400/15" />
          </div>
        </div>
      </div>

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl" style={{ background: "#818cf8" }} />
    </div>
  );
}

function ModulusVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #064e3b 0%, #065f46 40%, #115e59 100%)` }} />

      {/* Connection nodes */}
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
        <circle cx="80" cy="80" r="4" fill="#34d399" />
        <circle cx="200" cy="60" r="3" fill="#34d399" />
        <circle cx="320" cy="100" r="5" fill="#2dd4bf" />
        <circle cx="120" cy="200" r="3" fill="#34d399" />
        <circle cx="280" cy="220" r="4" fill="#2dd4bf" />
        <circle cx="180" cy="150" r="6" fill="#34d399" />
        <line x1="80" y1="80" x2="200" y2="60" stroke="#34d399" strokeWidth="0.8" />
        <line x1="200" y1="60" x2="320" y2="100" stroke="#2dd4bf" strokeWidth="0.8" />
        <line x1="120" y1="200" x2="280" y2="220" stroke="#34d399" strokeWidth="0.8" />
        <line x1="80" y1="80" x2="180" y2="150" stroke="#34d399" strokeWidth="0.6" />
        <line x1="320" y1="100" x2="180" y2="150" stroke="#2dd4bf" strokeWidth="0.6" />
        <line x1="180" y1="150" x2="120" y2="200" stroke="#34d399" strokeWidth="0.6" />
        <line x1="180" y1="150" x2="280" y2="220" stroke="#2dd4bf" strokeWidth="0.6" />
      </svg>

      {/* Dashboard mockup */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-3 p-4" style={{ width: "75%", maxWidth: 280 }}>
          {/* Card 1 */}
          <div className="flex-1 rounded-lg border border-white/10 bg-black/30 p-3 backdrop-blur-sm">
            <div className="mb-2 h-1.5 w-2/3 rounded bg-emerald-400/30" />
            <div className="h-6 w-full rounded bg-emerald-500/20" />
            <div className="mt-2 h-1.5 w-1/2 rounded bg-teal-400/20" />
          </div>
          {/* Card 2 */}
          <div className="flex-1 rounded-lg border border-white/10 bg-black/30 p-3 backdrop-blur-sm">
            <div className="mb-2 h-1.5 w-1/2 rounded bg-teal-400/30" />
            <div className="flex gap-1">
              <div className="h-6 flex-1 rounded bg-emerald-500/20" />
              <div className="h-6 flex-1 rounded bg-emerald-500/15" />
            </div>
            <div className="mt-2 flex gap-1">
              <div className="h-2 w-2 rounded-full bg-green-400/60" />
              <div className="h-1.5 w-1/2 rounded bg-emerald-400/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Glow */}
      <div className="absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl" style={{ background: "#34d399" }} />
    </div>
  );
}

function IEEEVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #78350f 0%, #7c2d12 40%, #9a3412 100%)` }} />

      {/* 3D coordinate system + point cloud */}
      <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 400 300" preserveAspectRatio="none">
        {/* Axes */}
        <line x1="200" y1="200" x2="320" y2="140" stroke="#fbbf24" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="100" y2="140" stroke="#fbbf24" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="200" y2="60" stroke="#fbbf24" strokeWidth="1.5" />
        {/* Axis labels */}
        <text x="325" y="140" fill="#fbbf24" fontSize="12" fontFamily="monospace">X</text>
        <text x="85" y="140" fill="#fbbf24" fontSize="12" fontFamily="monospace">Z</text>
        <text x="205" y="55" fill="#fbbf24" fontSize="12" fontFamily="monospace">Y</text>
        {/* Point cloud */}
        {[
          [220, 150], [240, 130], [230, 170], [250, 120], [260, 160],
          [210, 140], [235, 180], [245, 110], [225, 160], [255, 140],
          [215, 125], [240, 155], [260, 130], [230, 145], [250, 170],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5 - (i % 3) * 0.5} fill="#fbbf24" opacity={0.4 + (i % 4) * 0.15} />
        ))}
        {/* Depth map grid */}
        <rect x="50" y="50" width="120" height="80" fill="none" stroke="#ea580c" strokeWidth="0.5" rx="4" opacity="0.3" />
        <line x1="50" y1="70" x2="170" y2="70" stroke="#ea580c" strokeWidth="0.3" opacity="0.2" />
        <line x1="50" y1="90" x2="170" y2="90" stroke="#ea580c" strokeWidth="0.3" opacity="0.2" />
        <line x1="50" y1="110" x2="170" y2="110" stroke="#ea580c" strokeWidth="0.3" opacity="0.2" />
        <line x1="90" y1="50" x2="90" y2="130" stroke="#ea580c" strokeWidth="0.3" opacity="0.2" />
        <line x1="130" y1="50" x2="130" y2="130" stroke="#ea580c" strokeWidth="0.3" opacity="0.2" />
      </svg>

      {/* Central element — depth map dots */}
      <div className="absolute right-8 bottom-8 flex flex-col gap-1 opacity-40">
        {[...Array(5)].map((_, row) => (
          <div key={row} className="flex gap-1">
            {[...Array(6)].map((_, col) => (
              <div
                key={col}
                className="rounded-sm"
                style={{
                  width: 8,
                  height: 8,
                  background: "#fbbf24",
                  opacity: 0.2 + Math.sin(row * 0.8 + col * 0.6) * 0.3,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl" style={{ background: "#fbbf24" }} />
    </div>
  );
}

const PROJECT_VISUALS = [TradenerVisual, ModulusVisual, IEEEVisual];

/* ────────────────────────────────────────────
   Scroll Progress Hook
   ──────────────────────────────────────────── */

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const inView = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) update();
      },
      { threshold: 0, rootMargin: "200px 0px" }
    );
    observer.observe(el);

    const update = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight;
      const total = rect.height + wh;
      const traveled = wh - rect.top;
      setProgress(Math.max(0, Math.min(1, traveled / total)));
    };

    const onScroll = () => {
      if (inView.current) requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return progress;
}

/* ────────────────────────────────────────────
   Project Section — scroll-driven cinematic reveal
   ──────────────────────────────────────────── */

function ProjectSection({ project, index }: { project: Project; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const VisualComponent = PROJECT_VISUALS[index];
  const isReversed = index % 2 === 1;

  // Animation phases
  const imageP = Math.min(1, progress * 2.2);           // 0→1 over first ~45% scroll
  const textP = Math.max(0, Math.min(1, (progress - 0.15) * 2.5)); // 0→1 from 15-55%
  const tagsP = Math.max(0, Math.min(1, (progress - 0.3) * 2.5));  // 0→1 from 30-70%

  // Image clip-path (reveal from center)
  const insetVal = Math.max(0, 40 * (1 - imageP));
  const scaleVal = 1 + 0.06 * (1 - imageP);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] items-center py-12 md:py-20"
    >
      <div className={`flex w-full flex-col gap-8 lg:flex-row lg:gap-16 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}>
        {/* ── Visual placeholder ── */}
        <div className="relative w-full lg:w-3/5">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
            style={{
              clipPath: `inset(${insetVal}% ${insetVal * 0.7}%)`,
              transform: `scale(${scaleVal})`,
              opacity: Math.max(0.05, imageP),
              willChange: "clip-path, transform, opacity",
            }}
          >
            <VisualComponent />
            {/* Bottom gradient fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
          </div>
        </div>

        {/* ── Content ── */}
        <div
          className="w-full lg:w-2/5"
          style={{
            opacity: textP,
            transform: `translateY(${(1 - textP) * 25}px)`,
            willChange: "opacity, transform",
          }}
        >
          {/* Title */}
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-5xl font-bold leading-none"
              style={{ color: project.accent, opacity: 0.15 }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-sm" style={{ color: project.accent }}>
            {project.subtitle}
          </p>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          {/* Highlights */}
          <ul className="mt-4 space-y-2">
            {project.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted/90"
                style={{
                  opacity: Math.max(0, Math.min(1, (tagsP - i * 0.15) * 3)),
                  transform: `translateX(${(1 - Math.max(0, Math.min(1, (tagsP - i * 0.15) * 3))) * 15}px)`,
                }}
              >
                <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full" style={{ background: project.accent }} />
                {h}
              </li>
            ))}
          </ul>

          {/* Tech pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t, i) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3 py-1 font-mono text-[11px] text-muted transition-colors duration-300 hover:border-accent/40 hover:text-foreground"
                style={{
                  opacity: Math.max(0, Math.min(1, (tagsP - i * 0.1 - 0.1) * 3)),
                  transform: `scale(${0.9 + 0.1 * Math.min(1, Math.max(0, (tagsP - i * 0.1 - 0.1) * 3))})`,
                }}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${project.accentDot}`} />
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="mt-6 flex items-center gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3.5 py-2 text-xs font-medium text-muted transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
              >
                GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-all duration-300 hover:text-accent-secondary group/link"
              >
                {project.linkLabel}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
            {!project.github && !project.link && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted/50">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted/30" />
                {project.linkLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
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

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heading = section.querySelectorAll("[data-reveal-heading]");

    if (prefersReduced) {
      heading.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    heading.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="mx-auto max-w-6xl px-6 py-24">
      {/* ── Section heading ── */}
      <div className="mb-8">
        <h2
          data-reveal-heading
          className="project-card font-mono text-sm font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Projetos
        </h2>
        <div
          data-reveal-heading
          className="project-card mt-3 h-px w-full overflow-hidden bg-border"
          style={{ "--stagger": "50ms" } as React.CSSProperties}
        >
          <div
            className="h-full w-1/3 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500"
            style={{ animation: "shimmer 3s ease-in-out infinite alternate" }}
          />
        </div>
        <p
          data-reveal-heading
          className="project-card mt-4 max-w-lg text-sm leading-relaxed text-muted"
          style={{ "--stagger": "100ms" } as React.CSSProperties}
        >
          Experiência em sistemas de missão crítica, integrações corporativas e pesquisa aplicada.
        </p>
      </div>

      {/* ── Project sections ── */}
      <div className="flex flex-col">
        {PROJECTS.map((project, i) => (
          <ProjectSection key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
