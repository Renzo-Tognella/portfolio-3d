"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactElement,
} from "react";
import { SKILL_CATEGORIES } from "@/data/skills";
import type { Skill, SkillCategory } from "@/data/skills";

const ACCENT_META: Record<
  SkillCategory["accent"],
  {
    text: string;
    textStrong: string;
    bgSoft: string;
    bgGlow: string;
    borderGlow: string;
    barGradient: string;
    barGlow: string;
    iconBg: string;
    stroke: string;
  }
> = {
  indigo: {
    text: "text-indigo-300",
    textStrong: "text-indigo-400",
    bgSoft: "bg-indigo-500/[0.06]",
    bgGlow: "rgba(99,102,241,0.12)",
    borderGlow: "rgba(99,102,241,0.25)",
    barGradient: "linear-gradient(90deg, #6366f1 0%, #818cf8 60%, #a5b4fc 100%)",
    barGlow: "0 0 12px rgba(99,102,241,0.45), 0 0 4px rgba(99,102,241,0.3)",
    iconBg: "bg-indigo-500/10",
    stroke: "#818cf8",
  },
  violet: {
    text: "text-violet-300",
    textStrong: "text-violet-400",
    bgSoft: "bg-violet-500/[0.06]",
    bgGlow: "rgba(139,92,246,0.12)",
    borderGlow: "rgba(139,92,246,0.25)",
    barGradient: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 60%, #c4b5fd 100%)",
    barGlow: "0 0 12px rgba(139,92,246,0.45), 0 0 4px rgba(139,92,246,0.3)",
    iconBg: "bg-violet-500/10",
    stroke: "#a78bfa",
  },
  cyan: {
    text: "text-cyan-300",
    textStrong: "text-cyan-400",
    bgSoft: "bg-cyan-500/[0.06]",
    bgGlow: "rgba(6,182,212,0.12)",
    borderGlow: "rgba(6,182,212,0.25)",
    barGradient: "linear-gradient(90deg, #06b6d4 0%, #22d3ee 60%, #67e8f9 100%)",
    barGlow: "0 0 12px rgba(6,182,212,0.45), 0 0 4px rgba(6,182,212,0.3)",
    iconBg: "bg-cyan-500/10",
    stroke: "#22d3ee",
  },
  amber: {
    text: "text-amber-300",
    textStrong: "text-amber-400",
    bgSoft: "bg-amber-500/[0.06]",
    bgGlow: "rgba(245,158,11,0.12)",
    borderGlow: "rgba(245,158,11,0.25)",
    barGradient: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #fcd34d 100%)",
    barGlow: "0 0 12px rgba(245,158,11,0.45), 0 0 4px rgba(245,158,11,0.3)",
    iconBg: "bg-amber-500/10",
    stroke: "#fbbf24",
  },
  rose: {
    text: "text-rose-300",
    textStrong: "text-rose-400",
    bgSoft: "bg-rose-500/[0.06]",
    bgGlow: "rgba(244,63,94,0.12)",
    borderGlow: "rgba(244,63,94,0.25)",
    barGradient: "linear-gradient(90deg, #f43f5e 0%, #fb7185 60%, #fda4af 100%)",
    barGlow: "0 0 12px rgba(244,63,94,0.45), 0 0 4px rgba(244,63,94,0.3)",
    iconBg: "bg-rose-500/10",
    stroke: "#fb7185",
  },
};

/* ────────────────────────────────────────────
   Icons
   ──────────────────────────────────────────── */

function BackendIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" style={{ color: stroke }}>
      <rect x="2" y="3" width="20" height="8" rx="2" />
      <rect x="2" y="13" width="20" height="8" rx="2" />
      <circle cx="6" cy="7" r="1" fill="currentColor" />
      <circle cx="6" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function DatabaseIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" style={{ color: stroke }}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function QualityIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" style={{ color: stroke }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function FrontendIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" style={{ color: stroke }}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m7 8 3 3-3 3" />
      <path d="m13 8 3 3-3 3" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, (props: { stroke: string }) => ReactElement> = {
  Backend: BackendIcon,
  Frontend: FrontendIcon,
  "Dados & Infra": DatabaseIcon,
  "Qualidade & IA": QualityIcon,
};

/* ────────────────────────────────────────────
   SkillBar — premium gradient glow bar
   ──────────────────────────────────────────── */

function SkillBar({
  skill,
  meta,
  index,
  visible,
}: {
  skill: Skill;
  meta: (typeof ACCENT_META)[keyof typeof ACCENT_META];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="skill-bar-row group/skill"
      style={{ "--stagger": `${index * 100}ms` } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground/80 transition-colors group-hover/skill:text-foreground">
          {skill.name}
        </span>
        <span
          className={`font-mono text-xs font-semibold tabular-nums transition-colors ${meta.textStrong}`}
          style={{ textShadow: hovered ? `0 0 8px ${meta.bgGlow}` : "none" }}
        >
          {skill.level}%
        </span>
      </div>

      {/* Track */}
      <div className="skill-bar-track relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
        {/* Fill */}
        <div
          className="skill-bar-fill absolute inset-y-0 left-0 rounded-full"
          style={{
            width: visible ? `${skill.level}%` : "0%",
            background: meta.barGradient,
            boxShadow: visible ? meta.barGlow : "none",
            transitionDelay: visible ? `${index * 100 + 300}ms` : "0ms",
          }}
        />
        {/* Shimmer shine */}
        <div
          className="skill-bar-shimmer absolute inset-y-0 w-1/3 rounded-full opacity-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            left: visible ? `${skill.level - 35}%` : "-35%",
            transition: visible
              ? `left 1200ms cubic-bezier(0.215, 0.61, 0.355, 1) ${index * 100 + 500}ms, opacity 400ms ease ${index * 100 + 500}ms`
              : "none",
            opacity: visible ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   SkillCard — large glassmorphic card
   ──────────────────────────────────────────── */

function SkillCard({
  cat,
  index,
  visible,
  setRef,
}: {
  cat: SkillCategory;
  index: number;
  visible: boolean;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const meta = ACCENT_META[cat.accent];
  const Icon = CATEGORY_ICONS[cat.name];

  return (
    <div
      ref={setRef}
      className={`skill-card-premium group relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-700 ${
        visible ? "is-visible" : ""
      }`}
      style={{
        "--stagger": `${index * 180}ms`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        borderColor: meta.borderGlow,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 24px 48px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
      } as React.CSSProperties}
    >
      {/* Top accent glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${meta.stroke} 50%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
        style={{ background: meta.stroke }}
      />

      <div className="relative z-10 flex flex-1 flex-col p-8 md:p-10">
        {/* Header */}
        <div className="skill-card-header mb-8 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.iconBg} ring-1 ring-white/10 transition-all duration-500 group-hover:scale-110 group-hover:ring-white/20`}
          >
            {Icon && <Icon stroke={meta.stroke} />}
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-widest text-foreground">
              {cat.name}
            </h3>
            <p className={`mt-0.5 text-xs font-medium ${meta.text}`}>
              {cat.skills.length} tecnologias
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-1 flex-col justify-center gap-4">
          {cat.skills.map((skill, skillIdx) => (
            <SkillBar
              key={skill.name}
              skill={skill}
              meta={meta}
              index={skillIdx}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Main Skills component
   ─────────────────────────────────────────────────────────── */

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);

  /* Intersection Observer */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full py-28 md:py-36"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
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
              style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))" }}
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

        {/* Grid — 4 columns on xl, 2 on md, 1 on mobile */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SKILL_CATEGORIES.map((cat, catIdx) => (
            <SkillCard
              key={cat.name}
              cat={cat}
              index={catIdx}
              visible={visible}
              setRef={setCardRef(catIdx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
