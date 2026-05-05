// ═══════════════════════════════════════════════════════════════
// Single source of truth for projects — imported by:
//   Experiencia.tsx, MonitorCanvas.ts, Scene3D.tsx (drawers)
// ═══════════════════════════════════════════════════════════════

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tech: string[];
  accent: string;
  accentDot: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  github?: string;
  link?: string;
  linkLabel: string;
}

export const PROJECTS: Project[] = [
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
