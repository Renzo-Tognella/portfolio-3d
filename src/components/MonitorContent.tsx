"use client";

import { useMemo } from "react";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface MonitorContentProps {
  scrollProgress: number; // 0 → 1
}

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillCategory {
  name: string;
  accent: {
    color: string;
    bg: string;
    barBg: string;
    barFill: string;
    text: string;
  };
  skills: Skill[];
  icon: React.ReactNode;
}

interface Project {
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  accentBorder: string;
  tech: string[];
  techDots: string[];
}

/* ────────────────────────────────────────────
   Data — mirroring Skills.tsx & Projects.tsx
   ──────────────────────────────────────────── */

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Backend",
    accent: {
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
      barBg: "rgba(99,102,241,0.18)",
      barFill: "#6366f1",
      text: "#a5b4fc",
    },
    skills: [
      { name: "Ruby on Rails", level: 95 },
      { name: "Python", level: 85 },
      { name: "Java", level: 70 },
      { name: "REST APIs", level: 95 },
      { name: "RSpec / TDD", level: 85 },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0" style={{ color: "#6366f1" }}>
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Bancos de Dados",
    accent: {
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.12)",
      barBg: "rgba(6,182,212,0.18)",
      barFill: "#06b6d4",
      text: "#67e8f9",
    },
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "Redis", level: 80 },
      { name: "MongoDB", level: 65 },
      { name: "SQL Avançado", level: 85 },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0" style={{ color: "#06b6d4" }}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    name: "Infraestrutura",
    accent: {
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
      barBg: "rgba(245,158,11,0.18)",
      barFill: "#f59e0b",
      text: "#fcd34d",
    },
    skills: [
      { name: "Docker", level: 85 },
      { name: "AWS", level: 75 },
      { name: "Git", level: 90 },
      { name: "CI/CD", level: 80 },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0" style={{ color: "#f59e0b" }}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  },
  {
    name: "Qualidade & IA",
    accent: {
      color: "#f43f5e",
      bg: "rgba(244,63,94,0.12)",
      barBg: "rgba(244,63,94,0.18)",
      barFill: "#f43f5e",
      text: "#fda4af",
    },
    skills: [
      { name: "Clean Architecture", level: 90 },
      { name: "SOLID / Design Patterns", level: 85 },
      { name: "LLMs / MCP", level: 80 },
      { name: "C++ / Computer Vision", level: 70 },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0" style={{ color: "#f43f5e" }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Tradener",
    subtitle: "Sistema de Faturamento & Gestão de Risco",
    accent: "#818cf8",
    accentBorder: "#818cf8",
    tech: ["Rails", "PostgreSQL", "Redis", "Docker"],
    techDots: ["bg-indigo-400", "bg-indigo-400", "bg-indigo-400", "bg-indigo-400"],
  },
  {
    number: "02",
    title: "Modulus",
    subtitle: "Plataforma SaaS para Engenharia",
    accent: "#34d399",
    accentBorder: "#34d399",
    tech: ["Rails", "Python", "LLMs", "PostgreSQL"],
    techDots: ["bg-emerald-400", "bg-emerald-400", "bg-emerald-400", "bg-emerald-400"],
  },
  {
    number: "03",
    title: "IEEE Research",
    subtitle: "Estimação 3D com Kinect RGB-D",
    accent: "#fbbf24",
    accentBorder: "#fbbf24",
    tech: ["C++", "Python", "Computer Vision", "NLP"],
    techDots: ["bg-amber-400", "bg-amber-400", "bg-amber-400", "bg-amber-400"],
  },
];

/* ────────────────────────────────────────────
   Helpers — crossfade opacity curves
   ──────────────────────────────────────────── */

/**
 * Returns 0→1 over a crossfade window.
 * fadeIn:  full opacity after this point
 * fadeOut: full opacity before this point
 */
function crossfade(t: number, fadeIn: number, fadeOut: number): number {
  const ramp = 0.1; // transition width
  if (t < fadeIn) return Math.max(0, (t - (fadeIn - ramp)) / ramp);
  if (t > fadeOut) return Math.max(0, 1 - (t - fadeOut) / ramp);
  return 1;
}

/* ────────────────────────────────────────────
   Screen 1 — About
   ──────────────────────────────────────────── */

function AboutScreen({ opacity }: { opacity: number }) {
  const statCards = [
    { label: "3+", sub: "anos exp" },
    { label: "50+", sub: "prop/dia" },
    { label: "IEEE", sub: "LARS/SBR" },
  ];

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-700"
      style={{ opacity, pointerEvents: opacity > 0.05 ? "auto" : "none" }}
    >
      {/* Title */}
      <h1
        className="font-mono text-3xl font-bold tracking-tight"
        style={{ color: "#818cf8" }}
      >
        Sobre
      </h1>

      {/* Subtitle */}
      <p
        className="mt-2 font-mono text-sm"
        style={{ color: "#94a3b8" }}
      >
        Backend Software Engineer
      </p>

      {/* Stat cards */}
      <div className="mt-6 flex gap-3">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-lg px-4 py-3"
            style={{ background: "#161b22", minWidth: 72 }}
          >
            <span className="font-mono text-base font-bold" style={{ color: "#818cf8" }}>
              {card.label}
            </span>
            <span className="font-mono text-[10px]" style={{ color: "#6b7280" }}>
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Code-line decorations */}
      <div className="mt-5 flex flex-col items-center gap-1.5">
        {["rgba(129,140,248,0.15)", "rgba(129,140,248,0.12)", "rgba(129,140,248,0.09)"].map(
          (color, i) => (
            <div
              key={i}
              className="h-[2px] rounded-full"
              style={{
                background: color,
                width: `${100 + Math.sin(i * 2) * 30}px`,
              }}
            />
          )
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Screen 2 — Skills Dashboard
   ──────────────────────────────────────────── */

function SkillBar({
  skill,
  accent,
  visible,
}: {
  skill: Skill;
  accent: SkillCategory["accent"];
  visible: boolean;
}) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="mb-0.5 flex items-center justify-between">
        <span className="font-mono text-[10px] leading-tight" style={{ color: "#e2e8f0" }}>
          {skill.name}
        </span>
        <span className="font-mono text-[9px]" style={{ color: accent.text }}>
          {skill.level}%
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: accent.barBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${skill.level}%` : "0%",
            background: accent.barFill,
          }}
        />
      </div>
    </div>
  );
}

function SkillsDashboard({ opacity }: { opacity: number }) {
  const visible = opacity > 0.3; // trigger bar animations once visible enough

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center px-5 py-4 transition-all duration-700"
      style={{ opacity, pointerEvents: opacity > 0.05 ? "auto" : "none" }}
    >
      {/* Header */}
      <h2
        className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#818cf8" }}
      >
        Skills &amp; Technologies
      </h2>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="overflow-hidden rounded-lg"
            style={{ background: "#1e1e2e", border: "1px solid rgba(51,65,85,0.5)" }}
          >
            {/* Accent strip */}
            <div className="h-[3px] w-full" style={{ background: cat.accent.color }} />

            <div className="p-2.5">
              {/* Category header */}
              <div className="mb-2 flex items-center gap-1.5">
                {cat.icon}
                <h3
                  className="font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "#e2e8f0" }}
                >
                  {cat.name}
                </h3>
              </div>

              {/* Skill bars */}
              {cat.skills.map((skill) => (
                <SkillBar
                  key={skill.name}
                  skill={skill}
                  accent={cat.accent}
                  visible={visible}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Screen 3 — Project Windows
   ──────────────────────────────────────────── */

function ProjectWindows({ opacity }: { opacity: number }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center gap-2.5 px-5 py-4 transition-all duration-700"
      style={{ opacity, pointerEvents: opacity > 0.05 ? "auto" : "none" }}
    >
      {/* Header */}
      <h2
        className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#818cf8" }}
      >
        Projects
      </h2>

      {PROJECTS.map((proj) => (
        <div
          key={proj.number}
          className="relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 transition-all duration-700"
          style={{
            background: "#1e1e2e",
            border: "1px solid rgba(51,65,85,0.4)",
            borderLeft: `2px solid ${proj.accentBorder}`,
          }}
        >
          {/* Project number (faded large text) */}
          <span
            className="font-mono text-xl font-bold leading-none"
            style={{
              color: proj.accent,
              opacity: 0.15,
              minWidth: 28,
            }}
          >
            {proj.number}
          </span>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Title */}
            <h3 className="font-mono text-xs font-bold leading-tight" style={{ color: "#e2e8f0" }}>
              {proj.title}
            </h3>
            {/* Subtitle */}
            <p
              className="font-mono text-[9px] leading-tight"
              style={{ color: proj.accent }}
            >
              {proj.subtitle}
            </p>
            {/* Tech pills */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {proj.tech.map((t, i) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[8px]"
                  style={{
                    background: "rgba(15,15,25,0.6)",
                    border: "1px solid rgba(51,65,85,0.5)",
                    color: "#94a3b8",
                  }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: proj.accent, opacity: 0.7 }}
                  />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Component — MonitorContent
   ──────────────────────────────────────────── */

export function MonitorContent({ scrollProgress }: MonitorContentProps) {
  const opacity1 = useMemo(() => crossfade(scrollProgress, 0.0, 0.35), [scrollProgress]);
  const opacity2 = useMemo(() => crossfade(scrollProgress, 0.25, 0.65), [scrollProgress]);
  const opacity3 = useMemo(() => crossfade(scrollProgress, 0.55, 1.0), [scrollProgress]);

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden"
      style={{
        background: "#0a0a0f",
        fontFamily: "var(--font-mono), 'Geist Mono', monospace",
      }}
    >
      {/* Subtle scanlines overlay for the CRT feel */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Screen 1: About */}
      <AboutScreen opacity={opacity1} />

      {/* Screen 2: Skills Dashboard */}
      <SkillsDashboard opacity={opacity2} />

      {/* Screen 3: Project Windows */}
      <ProjectWindows opacity={opacity3} />

      {/* Bottom status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-1.5"
        style={{ borderTop: "1px solid rgba(51,65,85,0.3)", background: "rgba(10,10,15,0.8)" }}
      >
        <span className="font-mono text-[9px]" style={{ color: "#4b5563" }}>
          portfolio.exe
        </span>
        <span className="font-mono text-[9px]" style={{ color: "#818cf8" }}>
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
    </div>
  );
}

export default MonitorContent;
