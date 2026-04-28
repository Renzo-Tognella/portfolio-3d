"use client";

import { useStaticCanvasTexture } from "@/hooks/useCanvasTexture";

/* ────────────────────────────────────────────
   Data — mirrored from PostitWall.tsx
   ──────────────────────────────────────────── */

interface PostitSkill {
  name: string;
  category: string;
  bg: string;
  textColor: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

const POSTIT_SKILLS: PostitSkill[] = [
  { name: "Ruby on Rails", category: "Backend", bg: "#6366f1", textColor: "#e0e7ff", rotation: -2.3, offsetX: -3, offsetY: 2 },
  { name: "Python", category: "Backend", bg: "#6366f1", textColor: "#e0e7ff", rotation: 1.8, offsetX: 4, offsetY: -1 },
  { name: "Java", category: "Backend", bg: "#6366f1", textColor: "#e0e7ff", rotation: -1.5, offsetX: -2, offsetY: 5 },
  { name: "REST APIs", category: "Backend", bg: "#818cf8", textColor: "#e0e7ff", rotation: 2.7, offsetX: 5, offsetY: -3 },
  { name: "RSpec / TDD", category: "Backend", bg: "#818cf8", textColor: "#e0e7ff", rotation: -3.1, offsetX: -5, offsetY: 1 },

  { name: "PostgreSQL", category: "Bancos", bg: "#06b6d4", textColor: "#164e63", rotation: 1.4, offsetX: 3, offsetY: 4 },
  { name: "Redis", category: "Bancos", bg: "#06b6d4", textColor: "#164e63", rotation: -2.8, offsetX: -4, offsetY: -2 },
  { name: "MongoDB", category: "Bancos", bg: "#22d3ee", textColor: "#164e63", rotation: 2.1, offsetX: 6, offsetY: 3 },
  { name: "SQL Avançado", category: "Bancos", bg: "#22d3ee", textColor: "#164e63", rotation: -0.9, offsetX: -1, offsetY: 6 },

  { name: "Docker", category: "Infra", bg: "#f59e0b", textColor: "#451a03", rotation: 3.2, offsetX: 7, offsetY: -4 },
  { name: "AWS", category: "Infra", bg: "#f59e0b", textColor: "#451a03", rotation: -1.7, offsetX: -6, offsetY: -5 },
  { name: "Git", category: "Infra", bg: "#fbbf24", textColor: "#451a03", rotation: 0.5, offsetX: 1, offsetY: -2 },
  { name: "CI/CD", category: "Infra", bg: "#fbbf24", textColor: "#451a03", rotation: -2.4, offsetX: -3, offsetY: 3 },

  { name: "Clean Architecture", category: "Qualidade", bg: "#f43f5e", textColor: "#ffe4e6", rotation: 1.1, offsetX: 2, offsetY: -6 },
  { name: "SOLID / Patterns", category: "Qualidade", bg: "#f43f5e", textColor: "#ffe4e6", rotation: -2.0, offsetX: -4, offsetY: 4 },
  { name: "LLMs / MCP", category: "Qualidade", bg: "#fb7185", textColor: "#ffe4e6", rotation: 2.9, offsetX: 5, offsetY: -1 },
  { name: "C++ / CV", category: "Qualidade", bg: "#fb7185", textColor: "#ffe4e6", rotation: -1.2, offsetX: -2, offsetY: -3 },
];

const CATEGORY_LEGEND = [
  { name: "Backend", color: "#6366f1" },
  { name: "Bancos", color: "#06b6d4" },
  { name: "Infra", color: "#f59e0b" },
  { name: "Qualidade & IA", color: "#f43f5e" },
];

/* ────────────────────────────────────────────
   Grid layout helper
   ──────────────────────────────────────────── */

function getGridPositions(count: number, cols: number) {
  const positions: { x: number; y: number }[] = [];
  const cellW = 92;
  const cellH = 92;
  const startX = -(cols * cellW) / 2 + cellW / 2;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: startX + col * cellW,
      y: row * cellH - 90,
    });
  }
  return positions;
}

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function drawPostitNote(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  skill: PostitSkill
) {
  const w = 80;
  const h = 80;

  ctx.save();
  ctx.translate(cx + skill.offsetX, cy + skill.offsetY);
  ctx.rotate((skill.rotation * Math.PI) / 180);
  ctx.translate(-(cx + skill.offsetX), -(cy + skill.offsetY));

  const x = cx - w / 2 + skill.offsetX;
  const y = cy - h / 2 + skill.offsetY;

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;

  // Note background with custom rounding
  ctx.fillStyle = skill.bg;
  ctx.beginPath();
  ctx.moveTo(x + 2, y);
  ctx.lineTo(x + w - 12, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + 2);
  ctx.lineTo(x + w, y + h - 2);
  ctx.quadraticCurveTo(x + w, y + h, x + w - 2, y + h);
  ctx.lineTo(x + 2, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - 2);
  ctx.lineTo(x, y + 2);
  ctx.quadraticCurveTo(x, y, x + 2, y);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Tape effect at top
  const tapeGrad = ctx.createLinearGradient(x + w * 0.15, y, x + w * 0.15, y + 12);
  tapeGrad.addColorStop(0, "rgba(255,255,255,0.25)");
  tapeGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = tapeGrad;
  ctx.fillRect(x + w * 0.15, y, w * 0.7, 12);

  // Pushpin
  const pinX = x + w / 2;
  const pinY = y - 4;
  const pinGrad = ctx.createRadialGradient(pinX - 2, pinY - 2, 1, pinX, pinY, 5);
  pinGrad.addColorStop(0, "#e2e8f0");
  pinGrad.addColorStop(1, "#64748b");
  ctx.fillStyle = pinGrad;
  ctx.beginPath();
  ctx.arc(pinX, pinY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Text
  ctx.fillStyle = skill.textColor;
  ctx.font = "600 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Word wrap for long names
  const words = skill.name.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const test = currentLine ? currentLine + " " + word : word;
    if (ctx.measureText(test).width > w - 12) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineH = 12;
  const startTextY = y + h / 2 - ((lines.length - 1) * lineH) / 2 + 4;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x + w / 2, startTextY + i * lineH);
  }

  ctx.restore();
}

