"use client";

import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// Knowledge Base
// ═══════════════════════════════════════════════════════════════

type Intent =
  | "greeting"
  | "who"
  | "career"
  | "skills"
  | "education"
  | "projects"
  | "experience"
  | "contact"
  | "hobbies"
  | "funfact"
  | "why"
  | "location"
  | "stack"
  | "default";

interface Response {
  text: string;
  delay?: number;
}

const KNOWLEDGE: Record<Intent, Response[]> = {
  greeting: [
    { text: "👋 Olá! Eu sou o assistente virtual do Renzo. Pergunte sobre carreira, skills, projetos ou curiosidades!" },
    { text: "E aí! Tudo bem? Sou o bot do portfolio do Renzo. Me pergunta qualquer coisa sobre ele — adoro falar do meu criador 😄" },
  ],
  who: [
    { text: "Renzo Tognella de Rosa — **Backend Software Engineer** na Tradener, em Curitiba. Constrói sistemas de faturamento e gestão de risco no setor energético. Também é pesquisador publicado no IEEE e freelancer nas horas vagas." },
  ],
  career: [
    { text: "O Renzo tem **3+ anos** de experiência. Começou na UTFPR em 2022, fez pesquisa em Computer Vision (publicada no IEEE em 2023!), tocou freelance na Modulus Engenharia, e hoje está na **Tradener** como Backend Engineer — onde já foi lead interino por 3 meses." },
  ],
  skills: [
    { text: "O stack dele é bem completo:\n\n**Backend:** Ruby on Rails (95%), Python (85%), Java (70%)\n**Frontend:** React/Next.js (88%), TypeScript (90%), Three.js (75%)\n**Dados:** PostgreSQL (90%), Redis (80%), Docker (85%), AWS (75%)\n**IA:** LangChain, LangGraph, RAG, GraphRAG, LangFuse\n\nSim, ele manja de tudo um pouco 😄" },
  ],
  education: [
    { text: "Cursa **Sistemas de Informação na UTFPR** — previsão de conclusão em Julho de 2027. Antes disso, já publicou artigo no IEEE LARS/SBR 2023 sobre estimação 3D com Kinect RGB-D." },
  ],
  projects: [
    { text: "3 projetos principais:\n\n🔹 **Tradener** — Sistema de faturamento e gestão de risco no setor energético (Rails, PostgreSQL, Redis, Docker)\n\n🔹 **Modulus** — Plataforma SaaS para engenharia com pipeline LLM processando ~50 propostas/dia\n\n🔹 **IEEE Research** — Estimação 3D com Kinect, coautor no LARS/SBR 2023" },
  ],
  experience: [
    { text: "**2024 — Backend Engineer @ Tradener**\nFaturamento, APIs PLD, gestão de risco. Lead interino 3 meses.\n\n**2023 — IEEE LARS/SBR**\nCoautor. Estimação 3D com Kinect. C++ e Python.\n\n**2023 — Freelance @ Modulus**\nSaaS com pipeline LLM, ~50 propostas/dia.\n\n**2022 — Início UTFPR**" },
  ],
  contact: [
    { text: "📧 **Email:** renzo.tognella@gmail.com\n💻 **GitHub:** github.com/Renzo-Tognella\n💼 **LinkedIn:** linkedin.com/in/renzotognella\n\nEle responde em até 48h!" },
  ],
  hobbies: [
    { text: "Fora do código, o Renzo curte:\n\n🎮 Games\n📚 Leitura (especialmente sci-fi)\n☕ Café — o setup 3D com máquina de café e caneca na mesa não é à toa 😄\n🔬 Pesquisa e experimentação com IA / agentes autônomos" },
  ],
  funfact: [
    { text: "Curiosidades:\n\n• O sistema de multas que ele construiu na Tradener reduziu uma rotina de **30 horas para 5 minutos**\n• Tem artigo publicado no IEEE com **20 e poucos anos**\n• O portfolio 3D que você está vendo foi feito por ele mesmo com Three.js + R3F\n• É fissurado em agentes autônomos — usa Claude, GPT, e Hermes no dia a dia" },
    { text: "🤓 Fun fact: o Renzo é tão organizado que documenta os próprios projetos com o mesmo rigor de uma especificação de API. Esse portfolio mesmo tem docs de arquitetura, design specs, e planos de implementação." },
  ],
  why: [
    { text: "Por que engenharia de software? Ele diz: *\"Acredito que engenharia de qualidade começa com requisitos claros, código testável e documentação que importa.\"*\n\nTraduzindo: ele gosta de construir coisa que funciona de verdade, não só protótipo bonito." },
  ],
  location: [
    { text: "📍 Curitiba, PR — Brasil. Terra do pinhão, frio, e — aparentemente — de bons engenheiros de software." },
  ],
  stack: [
    { text: "Stack atual de trabalho:\n\n💎 **Rails** + **PostgreSQL** + **Redis** + **Docker**\n☁️ **AWS**\n🤖 **LangChain / LangGraph / RAG** para pipelines de IA\n🧪 **RSpec** para TDD\n⚛️ **React / Next.js / TypeScript** no front" },
  ],
  default: [
    { text: "Hmm, não tenho certeza sobre isso. Tenta perguntar sobre **carreira**, **skills**, **projetos**, **experiência**, **formação**, **contato**, ou **curiosidades**! 😊" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// Intent matcher
// ═══════════════════════════════════════════════════════════════

function matchIntent(input: string): Intent {
  const msg = input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  if (/oi|ola|hey|hi|e ai|iae|bom dia|boa tarde|boa noite|hello|fala/.test(msg)) return "greeting";
  if (/quem (e|é) |quem foi|fale sobre/.test(msg)) return "who";
  if (/carreira|trabalho|trabalha|profissao|profissão|emprego|atua/.test(msg)) return "career";
  if (/skill|habilidade|stack|tecnologia|tech|sabe|domina|conhece|linguagem|programa/.test(msg)) return "skills";
  if (/formacao|formação|faculdade|estuda|estudo|universidade|utfpr|curso|gradua/.test(msg)) return "education";
  if (/projeto|portfolio|portfólio|criou|fez|construiu|desenvolveu/.test(msg)) return "projects";
  if (/experiencia|experiência|trampo|passado|antes|historico|histórico|ja trabalhou|já trabalhou/.test(msg)) return "experience";
  if (/contato|email|github|linkedin|falar|conversar|whatsapp|telefone/.test(msg)) return "contact";
  if (/hobby|gosta|faz tempo livre|lazer|diversão|diversao|jogo|game|livro|gostar/.test(msg)) return "hobbies";
  if (/curiosidade|curioso|fato|diferente|legal|interessante|sabia|fun fact|funfact/.test(msg)) return "funfact";
  if (/por que|porque|motivação|motivacao|acredita|filosofia|valores/.test(msg)) return "why";
  if (/onde|mora|cidade|curitiba|local|endereço|endereco|brasil/.test(msg)) return "location";
  if (/stack|ferramenta|usa|docker|rails|postgres|aws/.test(msg)) return "stack";
  return "default";
}

function pickResponse(intent: Intent): string {
  const options = KNOWLEDGE[intent];
  return options[Math.floor(Math.random() * options.length)].text;
}

// ═══════════════════════════════════════════════════════════════
// ChatBot Component
// ═══════════════════════════════════════════════════════════════

interface Message {
  role: "user" | "bot";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  role: "bot",
  text: "👋 Oi! Eu sou o assistente virtual do Renzo. Pergunte sobre **carreira**, **skills**, **projetos**, **formação**, ou qualquer curiosidade!",
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);

    // Simulate typing delay
    const intent = matchIntent(text);
    const response = pickResponse(intent);
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: response }]);
      setTyping(false);
    }, delay);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 hover:shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
          borderColor: "rgba(99,102,241,0.3)",
          boxShadow: "0 0 30px -10px rgba(99,102,241,0.3)",
        }}
      >
        {open ? (
          <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex h-[450px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(10,10,15,0.95)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 24px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm">
              🤖
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-foreground">RenzoBot</p>
              <p className="font-mono text-[9px] text-muted/50">
                {typing ? "digitando..." : "online"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-accent/20 text-foreground rounded-br-md"
                      : "bg-white/[0.03] text-muted/90 rounded-bl-md border border-white/[0.04]"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[0.04] bg-white/[0.03] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted/40 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted/40 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Pergunte algo sobre o Renzo..."
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted/30 focus:border-accent/40 focus:outline-none transition-colors"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="rounded-xl bg-accent/20 px-3.5 py-2.5 text-sm text-accent transition-all hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Simple markdown formatter
// ═══════════════════════════════════════════════════════════════

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="font-mono text-accent text-[12px]">$1</code>')
    .replace(/\n/g, "<br>");
}
