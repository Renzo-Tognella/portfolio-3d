"use client";

import { useStaticCanvasTexture } from "@/hooks/useCanvasTexture";

/* ────────────────────────────────────────────
   Types & Data — mirrored from MonitorContent.tsx
   ──────────────────────────────────────────── */

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  name: string;
  accent: {
    color: string;
    barBg: string;
    barFill: string;
    text: string;
  };
  skills: Skill[];
}

interface Project {
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  accentBorder: string;
  tech: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Backend",
    accent: {
      color: "#6366f1",
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
  },
  {
    name: "Bancos de Dados",
    accent: {
      color: "#06b6d4",
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
  },
  {
    name: "Infraestrutura",
    accent: {
      color: "#f59e0b",
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
  },
  {
    name: "Qualidade & IA",
    accent: {
      color: "#f43f5e",
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
  },
  {
    number: "02",
    title: "Modulus",
    subtitle: "Plataforma SaaS para Engenharia",
    accent: "#34d399",
    accentBorder: "#34d399",
    tech: ["Rails", "Python", "LLMs", "PostgreSQL"],
  },
  {
    number: "03",
    title: "IEEE Research",
    subtitle: "Estimação 3D com Kinect RGB-D",
    accent: "#fbbf24",
    accentBorder: "#fbbf24",
    tech: ["C++", "Python", "Computer Vision", "NLP"],
  },
];

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function crossfade(t: number, fadeIn: number, fadeOut: number): number {
  const ramp = 0.1;
  if (t < fadeIn) return Math.max(0, (t - (fadeIn - ramp)) / ramp);
  if (t > fadeOut) return Math.max(0, 1 - (t - fadeOut) / ramp);
  return 1;
}

function parseRgba(rgbaStr: string, alphaOverride?: number): string {
  // Handle "#rrggbb" or "rgba(...)"
  if (rgbaStr.startsWith("#")) {
    const r = parseInt(rgbaStr.slice(1, 3), 16);
    const g = parseInt(rgbaStr.slice(3, 5), 16);
    const b = parseInt(rgbaStr.slice(5, 7), 16);
    const a = alphaOverride ?? 1;
    return `rgba(${r},${g},${b},${a})`;
  }
  const m = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return rgbaStr;
  const a = alphaOverride ?? (m[4] ? parseFloat(m[4]) : 1);
  return `rgba(${m[1]},${m[2]},${m[3]},${a})`;
}

/* ────────────────────────────────────────────
   Draw helpers
   ──────────────────────────────────────────── */

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAboutScreen(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  opacity: number
) {
  if (opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = opacity;

  const cx = W / 2;
  const cy = H / 2;

  // Title
  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Sobre", cx, cy - 80);

  // Subtitle
  ctx.fillStyle = "#94a3b8";
  ctx.font = "20px monospace";
  ctx.fillText("Backend Software Engineer", cx, cy - 40);

  // Stat cards
  const cards = [
    { label: "3+", sub: "anos exp" },
    { label: "50+", sub: "prop/dia" },
    { label: "IEEE", sub: "LARS/SBR" },
  ];
  const cardW = 100;
  const cardH = 70;
  const gap = 16;
  const totalW = cards.length * cardW + (cards.length - 1) * gap;
  let x = cx - totalW / 2;

  for (const card of cards) {
    ctx.fillStyle = "#161b22";
    drawRoundedRect(ctx, x, cy + 10, cardW, cardH, 8);
    ctx.fill();

    ctx.fillStyle = "#818cf8";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(card.label, x + cardW / 2, cy + 35);

    ctx.fillStyle = "#6b7280";
    ctx.font = "10px monospace";
    ctx.fillText(card.sub, x + cardW / 2, cy + 58);

    x += cardW + gap;
  }

  // Code-line decorations
  const lineColors = [
    "rgba(129,140,248,0.15)",
    "rgba(129,140,248,0.12)",
    "rgba(129,140,248,0.09)",
  ];
  let lineY = cy + 100;
  for (let i = 0; i < lineColors.length; i++) {
    const lw = 100 + Math.sin(i * 2) * 30;
    ctx.fillStyle = lineColors[i];
    drawRoundedRect(ctx, cx - lw / 2, lineY, lw, 2, 1);
    ctx.fill();
    lineY += 10;
  }

  ctx.restore();
}

function drawSkillsScreen(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  opacity: number,
  scrollProgress: number
) {
  if (opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = opacity;

  const padX = 80;
  const padY = 60;
  const headerH = 40;

  // Header
  ctx.fillStyle = "#818cf8";
  ctx.font = "600 14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.letterSpacing = "0.2em";
  ctx.fillText("SKILLS & TECHNOLOGIES", padX, padY);
  ctx.letterSpacing = "0";

  // 2x2 grid
  const cols = 2;
  const rows = 2;
  const gridW = W - padX * 2;
  const gridH = H - padY - headerH - 80;
  const cellW = (gridW - 12) / cols;
  const cellH = (gridH - 12) / rows;

  const barAnim = scrollProgress > 0.3 ? Math.min(1, (scrollProgress - 0.3) / 0.1) : 0;

  for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
    const cat = SKILL_CATEGORIES[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (cellW + 12);
    const y = padY + headerH + row * (cellH + 12);

    // Card background
    ctx.fillStyle = "#1e1e2e";
    drawRoundedRect(ctx, x, y, cellW, cellH, 8);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(51,65,85,0.5)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, x, y, cellW, cellH, 8);
    ctx.stroke();

    // Accent strip
    ctx.fillStyle = cat.accent.color;
    ctx.fillRect(x + 1, y + 1, cellW - 2, 3);

    // Category header
    const contentX = x + 12;
    let contentY = y + 14;

    // Icon placeholder (small colored square)
    ctx.fillStyle = cat.accent.color;
    ctx.fillRect(contentX, contentY, 12, 12);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(cat.name.toUpperCase(), contentX + 18, contentY + 1);

    contentY += 24;

    // Skills
    for (const skill of cat.skills) {
      // Name & percent
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "10px monospace";
      ctx.fillText(skill.name, contentX, contentY);

      ctx.fillStyle = cat.accent.text;
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${skill.level}%`, x + cellW - 12, contentY);
      ctx.textAlign = "left";

      contentY += 14;

      // Bar background
      const barW = cellW - 24;
      const barH = 4;
      ctx.fillStyle = cat.accent.barBg;
      drawRoundedRect(ctx, contentX, contentY, barW, barH, 2);
      ctx.fill();

      // Bar fill
      const fillW = barW * (skill.level / 100) * barAnim;
      if (fillW > 0) {
        ctx.fillStyle = cat.accent.barFill;
        drawRoundedRect(ctx, contentX, contentY, fillW, barH, 2);
        ctx.fill();
      }

      contentY += 14;
    }
  }

  ctx.restore();
}

function drawProjectsScreen(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  opacity: number
) {
  if (opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = opacity;

  const padX = 80;
  const padY = 60;

  // Header
  ctx.fillStyle = "#818cf8";
  ctx.font = "600 14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.letterSpacing = "0.2em";
  ctx.fillText("PROJECTS", padX, padY);
  ctx.letterSpacing = "0";

  const cardW = W - padX * 2;
  const cardH = 80;
  const gap = 14;
  let y = padY + 40;

  for (const proj of PROJECTS) {
    // Card bg
    ctx.fillStyle = "#1e1e2e";
    drawRoundedRect(ctx, padX, y, cardW, cardH, 8);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(51,65,85,0.4)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, padX, y, cardW, cardH, 8);
    ctx.stroke();

    // Left accent
    ctx.fillStyle = proj.accentBorder;
    ctx.fillRect(padX, y + 1, 3, cardH - 2);

    // Number (large faded)
    ctx.fillStyle = proj.accent;
    ctx.globalAlpha = opacity * 0.15;
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(proj.number, padX + 16, y + 10);
    ctx.globalAlpha = opacity;

    // Title
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 12px monospace";
    ctx.fillText(proj.title, padX + 60, y + 14);

    // Subtitle
    ctx.fillStyle = proj.accent;
    ctx.font = "10px monospace";
    ctx.fillText(proj.subtitle, padX + 60, y + 30);

    // Tech pills
    let pillX = padX + 60;
    const pillY = y + 50;
    for (const t of proj.tech) {
      ctx.fillStyle = "rgba(15,15,25,0.6)";
      ctx.strokeStyle = "rgba(51,65,85,0.5)";
      ctx.lineWidth = 1;

      const textW = ctx.measureText(t).width;
      const pillW = textW + 18;
      const pillH = 16;

      drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 8);
      ctx.fill();
      drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 8);
      ctx.stroke();

      // Dot
      ctx.fillStyle = proj.accent;
      ctx.globalAlpha = opacity * 0.7;
      ctx.beginPath();
      ctx.arc(pillX + 8, pillY + pillH / 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = opacity;

      // Text
      ctx.fillStyle = "#94a3b8";
      ctx.font = "8px monospace";
      ctx.textBaseline = "middle";
      ctx.fillText(t, pillX + 14, pillY + pillH / 2 + 1);

      pillX += pillW + 6;
    }

    y += cardH + gap;
  }

  ctx.restore();
}

function drawScanlines(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = "#000";
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 2);
  }
  ctx.restore();
}

function drawStatusBar(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scrollProgress: number
) {
  const barH = 28;
  const y = H - barH;

  ctx.fillStyle = "rgba(10,10,15,0.8)";
  ctx.fillRect(0, y, W, barH);

  ctx.strokeStyle = "rgba(51,65,85,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(W, y);
  ctx.stroke();

  ctx.fillStyle = "#4b5563";
  ctx.font = "9px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("portfolio.exe", 16, y + barH / 2 + 1);

  ctx.fillStyle = "#818cf8";
  ctx.textAlign = "right";
  ctx.fillText(`${Math.round(scrollProgress * 100)}%`, W - 16, y + barH / 2 + 1);
}

/* ────────────────────────────────────────────
   Hook
   ──────────────────────────────────────────── */

export function useMonitorTexture(scrollProgress: number) {
  const texture = useStaticCanvasTexture(
    1920,
    1080,
    (ctx, canvas) => {
      const W = canvas.width;
      const H = canvas.height;

      // Background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, W, H);

      const opacity1 = crossfade(scrollProgress, 0.0, 0.35);
      const opacity2 = crossfade(scrollProgress, 0.25, 0.65);
      const opacity3 = crossfade(scrollProgress, 0.55, 1.0);

      drawAboutScreen(ctx, W, H, opacity1);
      drawSkillsScreen(ctx, W, H, opacity2, scrollProgress);
      drawProjectsScreen(ctx, W, H, opacity3);

      drawStatusBar(ctx, W, H, scrollProgress);
      drawScanlines(ctx, W, H);
    },
    [scrollProgress]
  );

  return texture;
}
