// ═══════════════════════════════════════════════════════════════
// Single source of truth for skills — imported by:
//   Skills.tsx, MonitorCanvas.ts, Scene3D.tsx (books)
// ═══════════════════════════════════════════════════════════════

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface SkillCategory {
  name: string;
  accent: "indigo" | "cyan" | "amber" | "rose" | "violet";
  color: string;    // hex
  barBg: string;    // rgba
  barFill: string;  // hex
  textColor: string; // hex
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Backend",
    accent: "indigo",
    color: "#6366f1",
    barBg: "rgba(99,102,241,0.18)",
    barFill: "#6366f1",
    textColor: "#a5b4fc",
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
    color: "#8b5cf6",
    barBg: "rgba(139,92,246,0.18)",
    barFill: "#8b5cf6",
    textColor: "#c4b5fd",
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
    color: "#06b6d4",
    barBg: "rgba(6,182,212,0.18)",
    barFill: "#06b6d4",
    textColor: "#67e8f9",
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
    color: "#f43f5e",
    barBg: "rgba(244,63,94,0.18)",
    barFill: "#f43f5e",
    textColor: "#fda4af",
    skills: [
      { name: "Clean Architecture", level: 90 },
      { name: "SOLID / Design Patterns", level: 85 },
      { name: "LLMs / MCP / Agents", level: 80 },
      { name: "Git / CI/CD", level: 90 },
      { name: "C++ / Computer Vision", level: 70 },
    ],
  },
];

// Flattened skills for drawer/book labels
export const ALL_SKILLS = SKILL_CATEGORIES.flatMap((cat) =>
  cat.skills.map((s) => ({ ...s, category: cat.name, color: cat.color }))
);
