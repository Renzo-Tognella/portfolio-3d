"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const STATS = [
  { value: 3, suffix: "+", label: "anos de experiência" },
  { value: 50, suffix: "+", label: "propostas/dia (Modulus)" },
  { value: 1, suffix: "", label: "publicação IEEE" },
  { value: 3, suffix: "", label: "meses como lead interino" },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Backend Engineer @ Tradener",
    description:
      "Faturamento, gestão de risco, APIs PLD. Lead interino por 3 meses.",
    tags: ["Rails", "PostgreSQL", "Redis", "Docker"],
  },
  {
    year: "2023",
    title: "Coautor — IEEE LARS/SBR",
    description:
      "Estimação de centro 3D com Kinect RGB-D. C++ e Python.",
    tags: ["C++", "Python", "Computer Vision"],
  },
  {
    year: "2023",
    title: "Freelance — Modulus Engenharia",
    description:
      "SaaS com pipeline LLM, ~50 propostas/dia, analytics.",
    tags: ["Rails", "Python", "LLMs", "PostgreSQL"],
  },
  {
    year: "2022",
    title: "UTFPR — Sistemas de Informação",
    description: "Início da graduação. Previsão conclusão: Jul/2027.",
    tags: [],
  },
];

const TECH_STACK = [
  {
    category: "Backend",
    color: "#6366f1",
    skills: [
      { name: "Ruby on Rails", pct: 95 },
      { name: "Python", pct: 85 },
      { name: "Java", pct: 70 },
      { name: "REST APIs", pct: 95 },
      { name: "RSpec / TDD", pct: 85 },
    ],
  },
  {
    category: "Bancos de Dados",
    color: "#06b6d4",
    skills: [
      { name: "PostgreSQL", pct: 90 },
      { name: "Redis", pct: 80 },
      { name: "MongoDB", pct: 65 },
      { name: "SQL Avançado", pct: 85 },
    ],
  },
  {
    category: "Infraestrutura",
    color: "#f59e0b",
    skills: [
      { name: "Docker", pct: 85 },
      { name: "AWS", pct: 75 },
      { name: "Git", pct: 90 },
      { name: "CI/CD", pct: 80 },
    ],
  },
  {
    category: "Qualidade & IA",
    color: "#f43f5e",
    skills: [
      { name: "Clean Architecture", pct: 90 },
      { name: "SOLID / Design Patterns", pct: 85 },
      { name: "LLMs / MCP", pct: 80 },
      { name: "C++ / Computer Vision", pct: 70 },
    ],
  },
];

const TERMINAL_LINES = [
  { type: "prompt", text: 'cat about.md' },
  { type: "blank" },
  { type: "key", key: "name", value: '"Renzo Tognella de Rosa"' },
  { type: "key", key: "role", value: '"Backend Software Engineer"' },
  { type: "key", key: "company", value: '"Tradener"' },
  { type: "key", key: "location", value: '"Curitiba, PR — Brasil"' },
  { type: "key", key: "education", value: '"Sistemas de Informação, UTFPR (Jul/2027)"' },
  { type: "key", key: "focus", value: '"Sistemas distribuídos, APIs, gestão de risco energético"' },
  { type: "blank" },
  { type: "cursor" },
];

