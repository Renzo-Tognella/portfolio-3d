"use client";

import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// Data
// ═══════════════════════════════════════════════════════════════

interface Skill {
  name: string;
  level: number;
}

interface Category {
  name: string;
  accent: string;
  accentRgb: string;
  barFill: string;
  textAccent: string;
  skills: Skill[];
}

const CATEGORIES: Category[] = [
  {
    name: "Backend",
    accent: "#6366f1",
    accentRgb: "99,102,241",
    barFill: "linear-gradient(90deg, #6366f1, #818cf8)",
    textAccent: "#a5b4fc",
    skills: [
      { name: "Ruby on Rails", level: 95 },
      { name: "Python", level: 85 },
      { name: "REST / GraphQL", level: 90 },
      { name: "RSpec / TDD", level: 85 },
      { name: "Java / Spring", level: 70 },
    ],
  },
  {
    name: "Frontend",
    accent: "#8b5cf6",
    accentRgb: "139,92,246",
    barFill: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
    textAccent: "#c4b5fd",
    skills: [
      { name: "TypeScript", level: 90 },
      { name: "React / Next.js", level: 88 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Three.js / R3F", level: 75 },
    ],
  },
  {
    name: "Dados & Infra",
    accent: "#06b6d4",
    accentRgb: "6,182,212",
    barFill: "linear-gradient(90deg, #06b6d4, #22d3ee)",
    textAccent: "#67e8f9",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "Redis", level: 80 },
      { name: "Docker", level: 85 },
      { name: "AWS", level: 75 },
      { name: "MongoDB", level: 65 },
    ],
  },
  {
    name: "Qualidade & IA",
    accent: "#f43f5e",
    accentRgb: "244,63,94",
    barFill: "linear-gradient(90deg, #f43f5e, #fb7185)",
    textAccent: "#fda4af",
    skills: [
      { name: "Clean Architecture", level: 90 },
      { name: "LangChain / LangGraph", level: 82 },
      { name: "LLMs / MCP / Agents", level: 80 },
      { name: "RAG / GraphRAG", level: 78 },
      { name: "LangFuse", level: 72 },
      { name: "Git / CI/CD", level: 90 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// Scroll reveal hook
// ═══════════════════════════════════════════════════════════════

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ═══════════════════════════════════════════════════════════════
// Skill row inside a card
// ═══════════════════════════════════════════════════════════════

function SkillRow({
  skill,
  cat,
  index,
  visible,
}: {
  skill: Skill;
  cat: Category;
  index: number;
  visible: boolean;
}) {
  return (
    <div className="group/skill flex items-center gap-3">
      {/* Dot */}
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full transition-shadow duration-500"
        style={{
          background: cat.accent,
          boxShadow: visible
            ? `0 0 6px ${cat.accent}80`
            : "none",
          transitionDelay: `${index * 80 + 300}ms`,
        }}
      />

      {/* Name */}
      <span className="w-28 shrink-0 text-xs text-foreground/70 transition-colors group-hover/skill:text-foreground/90">
        {skill.name}
      </span>

      {/* Bar track */}
      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
        {/* Bar fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${skill.level}%` : "0%",
            background: cat.barFill,
            boxShadow: visible
              ? `0 0 8px ${cat.accent}60`
              : "none",
            transitionDelay: `${index * 100 + 400}ms`,
          }}
        />
      </div>

      {/* Percent */}
      <span
        className="w-8 text-right font-mono text-[10px] tabular-nums transition-opacity"
        style={{
          color: cat.textAccent,
          opacity: visible ? 1 : 0,
          transitionDelay: `${index * 100 + 500}ms`,
        }}
      >
        {skill.level}%
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Bento Card
// ═══════════════════════════════════════════════════════════════

function BentoCard({
  cat,
  visible,
  delay,
}: {
  cat: Category;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className="group/card relative overflow-hidden rounded-2xl border transition-all duration-700 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: visible
          ? `0 0 0 1px rgba(255,255,255,0.03), 0 12px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`
          : "none",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        e.currentTarget.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-700 group-hover/card:opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${cat.accent} 50%, transparent 100%)`,
          opacity: 0.4,
        }}
      />

      {/* Background glow blob */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover/card:opacity-20"
        style={{ background: cat.accent }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-white/10 transition-all duration-500 group-hover/card:scale-110"
            style={{ background: `rgba(${cat.accentRgb},0.1)` }}
          >
            <span
              className="font-mono text-sm font-bold"
              style={{ color: cat.accent }}
            >
              {cat.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3
              className="font-mono text-xs font-bold uppercase tracking-widest"
              style={{ color: cat.accent }}
            >
              {cat.name}
            </h3>
            <p className="text-[10px] text-muted/50">
              {cat.skills.length} tecnologias
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-3">
          {cat.skills.map((skill, i) => (
            <SkillRow
              key={skill.name}
              skill={skill}
              cat={cat}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Skills component
// ═══════════════════════════════════════════════════════════════

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full py-28 md:py-36 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Competências
            </span>
          </div>

          <h2 className="mb-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Stack{" "}
            <span
              className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent"
              style={{
                filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))",
              }}
            >
              Técnico
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Tecnologias e ferramentas que domino — construídas ao longo de{" "}
            <span className="text-foreground">6+ anos</span> desenvolvendo
            sistemas de alta performance.
          </p>

          {/* Decorative line */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="h-1 w-1 rounded-full bg-accent" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {/* Backend — spans 2 cols on md+ */}
          <div className="md:col-span-2">
            <BentoCard cat={CATEGORIES[0]} visible={visible} delay={0} />
          </div>

          {/* Frontend */}
          <div>
            <BentoCard cat={CATEGORIES[1]} visible={visible} delay={150} />
          </div>

          {/* Dados & Infra */}
          <div>
            <BentoCard cat={CATEGORIES[2]} visible={visible} delay={300} />
          </div>

          {/* Qualidade & IA — spans 2 cols on md+ */}
          <div className="md:col-span-2">
            <BentoCard cat={CATEGORIES[3]} visible={visible} delay={450} />
          </div>
        </div>
      </div>
    </section>
  );
}
