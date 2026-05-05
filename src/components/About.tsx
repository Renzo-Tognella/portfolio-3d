"use client";

import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// Data — Python files with print() statements
// ═══════════════════════════════════════════════════════════════

const FILES: Record<string, { language: string; content: string[] }> = {
  "profile.py": {
    language: "python",
    content: [
      '"""Renzo Tognella de Rosa — Perfil"""',
      "",
      "from dataclasses import dataclass",
      "",
      "@dataclass",
      "class Profile:",
      '    name: str = "Renzo Tognella de Rosa"',
      '    role: str = "Backend Software Engineer"',
      '    company: str = "Tradener"',
      '    location: str = "Curitiba, PR — Brasil"',
      '    education: str = "Sistemas de Informação, UTFPR (Jul/2027)"',
      '    focus: str = "Sistemas distribuídos, APIs, gestão de risco energético"',
      '    research: str = "IEEE LARS/SBR 2023 — 3D Estimation with Kinect"',
      '    freelance: str = "Modulus Engenharia — SaaS Platform"',
      "",
      "",
      "if __name__ == '__main__':",
      '    print("👤 Perfil")',
      '    print("-" * 30)',
      '    print(f"Nome:      {Profile.name}")',
      '    print(f"Cargo:     {Profile.role}")',
      '    print(f"Empresa:   {Profile.company}")',
      '    print(f"Local:     {Profile.location}")',
      '    print(f"Formação:  {Profile.education}")',
      '    print(f"Foco:      {Profile.focus}")',
      '    print(f"Pesquisa:  {Profile.research}")',
      '    print(f"Freelance: {Profile.freelance}")',
    ],
  },
  "stats.py": {
    language: "python",
    content: [
      '"""Estatísticas de carreira"""',
      "",
      "stats = {",
      '    "anos_experiencia": 3,',
      '    "propostas_dia": 50,',
      '    "publicacoes_ieee": 1,',
      '    "meses_lead": 3,',
      "}",
      "",
      "if __name__ == '__main__':",
      '    print("📊 Stats")',
      '    print("-" * 30)',
      '    print(f"⏳ {stats[\"anos_experiencia\"]}+ anos de experiência")',
      '    print(f"⚡ {stats[\"propostas_dia\"]}+ propostas/dia — Modulus")',
      '    print(f"📄 {stats[\"publicacoes_ieee\"]} publicação IEEE")',
      '    print(f"👥 {stats[\"meses_lead\"]} meses como lead interino")',
    ],
  },
  "career.py": {
    language: "python",
    content: [
      '"""Linha do tempo da carreira"""',
      "",
      "timeline = [",
      "    {",
      '        "ano": 2024,',
      '        "cargo": "Backend Engineer @ Tradener",',
      '        "desc": "Faturamento, gestão de risco, APIs PLD",',
      '        "detalhe": "Lead interino por 3 meses",',
      '        "tags": ["Rails", "PostgreSQL", "Redis", "Docker"],',
      "    },",
      "    {",
      '        "ano": 2023,',
      '        "cargo": "Coautor — IEEE LARS/SBR",',
      '        "desc": "Estimação 3D com Kinect RGB-D",',
      '        "detalhe": "C++ e Python. Computer Vision.",',
      '        "tags": ["C++", "Python", "Computer Vision"],',
      "    },",
      "    {",
      '        "ano": 2023,',
      '        "cargo": "Freelance — Modulus Engenharia",',
      '        "desc": "SaaS com pipeline LLM",',
      '        "detalhe": "~50 propostas/dia, analytics",',
      '        "tags": ["Rails", "Python", "LLMs", "PostgreSQL"],',
      "    },",
      "    {",
      '        "ano": 2022,',
      '        "cargo": "UTFPR — Sistemas de Informação",',
      '        "desc": "Início da graduação",',
      '        "detalhe": "Previsão conclusão: Jul/2027",',
      '        "tags": [],',
      "    },",
      "]",
      "",
      "if __name__ == '__main__':",
      '    print("🗓 Trajetória")',
      '    print("-" * 50)',
      "    for entry in timeline:",
      '        print(f"\\n{entry[\"ano\"]} — {entry[\"cargo\"]}")',
      '        print(f"  {entry[\"desc\"]}")',
      '        print(f"  {entry[\"detalhe\"]}")',
      "        if entry['tags']:",
      "            print(f\"  {' · '.join(entry['tags'])}\")",
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
      "## Stack principal",
      "`Rails` `Python` `PostgreSQL` `Redis` `Docker` `AWS` `LangChain`",
      "",
      "## Contato",
      "[GitHub](https://github.com/Renzo-Tognella) · [LinkedIn](https://linkedin.com/in/renzotognella) · [Email](mailto:renzo.tognella@gmail.com)",
    ],
  },
};

