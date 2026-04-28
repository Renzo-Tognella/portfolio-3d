"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactElement,
} from "react";

/* ────────────────────────────────────────────
   Data — Real skills from resume
   ──────────────────────────────────────────── */

interface Skill {
  name: string;
  level: number; // 0-100
}

interface Category {
  name: string;
  accent: "indigo" | "cyan" | "amber" | "rose" | "violet";
  skills: Skill[];
}

const SKILL_CATEGORIES: Category[] = [
  {
    name: "Backend",
    accent: "indigo",
    skills: [
      { name: "Ruby on Rails", level: 95 },
      { name: "Python", level: 85 },
      { name: "Java / Spring", level: 70 },
      { name: "REST APIs / GraphQL", level: 90 },
      { name: "RSpec / TDD", level: 85 },
    ],
  },
  {
    name: "Frontend",
    accent: "violet",
    skills: [
      { name: "React / Next.js", level: 88 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Three.js / R3F", level: 75 },
    ],
  },
  {
    name: "Dados & Infra",
    accent: "cyan",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "Redis", level: 80 },
      { name: "MongoDB", level: 65 },
      { name: "Docker", level: 85 },
      { name: "AWS", level: 75 },
    ],
  },
  {
    name: "Qualidade & IA",
    accent: "rose",
    skills: [
      { name: "Clean Architecture", level: 90 },
      { name: "SOLID / Design Patterns", level: 85 },
      { name: "LLMs / MCP / Agents", level: 80 },
      { name: "Git / CI/CD", level: 90 },
      { name: "C++ / Computer Vision", level: 70 },
    ],
  },
];

/* ── Tailwind colour maps per accent ── */
const ACCENT_COLORS = {
  indigo: {
    strip: "bg-indigo-500",
    barBg: "bg-indigo-500/15",
    barFill: "bg-indigo-500",
    text: "text-indigo-400",
    stroke: "#6366f1",
    glow: "shadow-indigo-500/20",
  },
  violet: {
    strip: "bg-violet-500",
    barBg: "bg-violet-500/15",
    barFill: "bg-violet-500",
    text: "text-violet-400",
    stroke: "#8b5cf6",
    glow: "shadow-violet-500/20",
  },
  cyan: {
    strip: "bg-cyan-500",
    barBg: "bg-cyan-500/15",
    barFill: "bg-cyan-500",
    text: "text-cyan-400",
    stroke: "#06b6d4",
    glow: "shadow-cyan-500/20",
  },
  amber: {
    strip: "bg-amber-500",
    barBg: "bg-amber-500/15",
    barFill: "bg-amber-500",
    text: "text-amber-400",
    stroke: "#f59e0b",
    glow: "shadow-amber-500/20",
  },
  rose: {
    strip: "bg-rose-500",
    barBg: "bg-rose-500/15",
    barFill: "bg-rose-500",
    text: "text-rose-400",
    stroke: "#f43f5e",
    glow: "shadow-rose-500/20",
  },
} as const;

/* ────────────────────────────────────────────
   SVG Icons — stroke-dashoffset draw-on
   ──────────────────────────────────────────── */

function BackendIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="skill-svg h-7 w-7" style={{ color: stroke }}>
      <rect className="skill-svg-path" x="2" y="2" width="20" height="8" rx="2" />
      <rect className="skill-svg-path" x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function DatabaseIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="skill-svg h-7 w-7" style={{ color: stroke }}>
      <ellipse className="skill-svg-path" cx="12" cy="5" rx="9" ry="3" />
      <path className="skill-svg-path" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path className="skill-svg-path" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function InfraIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="skill-svg h-7 w-7" style={{ color: stroke }}>
      <path className="skill-svg-path" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function QualityIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="skill-svg h-7 w-7" style={{ color: stroke }}>
      <path className="skill-svg-path" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path className="skill-svg-path" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function FrontendIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="skill-svg h-7 w-7" style={{ color: stroke }}>
      <rect className="skill-svg-path" x="2" y="3" width="20" height="14" rx="2" />
      <path className="skill-svg-path" d="M8 21h8" />
      <path className="skill-svg-path" d="M12 17v4" />
      <path className="skill-svg-path" d="m7 8 3 3-3 3" />
      <path className="skill-svg-path" d="m13 8 3 3-3 3" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, (props: { stroke: string }) => ReactElement> = {
  "Backend": BackendIcon,
  "Frontend": FrontendIcon,
  "Dados & Infra": DatabaseIcon,
  "Qualidade & IA": QualityIcon,
};

