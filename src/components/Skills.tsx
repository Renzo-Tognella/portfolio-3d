import type { ReactElement } from "react";

const SKILL_CATEGORIES = [
  {
    name: "Frontend",
    accent: "indigo" as const,
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Backend",
    accent: "cyan" as const,
    skills: ["Node.js", "Python", "SQL", "PostgreSQL", "REST", "GraphQL"],
  },
  {
    name: "DevOps",
    accent: "amber" as const,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
  },
  {
    name: "Tools",
    accent: "rose" as const,
    skills: ["Git", "Linux", "Neovim", "Figma", "Blender"],
  },
];

/* ── accent-color maps for each category ── */
const ACCENT_MAP = {
  indigo: {
    strip: "bg-indigo-500",
    border: "group-hover/card:border-indigo-500/60",
    glow: "hover:border-indigo-400 hover:shadow-[0_0_12px_rgba(99,102,241,0.35)]",
    chipBg: "bg-indigo-500/10 hover:bg-indigo-500/20",
  },
  cyan: {
    strip: "bg-cyan-500",
    border: "group-hover/card:border-cyan-500/60",
    glow: "hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]",
    chipBg: "bg-cyan-500/10 hover:bg-cyan-500/20",
  },
  amber: {
    strip: "bg-amber-500",
    border: "group-hover/card:border-amber-500/60",
    glow: "hover:border-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]",
    chipBg: "bg-amber-500/10 hover:bg-amber-500/20",
  },
  rose: {
    strip: "bg-rose-500",
    border: "group-hover/card:border-rose-500/60",
    glow: "hover:border-rose-400 hover:shadow-[0_0_12px_rgba(244,63,94,0.35)]",
    chipBg: "bg-rose-500/10 hover:bg-rose-500/20",
  },
} as const;

type AccentKey = keyof typeof ACCENT_MAP;

/* ── SVG icons (inline, zero deps) ── */
function FrontendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function BackendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function DevOpsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, () => ReactElement> = {
  Frontend: FrontendIcon,
  Backend: BackendIcon,
  DevOps: DevOpsIcon,
  Tools: ToolsIcon,
};

/* ── main component ── */
export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      {/* ── heading ── */}
      <div className="mb-14">
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-accent">
          Skills &amp; Technologies
        </h2>
        <div className="relative h-[3px] w-48 overflow-hidden rounded-full bg-surface">
          <div className="animate-shimmer absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
        </div>
      </div>

      {/* ── category grid ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SKILL_CATEGORIES.map((cat) => {
          const colors = ACCENT_MAP[cat.accent as AccentKey];
          const Icon = CATEGORY_ICONS[cat.name];

          return (
            <div
              key={cat.name}
              className="group/card relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-md transition-colors duration-300"
            >
              {/* accent colour strip */}
              <div className={`h-1 w-full ${colors.strip}`} />

              <div className="p-6">
                {/* category header */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-foreground/80">{Icon && <Icon />}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {cat.name}
                  </h3>
                </div>

                {/* skill chips */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-block rounded-lg border border-transparent px-3 py-1.5 font-mono text-xs text-foreground transition-all duration-200 hover:scale-110 ${colors.chipBg} ${colors.glow}`}
                    >
                      {skill}
                    </span>
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
