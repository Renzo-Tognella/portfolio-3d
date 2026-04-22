"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactElement,
} from "react";

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

interface Skill {
  name: string;
  level: number; // 0-100
}

interface Category {
  name: string;
  accent: "indigo" | "cyan" | "amber" | "rose";
  skills: Skill[];
}

const SKILL_CATEGORIES: Category[] = [
  {
    name: "Frontend",
    accent: "indigo",
    skills: [
      { name: "TypeScript", level: 90 },
      { name: "React", level: 95 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 80 },
      { name: "Three.js", level: 65 },
    ],
  },
  {
    name: "Backend",
    accent: "cyan",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Python", level: 85 },
      { name: "SQL", level: 80 },
      { name: "PostgreSQL", level: 75 },
      { name: "REST", level: 90 },
      { name: "GraphQL", level: 70 },
    ],
  },
  {
    name: "DevOps",
    accent: "amber",
    skills: [
      { name: "AWS", level: 80 },
      { name: "Docker", level: 90 },
      { name: "Kubernetes", level: 70 },
      { name: "CI/CD", level: 85 },
      { name: "Terraform", level: 65 },
    ],
  },
  {
    name: "Tools",
    accent: "rose",
    skills: [
      { name: "Git", level: 95 },
      { name: "Linux", level: 85 },
      { name: "Neovim", level: 80 },
      { name: "Figma", level: 60 },
      { name: "Blender", level: 50 },
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
  },
  cyan: {
    strip: "bg-cyan-500",
    barBg: "bg-cyan-500/15",
    barFill: "bg-cyan-500",
    text: "text-cyan-400",
    stroke: "#06b6d4",
  },
  amber: {
    strip: "bg-amber-500",
    barBg: "bg-amber-500/15",
    barFill: "bg-amber-500",
    text: "text-amber-400",
    stroke: "#f59e0b",
  },
  rose: {
    strip: "bg-rose-500",
    barBg: "bg-rose-500/15",
    barFill: "bg-rose-500",
    text: "text-rose-400",
    stroke: "#f43f5e",
  },
} as const;

/* ────────────────────────────────────────────
   SVG Icons — paths designed for stroke-dashoffset draw-on
   ──────────────────────────────────────────── */

function FrontendIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="skill-svg h-7 w-7"
      style={{ color: stroke }}
    >
      <polyline className="skill-svg-path" points="16 18 22 12 16 6" />
      <polyline className="skill-svg-path" points="8 6 2 12 8 18" />
    </svg>
  );
}

function BackendIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="skill-svg h-7 w-7"
      style={{ color: stroke }}
    >
      <rect className="skill-svg-path" x="2" y="2" width="20" height="8" rx="2" />
      <rect className="skill-svg-path" x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function DevOpsIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="skill-svg h-7 w-7"
      style={{ color: stroke }}
    >
      <path
        className="skill-svg-path"
        d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
      />
    </svg>
  );
}

function ToolsIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="skill-svg h-7 w-7"
      style={{ color: stroke }}
    >
      <path
        className="skill-svg-path"
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, (props: { stroke: string }) => ReactElement> = {
  Frontend: FrontendIcon,
  Backend: BackendIcon,
  DevOps: DevOpsIcon,
  Tools: ToolsIcon,
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

  /* ── Intersection Observer: reveal section once ── */
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

  /* ── Initialise SVG stroke-dasharray once paths mount ── */
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

    // Force reflow, then trigger transitions on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          card.querySelectorAll<SVGPathElement>(".skill-svg-path").forEach((path) => {
            path.style.transition =
              "stroke-dashoffset 800ms cubic-bezier(0.215, 0.61, 0.355, 1)";
            path.style.strokeDashoffset = "0";
          });
        });
      });
    });
  }, [visible]);

  /* ── Mouse parallax handler ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / (rect.width / 2)) * 4; // max ±4px
      const dy = ((e.clientY - cy) / (rect.height / 2)) * 4;
      card.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [],
  );

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translate(0, 0)";
  }, []);

  /* ── setCardRef helper ── */
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
      className="mx-auto max-w-6xl px-6 py-24"
    >
      {/* ── heading ── */}
      <div className="mb-14">
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-accent">
          Skills &amp; Technologies
        </h2>
        <div className="relative mb-3 h-[3px] w-48 overflow-hidden rounded-full bg-surface">
          <div className="animate-shimmer absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
        </div>
        <p className="max-w-md text-sm text-muted">
          Tecnologias e ferramentas que uso no dia-a-dia.
        </p>
      </div>

      {/* ── 2×2 constellation grid ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {SKILL_CATEGORIES.map((cat, catIdx) => {
          const colors = ACCENT_COLORS[cat.accent];
          const Icon = CATEGORY_ICONS[cat.name];

          return (
            <div
              key={cat.name}
              ref={setCardRef(catIdx)}
              className={`skill-card group/card relative overflow-hidden rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-xl transition-transform duration-300 ease-out ${
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
                {/* category header with SVG icon + name */}
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