/* ────────────────────────────────────────────
   SkillBar sub-component
   ──────────────────────────────────────────── */

function SkillBar({
  skill,
  colors,
  index,
  visible,
}: {
  skill: Skill;
  colors: (typeof ACCENT_COLORS)[keyof typeof ACCENT_COLORS];
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="skill-bar-row"
      style={{ "--stagger": `${index * 80}ms` } as React.CSSProperties}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-xs text-foreground/80">{skill.name}</span>
        <span className={`font-mono text-[10px] ${colors.text}`}>{skill.level}%</span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${colors.barBg}`}>
        <div
          className={`skill-bar-fill h-full rounded-full ${colors.barFill} transition-none`}
          style={{
            width: visible ? `${skill.level}%` : "0%",
            transitionDelay: visible ? `${index * 80}ms` : "0ms",
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Skills component
   ──────────────────────────────────────────── */

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);

  /* ── Intersection Observer ── */
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
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── SVG stroke-dasharray draw-on ── */
  useEffect(() => {
    if (!visible) return;

    cardRefs.current.forEach((card) => {
      if (!card) return;
      card.querySelectorAll<SVGPathElement>(".skill-svg-path").forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          card.querySelectorAll<SVGPathElement>(".skill-svg-path").forEach((path) => {
            path.style.transition = "stroke-dashoffset 800ms cubic-bezier(0.215, 0.61, 0.355, 1)";
            path.style.strokeDashoffset = "0";
          });
        });
      });
    });
  }, [visible]);

  /* ── Mouse parallax ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / (rect.width / 2)) * 4;
      const dy = ((e.clientY - cy) / (rect.height / 2)) * 4;
      card.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [],
  );

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translate(0, 0)";
  }, []);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    [],
  );

  return (
    <section ref={sectionRef} id="skills" className="mx-auto max-w-6xl px-6 py-24">
      {/* —— heading —— */}
      <div className="mb-14">
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-accent">
          Skills
        </h2>
        <div className="relative mb-3 h-[3px] w-48 overflow-hidden rounded-full bg-surface">
          <div className="animate-shimmer absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
        </div>
        <p className="max-w-lg text-sm text-muted">
          Stack técnico e competências desenvolvidas ao longo de 6+ anos construindo sistemas de alta performance.
        </p>
      </div>

      {/* —— 2×2 constellation grid —— */}
      <div className="grid gap-5 sm:grid-cols-2">
        {SKILL_CATEGORIES.map((cat, catIdx) => {
          const colors = ACCENT_COLORS[cat.accent];
          const Icon = CATEGORY_ICONS[cat.name];

          return (
            <div
              key={cat.name}
              ref={setCardRef(catIdx)}
              className={`skill-card group/card relative overflow-hidden rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-lg ${colors.glow} ${
                visible ? "is-visible" : ""
              }`}
              style={{
                "--stagger": `${catIdx * 200}ms`,
              } as React.CSSProperties}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* accent strip */}
              <div className={`h-1 w-full ${colors.strip}`} />

              <div className="p-6">
                {/* category header */}
                <div className="skill-card-title mb-6 flex items-center gap-3">
                  <span className={colors.text}>
                    {Icon && <Icon stroke={colors.stroke} />}
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {cat.name}
                  </h3>
                </div>

                {/* skill bars */}
                <div className="flex flex-col gap-3">
                  {cat.skills.map((skill, skillIdx) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      colors={colors}
                      index={skillIdx}
                      visible={visible}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
