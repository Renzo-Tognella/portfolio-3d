"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// Data — rendered as code files
// ═══════════════════════════════════════════════════════════════

const FILES: Record<string, { language: string; content: string[] }> = {
  "about.tsx": {
    language: "typescript",
    content: [
      'import { Profile, Stats } from "@/data";',
      "",
      "export const Renzo: Profile = {",
      '  name: "Renzo Tognella de Rosa",',
      '  role: "Backend Software Engineer",',
      '  company: "Tradener",',
      '  location: "Curitiba, PR — Brasil",',
      '  education: "Sistemas de Informação, UTFPR (Jul/2027)",',
      '  focus: "Sistemas distribuídos, APIs, gestão de risco energético",',
      '  research: "IEEE LARS/SBR 2023 — 3D Estimation with Kinect",',
      '  freelance: "Modulus Engenharia — SaaS Platform",',
      "};",
      "",
      "export const Bio = `",
      "  Backend Software Engineer no setor energético,",
      "  construindo sistemas de faturamento e gestão",
      "  de risco que processam milhões em transações.",
      "  Pesquisador publicado no IEEE em visão",
      "  computacional. Acredito que engenharia de",
      "  qualidade começa com requisitos claros,",
      "  código testável e documentação que importa.",
      "`;",
    ],
  },
  "stats.ts": {
    language: "typescript",
    content: [
      'import { Stat } from "@/types";',
      "",
      "export const STATS: Stat[] = [",
      "  {",
      '    icon: "clock",',
      '    value: 3,',
      '    suffix: "+",',
      '    label: "anos de experiência",',
      "  },",
      "  {",
      '    icon: "zap",',
      '    value: 50,',
      '    suffix: "+",',
      '    label: "propostas/dia — Modulus",',
      "  },",
      "  {",
      '    icon: "file-text",',
      '    value: 1,',
      '    suffix: "",',
      '    label: "publicação IEEE",',
      "  },",
      "  {",
      '    icon: "users",',
      '    value: 3,',
      '    suffix: "",',
      '    label: "meses como lead interino",',
      "  },",
      "];",
    ],
  },
  "career.json": {
    language: "json",
    content: [
      "{",
      '  "timeline": [',
      "    {",
      '      "year": "2024",',
      '      "title": "Backend Engineer @ Tradener",',
      '      "description": "Faturamento, gestão de risco, APIs PLD. Lead interino por 3 meses.",',
      '      "tags": ["Rails", "PostgreSQL", "Redis", "Docker"]',
      "    },",
      "    {",
      '      "year": "2023",',
      '      "title": "Coautor — IEEE LARS/SBR",',
      '      "description": "Estimação de centro 3D com Kinect RGB-D. C++ e Python.",',
      '      "tags": ["C++", "Python", "Computer Vision"]',
      "    },",
      "    {",
      '      "year": "2023",',
      '      "title": "Freelance — Modulus Engenharia",',
      '      "description": "SaaS com pipeline LLM, ~50 propostas/dia, analytics.",',
      '      "tags": ["Rails", "Python", "LLMs", "PostgreSQL"]',
      "    },",
      "    {",
      '      "year": "2022",',
      '      "title": "UTFPR — Sistemas de Informação",',
      '      "description": "Início da graduação. Previsão conclusão: Jul/2027.",',
      '      "tags": []',
      "    }",
      "  ]",
      "}",
    ],
  },
  "README.md": {
    language: "markdown",
    content: [
      "# Sobre Mim",
      "",
      "## Quem sou",
      "Backend Software Engineer no setor energético.",
      "",
      "## O que faço",
      "- Sistemas de faturamento e gestão de risco (Tradener)",
      "- SaaS com pipeline LLM (Modulus Engenharia)",
      "- Pesquisa em visão computacional (IEEE LARS/SBR)",
      "",
      "## Stack principal",
      "`Rails` `Python` `PostgreSQL` `Redis` `Docker` `AWS` `LangChain`",
      "",
      "## Contato",
      "[GitHub](https://github.com/Renzo-Tognella) · [LinkedIn](https://linkedin.com/in/renzotognella) · [Email](mailto:renzo.tognella@gmail.com)",
    ],
  },
};

const FILE_ICONS: Record<string, string> = {
  tsx: "⚛️",
  ts: "📘",
  json: "📋",
  md: "📝",
};

// ═══════════════════════════════════════════════════════════════
// Syntax highlighter
// ═══════════════════════════════════════════════════════════════