const FILE_ICONS: Record<string, string> = {
  py: "🐍",
  md: "📝",
};

// ═══════════════════════════════════════════════════════════════
// Token-based syntax highlighter — renders real React elements
// ═══════════════════════════════════════════════════════════════

interface Token {
  text: string;
  className: string;
}

function tokenize(line: string, language: string): Token[] {
  if (language === "python") {
    return tokenizePython(line);
  }
  if (language === "markdown") {
    return tokenizeMarkdown(line);
  }
  return [{ text: line || " ", className: "" }];
}

function tokenizePython(line: string): Token[] {
  if (!line.trim()) return [{ text: " ", className: "" }];
  const tokens: Token[] = [];
  let remaining = line;

  // Order matters — more specific first
  const patterns: { regex: RegExp; className: string }[] = [
    { regex: /^(@\w+)/, className: "text-amber-400/60" },                           // decorators
    { regex: /^(f"(?:\\.|[^"\\])*")/, className: "code-glow" },                    // f-strings with glow
    { regex: /^(f'(?:\\.|[^'\\])*')/, className: "code-glow" },                    // f-strings single-quote
    { regex: /^("(?:\\.|[^"\\])*")/, className: "code-glow" },                     // regular strings with glow
    { regex: /^('(?:\\.|[^'\\])*')/, className: "code-glow" },                     // single-quoted strings
    { regex: /^("""[\s\S]*?""")/, className: "text-muted/40 italic" },             // docstrings
    { regex: /^(#.*)/, className: "text-muted/30 italic" },                         // comments
    { regex: /^\b(import|from|class|def|if|for|in|return|as|elif|else|and|or|not|True|False|None|print)\b/,
      className: "text-violet-400/50" },                                             // keywords
    { regex: /^\b(\d+)\b/, className: "text-rose-400/70" },                         // numbers
    { regex: /^([{}[\]():,=+\-*/])/, className: "text-muted/25" },                  // operators
    { regex: /^(\s+)/, className: "" },                                             // whitespace
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { regex, className } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push({ text: match[0], className });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Take one non-matching character
      tokens.push({ text: remaining[0], className: "" });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

function tokenizeMarkdown(line: string): Token[] {
  const tokens: Token[] = [];
  let remaining = line;

  const patterns: { regex: RegExp; className: string }[] = [
    { regex: /^(#{1,6}\s.+)/, className: "text-indigo-400 font-bold" },
    { regex: /^(\[.*?\])\(.*?\)/, className: "code-glow" },
    { regex: /^(`[^`]+`)/, className: "text-amber-400/70" },
    { regex: /^(\s*[-*]\s)/, className: "text-accent/50" },
    { regex: /^(\s+)/, className: "" },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { regex, className } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push({ text: match[0], className });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: remaining[0], className: "" });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

function CodeLine({ line, language }: { line: string; language: string }) {
  if (!line) return <span> </span>;
  const tokens = tokenize(line, language);
  return (
    <>
      {tokens.map((t, i) =>
        t.className ? (
          <span key={i} className={t.className}>{t.text}</span>
        ) : (
          <span key={i}>{t.text}</span>
        )
      )}
    </>
  );
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
  const [activeFile, setActiveFile] = useState("profile.py");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(false);

  const file = FILES[activeFile];

  const terminalLines = [
    { type: "prompt", text: "python profile.py" },
    { type: "output", text: "👤 Perfil" },
    { type: "output", text: "------------------------------" },
    { type: "output", text: 'Nome:      "Renzo Tognella de Rosa"' },
    { type: "output", text: 'Cargo:     "Backend Software Engineer"' },
    { type: "output", text: 'Empresa:   "Tradener"' },
  ];

  const [terminalLineIndex, setTerminalLineIndex] = useState(0);

  useEffect(() => {
    if (!terminalVisible) return;
    if (terminalLineIndex >= terminalLines.length) return;
    const timer = setTimeout(() => {
      setTerminalLineIndex((i) => i + 1);
    }, terminalLineIndex === 0 ? 600 : 250);
    return () => clearTimeout(timer);
  }, [terminalVisible, terminalLineIndex]);

  return (
    <section id="about" ref={sectionRef} className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* ── Holographic scanline overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.025]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.3) 2px, rgba(99,102,241,0.3) 4px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-full px-6 md:px-10">
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
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto rounded px-2 py-0.5 font-mono text-[10px] text-muted/40 hover:text-muted transition-colors"
            >
              {sidebarOpen ? "⫷" : "⫸"}
            </button>
          </div>

          <div className="flex h-[920px]">
            {/* ── Sidebar ── */}
            <div
              className="shrink-0 overflow-hidden border-r border-white/[0.04] bg-[#0d1117]/50 transition-all duration-300"
              style={{ width: sidebarOpen ? 170 : 0, opacity: sidebarOpen ? 1 : 0 }}
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
                    <span className="mr-4 w-8 shrink-0 select-none text-right text-[11px] text-white/[0.10]">
                      {i + 1}
                    </span>
                    <span className="whitespace-pre">
                      <CodeLine line={line} language={file.language} />
                    </span>
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
                            <span className="text-green-400/80">visitor@portfolio</span>
                            <span className="text-muted/40">:</span>
                            <span className="text-blue-400/80">~</span>
                            <span className="text-muted/40">$ </span>
                            <span className="text-foreground/80">{line.text}</span>
                          </span>
                        ) : (
                          <span className="code-glow">{line.text}</span>
                        )}
                      </div>
                    ))}
                    {terminalLineIndex >= terminalLines.length && (
                      <div>
                        <span className="text-green-400/80">visitor@portfolio</span>
                        <span className="text-muted/40">:</span>
                        <span className="text-blue-400/80">~</span>
                        <span className="text-muted/40">$ </span>
                        <span className="inline-block h-4 w-1.5 animate-pulse bg-accent align-middle" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── IDE Status Bar ── */}
              <div className="flex items-center gap-5 border-t border-white/[0.04] bg-[#0d1117]/95 px-4 py-2">
                <StatusMetric icon="3" value={3} suffix="+" label="anos exp" visible={visible} />
                <span className="text-[10px] text-muted/15">|</span>
                <StatusMetric icon="50" value={50} suffix="+" label="prop/dia" visible={visible} />
                <span className="text-[10px] text-muted/15">|</span>
                <StatusMetric icon="1" value={1} suffix="" label="IEEE pub" visible={visible} />
                <span className="text-[10px] text-muted/15">|</span>
                <StatusMetric icon="3" value={3} suffix="" label="meses lead" visible={visible} />
                <div className="ml-auto flex items-center gap-3">
                  <span className="font-mono text-[9px] text-muted/25">Python 3.12</span>
                  <span className="font-mono text-[9px] text-muted/25">UTF-8</span>
                  <span className="font-mono text-[9px] text-accent/50">✦</span>
                </div>
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
      <span className="tabular-nums text-foreground/70 font-medium">{count}{suffix}</span>
      <span className="text-muted/30">{label}</span>
    </div>
  );
}