/* ────────────────────────────────────────────
   Hook
   ──────────────────────────────────────────── */

export function usePostitTexture() {
  const positions = getGridPositions(POSTIT_SKILLS.length, 5);

  const texture = useStaticCanvasTexture(1024, 640, (ctx, canvas) => {
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    // Radial gradient overlays
    const g1 = ctx.createRadialGradient(W * 0.2, H * 0.5, 0, W * 0.2, H * 0.5, W * 0.5);
    g1.addColorStop(0, "rgba(99,102,241,0.08)");
    g1.addColorStop(1, "rgba(99,102,241,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(W * 0.8, H * 0.2, 0, W * 0.8, H * 0.2, W * 0.5);
    g2.addColorStop(0, "rgba(6,182,212,0.06)");
    g2.addColorStop(1, "rgba(6,182,212,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    const g3 = ctx.createRadialGradient(W * 0.5, H * 0.8, 0, W * 0.5, H * 0.8, W * 0.5);
    g3.addColorStop(0, "rgba(245,158,11,0.05)");
    g3.addColorStop(1, "rgba(245,158,11,0)");
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, W, H);

    // Header area
    const headerH = 30;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, headerH);
    ctx.lineTo(W - 20, headerH);
    ctx.stroke();

    // Pin icon (simple)
    const drawPin = (px: number, py: number, size: number) => {
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py - size);
      ctx.lineTo(px, py + size * 0.5);
      ctx.moveTo(px - size * 0.5, py - size * 0.3);
      ctx.lineTo(px + size * 0.5, py - size * 0.3);
      ctx.moveTo(px, py + size * 0.5);
      ctx.lineTo(px - size * 0.4, py + size);
      ctx.moveTo(px, py + size * 0.5);
      ctx.lineTo(px + size * 0.4, py + size);
      ctx.stroke();
    };

    const headerText = "Skills Wall";
    ctx.font = "700 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textW = ctx.measureText(headerText).width;
    const centerX = W / 2;
    const headerY = headerH / 2;

    drawPin(centerX - textW / 2 - 16, headerY, 5);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(headerText, centerX, headerY);
    drawPin(centerX + textW / 2 + 16, headerY, 5);

    // Corkboard area bounds
    const boardTop = headerH + 8;
    const boardBottom = H - 28;
    const boardH = boardBottom - boardTop;

    // Corkboard grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.015)";
    ctx.lineWidth = 1;
    for (let y = boardTop; y < boardBottom; y += 18) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(W - 20, y);
      ctx.stroke();
    }
    for (let x = 20; x < W - 20; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, boardTop);
      ctx.lineTo(x, boardBottom);
      ctx.stroke();
    }

    // Corkboard border
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, boardTop, W - 40, boardH);

    // Post-it notes
    const centerXBoard = W / 2;
    const centerYBoard = boardTop + boardH / 2;

    for (let i = 0; i < POSTIT_SKILLS.length; i++) {
      const skill = POSTIT_SKILLS[i];
      const pos = positions[i];
      drawPostitNote(ctx, centerXBoard + pos.x, centerYBoard + pos.y, skill);
    }

    // Category legend
    const legendY = H - 14;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, H - 26);
    ctx.lineTo(W - 20, H - 26);
    ctx.stroke();

    ctx.font = "7px monospace";
    ctx.textBaseline = "middle";
    let legendX = centerX;
    const totalLegendW = CATEGORY_LEGEND.reduce((acc, cat) => {
      return acc + ctx.measureText(cat.name).width + 18;
    }, 0) + (CATEGORY_LEGEND.length - 1) * 10;
    legendX = centerX - totalLegendW / 2;

    for (const cat of CATEGORY_LEGEND) {
      ctx.fillStyle = cat.color;
      ctx.fillRect(legendX, legendY - 3, 6, 6);
      legendX += 10;
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "left";
      ctx.fillText(cat.name, legendX, legendY);
      legendX += ctx.measureText(cat.name).width + 18;
    }
  }, []);

  return texture;
}
