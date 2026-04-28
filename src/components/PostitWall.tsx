"use client";

import { useMemo } from "react";

/* ────────────────────────────────────────────
   Skill data — mirrored from Skills.tsx
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
  // Backend — indigo
  { name: "Ruby on Rails", category: "Backend", bg: "#6366f1", textColor: "#e0e7ff", rotation: -2.3, offsetX: -3, offsetY: 2 },
  { name: "Python", category: "Backend", bg: "#6366f1", textColor: "#e0e7ff", rotation: 1.8, offsetX: 4, offsetY: -1 },
  { name: "Java", category: "Backend", bg: "#6366f1", textColor: "#e0e7ff", rotation: -1.5, offsetX: -2, offsetY: 5 },
  { name: "REST APIs", category: "Backend", bg: "#818cf8", textColor: "#e0e7ff", rotation: 2.7, offsetX: 5, offsetY: -3 },
  { name: "RSpec / TDD", category: "Backend", bg: "#818cf8", textColor: "#e0e7ff", rotation: -3.1, offsetX: -5, offsetY: 1 },

  // Bancos de Dados — cyan
  { name: "PostgreSQL", category: "Bancos", bg: "#06b6d4", textColor: "#164e63", rotation: 1.4, offsetX: 3, offsetY: 4 },
  { name: "Redis", category: "Bancos", bg: "#06b6d4", textColor: "#164e63", rotation: -2.8, offsetX: -4, offsetY: -2 },
  { name: "MongoDB", category: "Bancos", bg: "#22d3ee", textColor: "#164e63", rotation: 2.1, offsetX: 6, offsetY: 3 },
  { name: "SQL Avançado", category: "Bancos", bg: "#22d3ee", textColor: "#164e63", rotation: -0.9, offsetX: -1, offsetY: 6 },

  // Infraestrutura — amber
  { name: "Docker", category: "Infra", bg: "#f59e0b", textColor: "#451a03", rotation: 3.2, offsetX: 7, offsetY: -4 },
  { name: "AWS", category: "Infra", bg: "#f59e0b", textColor: "#451a03", rotation: -1.7, offsetX: -6, offsetY: -5 },
  { name: "Git", category: "Infra", bg: "#fbbf24", textColor: "#451a03", rotation: 0.5, offsetX: 1, offsetY: -2 },
  { name: "CI/CD", category: "Infra", bg: "#fbbf24", textColor: "#451a03", rotation: -2.4, offsetX: -3, offsetY: 3 },

  // Qualidade & IA — rose
  { name: "Clean Architecture", category: "Qualidade", bg: "#f43f5e", textColor: "#ffe4e6", rotation: 1.1, offsetX: 2, offsetY: -6 },
  { name: "SOLID / Patterns", category: "Qualidade", bg: "#f43f5e", textColor: "#ffe4e6", rotation: -2.0, offsetX: -4, offsetY: 4 },
  { name: "LLMs / MCP", category: "Qualidade", bg: "#fb7185", textColor: "#ffe4e6", rotation: 2.9, offsetX: 5, offsetY: -1 },
  { name: "C++ / CV", category: "Qualidade", bg: "#fb7185", textColor: "#ffe4e6", rotation: -1.2, offsetX: -2, offsetY: -3 },
];

/* ────────────────────────────────────────────
   Category legend colors
   ──────────────────────────────────────────── */

const CATEGORY_LEGEND = [
  { name: "Backend", color: "#6366f1" },
  { name: "Bancos", color: "#06b6d4" },
  { name: "Infra", color: "#f59e0b" },
  { name: "Qualidade & IA", color: "#f43f5e" },
];

/* ────────────────────────────────────────────
   Post-it note component
   ──────────────────────────────────────────── */

function PostitNote({ skill, index }: { skill: PostitSkill; index: number }) {
  return (
    <div
      className="absolute flex flex-col items-center justify-center"
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: skill.bg,
        color: skill.textColor,
        transform: `rotate(${skill.rotation}deg) translate(${skill.offsetX}px, ${skill.offsetY}px)`,
        boxShadow: "2px 3px 8px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.1)",
        borderRadius: "2px 12px 2px 2px",
        padding: "6px",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "8px",
        fontWeight: 600,
        lineHeight: 1.2,
        textAlign: "center",
        zIndex: index,
      }}
    >
      {/* Pushpin dot */}
      <div
        style={{
          position: "absolute",
          top: "-4px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, #e2e8f0, #64748b)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      />
      {/* Tape effect — slight gradient at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "12px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
          borderRadius: "2px 10px 0 0",
        }}
      />
      <span style={{ marginTop: "4px", wordBreak: "break-word" }}>
        {skill.name}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────
   Grid layout helper — positions notes in a 5×4 grid
   ──────────────────────────────────────────── */

function useGridPositions(count: number, cols: number) {
  return useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    const cellW = 92;  // cell width including gap
    const cellH = 92;  // cell height including gap
    const startX = -(cols * cellW) / 2 + cellW / 2;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push({
        x: startX + col * cellW,
        y: row * cellH - 90, // start from upper area
      });
    }
    return positions;
  }, [count, cols]);
}

/* ────────────────────────────────────────────
   Main PostitWall component
   ──────────────────────────────────────────── */

export function PostitWall() {
  const positions = useGridPositions(POSTIT_SKILLS.length, 5);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a1a2e",
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.05) 0%, transparent 50%)
        `,
        overflow: "hidden",
        padding: "12px 10px 6px",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginBottom: "4px",
          padding: "0 8px 6px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Pin icon */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f43f5e"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v7M9 5l3-3 3 3M12 9v10M5 22h14" />
        </svg>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Skills Wall
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f43f5e"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v7M9 5l3-3 3 3M12 9v10M5 22h14" />
        </svg>
      </div>

      {/* Corkboard grid with post-its */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Corkboard texture lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.015) 18px, rgba(255,255,255,0.015) 19px),
              repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.01) 18px, rgba(255,255,255,0.01) 19px)
            `,
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />

        {/* Post-it notes */}
        {POSTIT_SKILLS.map((skill, i) => {
          const pos = positions[i];
          return (
            <div
              key={skill.name}
              style={{
                position: "absolute",
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <PostitNote skill={skill} index={i} />
            </div>
          );
        })}
      </div>

      {/* Category legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "6px 8px 2px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginTop: "4px",
        }}
      >
        {CATEGORY_LEGEND.map((cat) => (
          <div
            key={cat.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "7px",
              color: "#94a3b8",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "1px",
                backgroundColor: cat.color,
              }}
            />
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