function highlightLine(line: string, language: string) {
  if (language === "json") {
    return line
      .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="text-cyan-400/70">$1</span>:')
      .replace(/: "((?:\\.|[^"\\])*)"/g, ': <span class="text-accent font-semibold" style="text-shadow:0 0 12px rgba(99,102,241,0.4)">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-rose-400">$1</span>')
      .replace(/[{}[\]]/g, '<span class="text-muted/30">$&</span>');
  }
  if (language === "typescript") {
    return line
      .replace(/\b(const|let|var|export|import|from|interface|type|as)\b/g, '<span class="text-violet-400/60">$1</span>')
      .replace(/("(?:\\.|[^"\\])*"|'[^']*'|`[^`]*`)/g, '<span class="text-accent font-semibold" style="text-shadow:0 0 12px rgba(99,102,241,0.4)">$1</span>')
      .replace(/\b(string|number|boolean|void|any|never|Profile|Stat)\b/g, '<span class="text-cyan-400/70">$1</span>')
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-rose-400">$1</span>')
      .replace(/(\/\/.*$)/g, '<span class="text-muted/30 italic">$1</span>')
      .replace(/([{}[\]();:,]|\{|\}|=>)/g, '<span class="text-muted/30">$1</span>');
  }
  if (language === "markdown") {
    return line
      .replace(/^(#{1,6}\s.+)$/, '<span class="text-indigo-400 font-bold">$1</span>')
      .replace(/(\[.*?\])\(.*?\)/g, '<span class="text-accent font-semibold" style="text-shadow:0 0 8px rgba(99,102,241,0.3)">$1</span>')
      .replace(/`([^`]+)`/g, '<span class="text-accent">`$1`</span>')
      .replace(/^(\s*[-*]\s)/, '<span class="text-accent/60">$1</span>');
  }
  return line;
}

// ═══════════════════════════════════════════════════════════════
// Typewriter hook
// ═══════════════════════════════════════════════════════════════

function useTypewriter(fullText: string, start: boolean, speed = 35) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!start) return;
    let i = 0;
    setText("");
    const timer = setInterval(() => {
      i++;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [fullText, start, speed]);
  return text;
}

// ═══════════════════════════════════════════════════════════════
// Scroll reveal
// ═══════════════════════════════════════════════════════════════
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ═══════════════════════════════════════════════════════════════
// Main IDE About Section
// ═══════════════════════════════════════════════════════════════

export function About() {
  const { ref: sectionRef, visible } = useReveal(0.05);
  const [activeFile, setActiveFile] = useState("about.tsx");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");

  const file = FILES[activeFile];
  const ext = activeFile.split(".").pop() || "";

  // Typewriter for terminal
  const terminalLines = [
    { type: "prompt", text: "cat about.md" },
    { type: "output", text: '> name: "Renzo Tognella de Rosa"' },
    { type: "output", text: '> role: "Backend Software Engineer"' },
    { type: "output", text: '> company: "Tradener"' },
    { type: "output", text: '> location: "Curitiba, PR — Brasil"' },
  ];

  const [terminalLineIndex, setTerminalLineIndex] = useState(0);

  useEffect(() => {
    if (!terminalVisible) return;
    if (terminalLineIndex >= terminalLines.length) return;
    const timer = setTimeout(() => {
      setTerminalLineIndex((i) => i + 1);
    }, terminalLineIndex === 0 ? 600 : 300);
    return () => clearTimeout(timer);
  }, [terminalVisible, terminalLineIndex]);

  return (
    <section id="about" ref={sectionRef} className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* ── Holographic scanline overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.3) 2px, rgba(99,102,241,0.3) 4px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* ── Heading ── */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Perfil</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Sobre{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent"
              style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))" }}>
              Mim
            </span>
          </h2>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="h-1 w-1 rounded-full bg-accent" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>

        {/* ── IDE Window ── */}
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-1000"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0d1117",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            boxShadow: "0 0 60px -20px rgba(99,102,241,0.15), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.04] bg-[#0d1117] px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
              <div className="h-3 w-3 rounded-full bg-green-400/60" />
            </div>
            <span className="ml-3 font-mono text-[11px] text-muted/50">
              {activeFile} — portfolio
            </span>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded px-2 py-0.5 font-mono text-[10px] text-muted/40 hover:text-muted transition-colors"
              >
                {sidebarOpen ? "⫷" : "⫸"}
              </button>
            </div>
          </div>

          <div className="flex min-h-[500px]">
            {/* ── Sidebar ── */}
            <div
              className="shrink-0 overflow-hidden border-r border-white/[0.04] bg-[#0d1117]/50 transition-all duration-300"
              style={{ width: sidebarOpen ? 180 : 0, opacity: sidebarOpen ? 1 : 0 }}
            >
              <div className="p-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/40">Explorer</span>
                <div className="mt-3 space-y-0.5">
                  {Object.keys(FILES).map((fname) => (
                    <button
                      key={fname}
                      onClick={() => setActiveFile(fname)}
                      className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left font-mono text-[11px] transition-colors ${
                        activeFile === fname
                          ? "bg-white/[0.06] text-foreground"
                          : "text-muted/60 hover:text-muted/80"
                      }`}
                    >
                      <span className="text-[10px]">{FILE_ICONS[fname.split(".").pop() || ""] || "📄"}</span>
                      {fname}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Editor ── */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/[0.04] bg-[#0d1117]/80">
                {Object.keys(FILES).map((fname) => (
                  <button
                    key={fname}
                    onClick={() => setActiveFile(fname)}
                    className={`flex items-center gap-1.5 border-r border-white/[0.03] px-4 py-2 font-mono text-[11px] transition-colors ${
                      activeFile === fname
                        ? "border-t-2 border-t-accent bg-[#0d1117] text-foreground -mt-[1px]"
                        : "text-muted/40 hover:text-muted/70"
                    }`}
                  >
                    <span className="text-[10px]">{FILE_ICONS[fname.split(".").pop() || ""]}</span>
                    {fname}
                  </button>
                ))}
              </div>

              {/* Code area */}
              <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-[13px] leading-7">
                {file.content.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-4 w-8 shrink-0 select-none text-right text-[11px] text-white/[0.12]">
                      {i + 1}
                    </span>
                    <span
                      className="whitespace-pre"
                      dangerouslySetInnerHTML={{
                        __html: line === "" ? " " : highlightLine(line, file.language) || line,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* ── Terminal ── */}
              <div className="border-t border-white/[0.04] bg-[#0d1117]/90">
                <div
                  className="flex cursor-pointer items-center gap-2 px-4 py-1.5"
                  onClick={() => setTerminalVisible(!terminalVisible)}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted/40">
                    {terminalVisible ? "▼ Terminal" : "▶ Terminal"}
                  </span>
                  {!terminalVisible && (
                    <span className="font-mono text-[10px] text-muted/30">portfolio — bash</span>
                  )}
                </div>
                {terminalVisible && (
                  <div className="border-t border-white/[0.03] px-4 py-3 font-mono text-[12px] leading-6">
                    {terminalLines.slice(0, terminalLineIndex).map((line, i) => (
                      <div key={i}>
                        {line.type === "prompt" ? (
                          <span>
                            <span className="text-green-400">visitor@portfolio</span>
                            <span className="text-muted">:</span>
                            <span className="text-blue-400">~</span>
                            <span className="text-muted">$ </span>
                            <span className="text-foreground">{line.text}</span>
                          </span>
                        ) : (
                          <span className="text-muted/70">{line.text}</span>
                        )}
                      </div>
                    ))}
                    {terminalLineIndex >= terminalLines.length && (
                      <div>
                        <span className="text-green-400">visitor@portfolio</span>
                        <span className="text-muted">:</span>
                        <span className="text-blue-400">~</span>
                        <span className="text-muted">$ </span>
                        <span className="inline-block h-4 w-1.5 animate-pulse bg-accent align-middle" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── IDE Status Bar ── */}
            <div className="flex items-center gap-6 border-t border-white/[0.04] bg-[#0d1117]/95 px-4 py-2">
              <StatusMetric icon="⏳" value={3} suffix="+" label="anos exp" visible={visible} />
              <span className="text-[10px] text-muted/15">|</span>
              <StatusMetric icon="⚡" value={50} suffix="+" label="prop/dia" visible={visible} />
              <span className="text-[10px] text-muted/15">|</span>
              <StatusMetric icon="📄" value={1} suffix="" label="IEEE" visible={visible} />
              <span className="text-[10px] text-muted/15">|</span>
              <StatusMetric icon="👥" value={3} suffix="" label="meses lead" visible={visible} />
              <div className="ml-auto flex items-center gap-3">
                <span className="font-mono text-[9px] text-muted/25">UTF-8</span>
                <span className="font-mono text-[9px] text-muted/25">TypeScript</span>
                <span className="font-mono text-[9px] text-accent/50">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Status bar metric (inline counter)
// ═══════════════════════════════════════════════════════════════

function StatusMetric({
  icon, value, suffix, label, visible,
}: {
  icon: string; value: number; suffix: string; label: string; visible: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, value]);

  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted/50 hover:text-muted/80 transition-colors">
      <span className="text-[11px]">{icon}</span>
      <span className="tabular-nums text-foreground/70 font-medium">{count}{suffix}</span>
      <span className="text-muted/30">{label}</span>
    </div>
  );
}