// ---------------------------------------------------------------------------
// Hook: Intersection Observer for scroll reveal
// ---------------------------------------------------------------------------
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal();

  useEffect(() => {
    if (!visible) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, target]);

  return (
    <span ref={ref} className="text-4xl font-bold text-foreground">
      {count}{suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Block 1: Terminal Bio
// ---------------------------------------------------------------------------
function TerminalBio() {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`about-terminal ${visible ? "is-visible" : ""}`}>
      <div className="mb-3 flex items-center gap-2 border-b border-white/5 pb-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 font-mono text-xs text-muted">about.md</span>
      </div>
      <div className="font-mono text-sm leading-7">
        {TERMINAL_LINES.map((line, i) => {
          if (line.type === "blank") return <div key={i} className="h-3" />;
          if (line.type === "cursor") return (
            <span key={i} className="inline-block h-4 w-2 animate-pulse bg-accent" />
          );
          if (line.type === "prompt") return (
            <div key={i}>
              <span className="text-green-400">visitor@portfolio</span>
              <span className="text-muted">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-muted">$ </span>
              <span className="text-foreground">{line.text}</span>
            </div>
          );
          // key-value
          return (
            <div key={i}>
              <span className="text-muted">&gt; </span>
              <span className="text-indigo-400">{(line as { key: string; value: string }).key}</span>
              <span className="text-muted">: </span>
              <span className="text-amber-300">{(line as { key: string; value: string }).value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 2: Stat Cards
// ---------------------------------------------------------------------------
function StatCard({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`about-stat-card group ${visible ? "is-visible" : ""}`}
      style={{ "--stagger": `${index * 100}ms` } as React.CSSProperties}
    >
      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
      <p className="mt-1 text-xs text-muted">{stat.label}</p>
    </div>
  );
}

function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 3: Bio Narrativa (split-screen)
// ---------------------------------------------------------------------------
function BioNarrativa() {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`grid gap-10 lg:grid-cols-5 ${visible ? "about-fade-in is-visible" : "about-fade-in"}`}
    >
      <div className="lg:col-span-3">
        <p className="text-lg leading-relaxed text-foreground">
          Backend Software Engineer no setor energético, construindo sistemas de
          faturamento e gestão de risco que processam{" "}
          <span className="text-accent">milhões em transações</span>.
          Pesquisador publicado no{" "}
          <span className="text-amber-400">IEEE</span> em visão computacional.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Acredito que engenharia de qualidade começa com requisitos claros, código
          testável e documentação que importa. Liderança interina me ensinou que
          boas decisões técnicas precisam de comunicação tão boa quanto o código.
        </p>
      </div>
      <div className="lg:col-span-2">
        <div className="about-glass-card">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-accent">
            Quick Facts
          </h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2">
              <span className="text-accent">▸</span>Backend-focused (Rails, Python, Java)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">▸</span>IEEE LARS/SBR 2023 coautor
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">▸</span>Freelance SaaS c/ pipeline LLM
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">▸</span>Team lead interino (3 meses)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">▸</span>Curitiba, PR — Brasil
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 4: Career Timeline
// ---------------------------------------------------------------------------
function TimelineEntry({ entry, index }: { entry: (typeof TIMELINE)[number]; index: number }) {
  const { ref, visible } = useReveal();
  const isLeft = index % 2 === 0;
  return (
    <div
      ref={ref}
      className={`about-timeline-entry mb-10 last:mb-0 ${visible ? "is-visible" : ""}`}
      style={{ "--stagger": `${index * 150}ms` } as React.CSSProperties}
    >
      <div className="relative flex items-start gap-6 md:gap-0">
        {/* Desktop: alternating sides */}
        <div className={`hidden md:block md:w-1/2 ${isLeft ? "pr-10 text-right" : "order-2 pl-10"}`}>
          {isLeft && <TimelineCard entry={entry} />}
        </div>
        {/* Node */}
        <div className="absolute left-2.5 z-10 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
          <div className="about-timeline-node h-4 w-4 rounded-full border-2 border-accent bg-background" />
        </div>
        {/* Mobile */}
        <div className="ml-10 md:hidden">
          <TimelineCard entry={entry} />
        </div>
        {/* Desktop: other side */}
        <div className={`hidden md:block md:w-1/2 ${isLeft ? "order-2 pl-10" : "pr-10 text-right"}`}>
          {!isLeft && <TimelineCard entry={entry} />}
        </div>
      </div>
    </div>
  );
}

function CareerTimeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/50 md:left-1/2 md:-translate-x-px" />
      {TIMELINE.map((entry, i) => (
        <TimelineEntry key={i} entry={entry} index={i} />
      ))}
    </div>
  );
}

function TimelineCard({ entry }: { entry: (typeof TIMELINE)[number] }) {
  return (
    <div className="about-glass-card text-left">
      <span className="font-mono text-xs font-bold text-accent">{entry.year}</span>
      <h4 className="mt-1 text-sm font-semibold text-foreground">{entry.title}</h4>
      <p className="mt-1 text-xs text-muted">{entry.description}</p>
      {entry.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/50 bg-background/50 px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block 5: Tech Stack Grid
// ---------------------------------------------------------------------------
function TechCategoryCard({ cat, index }: { cat: (typeof TECH_STACK)[number]; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`about-tech-card ${visible ? "is-visible" : ""}`}
      style={{ "--stagger": `${index * 100}ms`, "--card-color": cat.color } as React.CSSProperties}
    >
      <div className="h-1 w-full rounded-full" style={{ background: cat.color }} />
      <div className="p-5">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
          {cat.category}
        </h4>
        <div className="flex flex-col gap-3">
          {cat.skills.map((skill, si) => (
            <div key={skill.name} className="about-skill-row" style={{ "--bar-stagger": `${si * 60}ms` } as React.CSSProperties}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-xs text-foreground/80">{skill.name}</span>
                <span className="font-mono text-[10px]" style={{ color: cat.color }}>{skill.pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: `${cat.color}20` }}>
                <div
                  className="about-skill-bar h-full rounded-full"
                  style={{
                    width: "0%",
                    background: cat.color,
                    "--target-width": `${skill.pct}%`,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechStackGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TECH_STACK.map((cat, ci) => (
        <TechCategoryCard key={cat.category} cat={cat} index={ci} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// About section — orchestrator
// ---------------------------------------------------------------------------
export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      {/* Section header */}
      <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-accent">
        Sobre
      </h2>
      <div className="relative mb-3 h-[3px] w-48 overflow-hidden rounded-full bg-surface">
        <div className="animate-shimmer absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
      </div>
      <p className="mb-14 max-w-md text-sm text-muted">
        Engenheiro de software com foco em backend, sistemas distribuídos e pesquisa aplicada.
      </p>

      {/* Block 1: Terminal Bio */}
      <div className="mb-16">
        <TerminalBio />
      </div>

      {/* Block 2: Stat Cards */}
      <div className="mb-16">
        <StatCards />
      </div>

      {/* Block 3: Bio Narrativa */}
      <div className="mb-16">
        <BioNarrativa />
      </div>

      {/* Block 4: Career Timeline */}
      <div className="mb-16">
        <h3 className="mb-8 font-mono text-xs uppercase tracking-wider text-accent">
          Trajetória
        </h3>
        <CareerTimeline />
      </div>

      {/* Block 5: Tech Stack */}
      <div>
        <h3 className="mb-8 font-mono text-xs uppercase tracking-wider text-accent">
          Tecnologias
        </h3>
        <TechStackGrid />
      </div>
    </section>
  );
}
