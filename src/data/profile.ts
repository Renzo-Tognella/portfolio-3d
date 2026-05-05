// ═══════════════════════════════════════════════════════════════
// Single source of truth for personal profile data — imported by:
//   About.tsx, Contact.tsx, layout.tsx, MonitorCanvas.ts
// ═══════════════════════════════════════════════════════════════

export const PROFILE = {
  name: "Renzo Tognella de Rosa",
  role: "Backend Software Engineer",
  company: "Tradener",
  location: "Curitiba, PR — Brasil",
  education: "Sistemas de Informação, UTFPR (Jul/2027)",
  email: "renzo.tognella@gmail.com",
  github: "https://github.com/Renzo-Tognella",
  linkedin: "https://linkedin.com/in/renzotognella",
  tagline: "Construindo sistemas que escalam",
  bio: "Backend Software Engineer no setor energético, construindo sistemas de faturamento e gestão de risco que processam milhões em transações. Pesquisador publicado no IEEE em visão computacional. Acredito que engenharia de qualidade começa com requisitos claros, código testável e documentação que importa.",
  focus: "Sistemas distribuídos, APIs, gestão de risco energético",
  research: "IEEE LARS/SBR 2023 — 3D Estimation with Kinect",
  freelance: "Modulus Engenharia — SaaS Platform",
};

export const STATS = [
  { value: 3, suffix: "+", label: "anos de experiência" },
  { value: 50, suffix: "+", label: "propostas/dia (Modulus)" },
  { value: 1, suffix: "", label: "publicação IEEE" },
  { value: 3, suffix: "", label: "meses como lead interino" },
];

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  tags: string[];
}

export const TIMELINE: TimelineEntry[] = [
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
