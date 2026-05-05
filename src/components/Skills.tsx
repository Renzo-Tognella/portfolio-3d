"use client";

import { useEffect, useRef, useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// Skill Tree Data
// ═══════════════════════════════════════════════════════════════

interface SkillNode {
  name: string;
  level?: number;
  color: string;
  children?: SkillNode[];
}

const TREE: SkillNode[] = [
  {
    name: "Backend",
    color: "#6366f1",
    children: [
      { name: "Ruby on Rails", level: 95, color: "#818cf8" },
      { name: "Python", level: 85, color: "#818cf8" },
      { name: "Java / Spring", level: 70, color: "#818cf8" },
      { name: "REST / GraphQL", level: 90, color: "#a5b4fc" },
      { name: "RSpec / TDD", level: 85, color: "#a5b4fc" },
    ],
  },
  {
    name: "Frontend",
    color: "#8b5cf6",
    children: [
      { name: "React / Next.js", level: 88, color: "#a78bfa" },
      { name: "TypeScript", level: 90, color: "#a78bfa" },
      { name: "Tailwind CSS", level: 85, color: "#c4b5fd" },
      { name: "Three.js / R3F", level: 75, color: "#c4b5fd" },
    ],
  },
  {
    name: "Dados & Infra",
    color: "#06b6d4",
    children: [
      { name: "PostgreSQL", level: 90, color: "#22d3ee" },
      { name: "Redis", level: 80, color: "#22d3ee" },
      { name: "Docker", level: 85, color: "#67e8f9" },
      { name: "AWS", level: 75, color: "#67e8f9" },
      { name: "MongoDB", level: 65, color: "#67e8f9" },
    ],
  },
  {
    name: "Qualidade & IA",
    color: "#f43f5e",
    children: [
      { name: "Clean Architecture", level: 90, color: "#fb7185" },
      { name: "SOLID / Patterns", level: 85, color: "#fb7185" },
      { name: "LLMs / MCP", level: 80, color: "#fda4af" },
      { name: "Git / CI/CD", level: 90, color: "#fda4af" },
      { name: "C++ / CV", level: 70, color: "#fda4af" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// Tree Node Component
// ═══════════════════════════════════════════════════════════════

function TreeNode({
  node,
  x,
  y,
  parentX,
  parentY,
  depth,
  visible,
  index,
}: {
  node: SkillNode;
  x: number;
  y: number;
  parentX: number | null;
  parentY: number | null;
  depth: number;
  visible: boolean;
  index: number;
}) {
  const isLeaf = !node.children;
  const nodeR = isLeaf ? 4 : 7;
  const delay = depth * 300 + index * 100;

  return (
    <g style={{ opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${delay}ms` }}>
      {/* Connection line from parent */}
      {parentX !== null && parentY !== null && (
        <line
          x1={parentX}
          y1={parentY}
          x2={x}
          y2={y}
          stroke={node.color}
          strokeWidth={isLeaf ? 0.8 : 1.5}
          strokeOpacity={0.3}
          strokeDasharray={visible ? "1000" : "1000"}
          strokeDashoffset={visible ? "0" : "1000"}
          style={{
            transition: visible
              ? `stroke-dashoffset 1.2s ease ${delay + 200}ms`
              : "none",
          }}
        />
      )}

      {/* Node circle */}
      <circle
        cx={x}
        cy={y}
        r={nodeR}
        fill={isLeaf ? node.color : "transparent"}
        stroke={node.color}
        strokeWidth={isLeaf ? 1.5 : 2}
        style={{
          filter: `drop-shadow(0 0 ${isLeaf ? 4 : 8}px ${node.color}80)`,
          transition: `r 0.5s ease ${delay}ms`,
        }}
      />

      {/* Node glow ring (branches only) */}
      {!isLeaf && (
        <circle
          cx={x}
          cy={y}
          r={14}
          fill="none"
          stroke={node.color}
          strokeWidth={0.5}
          strokeOpacity={0.15}
          className="animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      )}

      {/* Label */}
      <text
        x={x + (isLeaf ? 10 : 0)}
        y={y + (isLeaf ? 4 : -12)}
        fill={isLeaf ? "#94a3b8" : node.color}
        fontSize={isLeaf ? 11 : 13}
        fontFamily="var(--font-mono), monospace"
        fontWeight={isLeaf ? 400 : 700}
        textAnchor={isLeaf ? "start" : "middle"}
        style={{
          transition: `opacity 0.3s ease ${delay + 100}ms`,
        }}
      >
        {node.name}
      </text>

      {/* Level badge (leaves only) */}
      {node.level !== undefined && (
        <text
          x={x + 10}
          y={y + 18}
          fill={node.color}
          fontSize={9}
          fontFamily="var(--font-mono), monospace"
          textAnchor="start"
          opacity={0.7}
        >
          {node.level}%
        </text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tree Layout Calculator
// ═══════════════════════════════════════════════════════════════

interface LayoutNode {
  node: SkillNode;
  x: number;
  y: number;
  parentX: number | null;
  parentY: number | null;
  depth: number;
  index: number;
}

function computeLayout(
  branches: SkillNode[],
  width: number,
  height: number
): LayoutNode[] {
  const result: LayoutNode[] = [];
  const rootX = width / 2;
  const rootY = 50;

  const branchCount = branches.length;
  const branchSpacing = width / (branchCount + 1);
  const branchY = rootY + 120;

  // Root
  result.push({
    node: { name: "Tech Stack", color: "#6366f1", children: branches },
    x: rootX,
    y: rootY,
    parentX: null,
    parentY: null,
    depth: 0,
    index: 0,
  });

  // Branches
  branches.forEach((branch, bi) => {
    const bx = branchSpacing * (bi + 1);
    const by = branchY;

    result.push({
      node: branch,
      x: bx,
      y: by,
      parentX: rootX,
      parentY: rootY + 12,
      depth: 1,
      index: bi,
    });

    // Leaves
    const leafCount = branch.children?.length ?? 0;
    const leafStartY = by + 80;
    const leafSpacingY = 42;
    const leafX = bx;

    branch.children?.forEach((leaf, li) => {
      result.push({
        node: leaf,
        x: leafX,
        y: leafStartY + li * leafSpacingY,
        parentX: bx,
        parentY: by + 10,
        depth: 2,
        index: li,
      });
    });
  });

  return result;
}

// ═══════════════════════════════════════════════════════════════
// Main SkillTree Component
// ═══════════════════════════════════════════════════════════════

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [dims, setDims] = useState({ w: 900, h: 600 });

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
      { threshold: 0.15 }
    );
    observer.observe(el);

    // Responsive sizing
    const updateSize = () => {
      if (el) {
        const rect = el.getBoundingClientRect();
        setDims({ w: Math.max(600, rect.width - 48), h: Math.max(400, rect.width * 0.6) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const layout = useMemo(
    () => computeLayout(TREE, dims.w, dims.h),
    [dims]
  );

  // Separate root, branches, and leaves for staggered reveal
  const rootNodes = layout.filter((n) => n.depth === 0);
  const branchNodes = layout.filter((n) => n.depth === 1);
  const leafNodes = layout.filter((n) => n.depth === 2);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Competências
            </span>
          </div>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
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

        {/* SVG Tree */}
        <div
          className="relative mx-auto w-full rounded-3xl border overflow-hidden"
          style={{
            borderColor: "rgba(255,255,255,0.05)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.005) 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02), 0 24px 48px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(99,102,241,0.3) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <svg
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            className="w-full"
            style={{ minHeight: dims.h }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background gradient blobs */}
            <defs>
              <radialGradient id="glow-indigo" cx="25%" cy="30%" r="40%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-violet" cx="50%" cy="40%" r="35%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-cyan" cx="75%" cy="35%" r="35%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-rose" cx="85%" cy="30%" r="35%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#glow-indigo)" />
            <rect width="100%" height="100%" fill="url(#glow-violet)" />
            <rect width="100%" height="100%" fill="url(#glow-cyan)" />
            <rect width="100%" height="100%" fill="url(#glow-rose)" />

            {/* Root node */}
            {rootNodes.map((n, i) => (
              <TreeNode key={n.node.name} {...n} visible={visible} index={i} />
            ))}

            {/* Branch nodes */}
            {branchNodes.map((n, i) => (
              <TreeNode key={n.node.name} {...n} visible={visible} index={i} />
            ))}

            {/* Leaf nodes */}
            {leafNodes.map((n, i) => (
              <TreeNode key={n.node.name} {...n} visible={visible} index={i} />
            ))}
          </svg>
        </div>

        {/* Category legend */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {TREE.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: cat.color,
                  boxShadow: `0 0 8px ${cat.color}60`,
                }}
              />
              <span className="font-mono text-xs text-muted">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
